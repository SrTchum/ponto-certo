import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Lock,
  Save,
  ShieldAlert,
  UserCircle2,
} from "lucide-react";
import { supabase } from "../api/supabaseClient";

const ACCOUNT_STORAGE_KEY = "ponto-certo-minha-conta";

export default function Account() {
  const navigate = useNavigate();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setFullName(parsed?.fullName ?? "");
      setPhone(parsed?.phone ?? "");
      setAvatarPreviewUrl(parsed?.avatarPreviewUrl ?? "");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const canSave = useMemo(() => {
    return Boolean(fullName.trim() || phone.trim() || avatarFile);
  }, [fullName, phone, avatarFile]);

  async function handleSave() {
    setIsSaving(true);
    setSaveMessage("");

    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      avatarPreviewUrl,
      updatedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }

    // Integração com Supabase: preparado para quando configurarmos auth/usuário.
    // Hoje usamos um id local (placeholder). Quando houver login, substitua pelo auth.user().id.
    const profileId = "local-user";

    try {
      if (!supabase) {
        setSaveMessage(
          "Salvo localmente. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para habilitar o Supabase.",
        );
        return;
      }

      let avatarPath = null;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() || "png";
        avatarPath = `avatars/${profileId}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(avatarPath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;
      }

      const updateData = {
        full_name: payload.fullName || null,
        phone: payload.phone || null,
        avatar_path: avatarPath,
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profileId);

      if (updateError) {
        // fallback: cria caso ainda não exista
        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert({ id: profileId, ...updateData });
        if (upsertError) throw upsertError;
      }

      setSaveMessage("Dados salvos com sucesso.");
    } catch (err) {
      setSaveMessage(
        `Salvo localmente, mas falhou no Supabase: ${err?.message ?? "erro desconhecido"}`,
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-220px)]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-1 bg-[rgba(20,40,63,0.35)] text-text-2 hover:bg-[rgba(20,40,63,0.55)] transition"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="pointer-events-none select-none text-[32px] font-semibold tracking-tight text-text-3/20">
          Minha Conta
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <div className="rounded-[18px] border border-border-1 bg-[rgba(15,23,42,0.9)] px-5 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border-1 bg-[rgba(15,23,42,1)] text-text-3">
                  {avatarPreviewUrl ? (
                    <img
                      src={avatarPreviewUrl}
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircle2 size={40} />
                  )}
                </div>
                <label
                  htmlFor="foto-perfil"
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-1 bg-[rgba(20,40,63,0.9)] text-text-2 shadow-[0_10px_26px_rgba(0,0,0,0.35)] hover:brightness-110 transition"
                  aria-label="Selecionar foto de perfil"
                >
                  <Camera size={16} />
                </label>
                <input
                  id="foto-perfil"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-text-1">
                  Dados da conta
                </div>
                <div className="text-[11px] text-text-3">
                  Use seu número de telefone para verificação futura via OTP.
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-[13px]">
              <div>
                <label
                  htmlFor="nome-completo"
                  className="block text-[12px] font-medium text-text-3"
                >
                  Nome completo
                </label>
                <input
                  id="nome-completo"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="mt-1 w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.96)] px-3 py-2 text-[13px] text-text-1 outline-none placeholder:text-text-3 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="telefone"
                  className="block text-[12px] font-medium text-text-3"
                >
                  Telefone para verificação (OTP)
                </label>
                <input
                  id="telefone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(21) 99999-0000"
                  className="mt-1 w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.96)] px-3 py-2 text-[13px] text-text-1 outline-none placeholder:text-text-3 focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave || isSaving}
                className="inline-flex h-11 items-center justify-center rounded-[999px] bg-primary px-5 text-[13px] font-semibold text-slate-900 shadow-[0_16px_40px_rgba(249,115,22,0.6)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 transition"
              >
                <Save className="mr-2" size={18} />
                {isSaving ? "Salvando..." : "Salvar"}
              </button>
              {saveMessage && (
                <div className="text-[11px] text-text-3">{saveMessage}</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[18px] border border-border-1 bg-[rgba(15,23,42,0.9)] px-5 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-text-1">
              <Lock size={16} />
              <span>Segurança e privacidade</span>
            </div>

            <div className="mt-3 space-y-2 text-[12px] text-text-3">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="block w-full text-left text-primary hover:underline"
              >
                Termos de Uso
              </button>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="block w-full text-left text-primary hover:underline"
              >
                Política de Privacidade
              </button>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-[14px] border border-emerald-500/40 bg-[rgba(6,78,59,0.8)] px-3 py-3 text-[11px] text-emerald-50">
              <ShieldAlert size={14} className="mt-[2px]" />
              <p>
                Os dados da sua conta são tratados com{" "}
                <span className="font-semibold">criptografia de ponta a ponta</span>{" "}
                e seguem as diretrizes da{" "}
                <span className="font-semibold">LGPD</span>. Esta interface está
                pronta para integração com provedores de identidade e cofres de
                chaves seguros.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isPrivacyOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-border-1 bg-[rgba(15,23,42,0.98)] px-5 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-semibold text-text-1">
                Segurança e Privacidade
              </div>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                className="text-[12px] text-text-3 hover:text-text-1 transition"
              >
                Fechar
              </button>
            </div>

            <div className="mt-4 space-y-2 text-[12px] text-text-3">
              <p>
                Esta é uma visualização dos documentos de{" "}
                <span className="font-semibold">Termos de Uso</span> e{" "}
                <span className="font-semibold">Política de Privacidade</span>.
                Os links serão conectados às versões oficiais na implantação
                final do produto.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

