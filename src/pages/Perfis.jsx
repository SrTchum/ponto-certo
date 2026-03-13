import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadProfiles, saveProfiles } from "../lib/profileStorage";

export default function Perfis() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState(() => loadProfiles());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  function handleCreate(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    const newProfile = {
      id: Date.now(),
      name: trimmed,
      entradaFixa: "08:00",
      saidaFixa: "17:00",
      cargaDiariaMinutos: 8 * 60,
      lembreteAntecedenciaMin: 10,
      toleranciaEsquecimentoMin: 15,
      alarmeAtivo: true,
      somAtivo: true,
      vibracaoAtiva: true,
    };

    setProfiles((prev) => [...prev, newProfile]);
    setName("");
    setIsDialogOpen(false);
  }

  const hasProfiles = profiles.length > 0;

  return (
    <div className="relative min-h-[calc(100dvh-220px)]">
      <div className="pointer-events-none select-none text-[44px] font-semibold tracking-tight text-text-3/20">
        Perfis
      </div>

      <div className="mt-6 flex flex-col gap-5 md:flex-row">
        <div className="md:w-2/3">
        {!hasProfiles ? (
          <div className="text-center">
            <div className="text-[13px] text-text-2">Nenhum perfil criado.</div>
            <div className="mt-1 text-[12px] text-text-3">
              Crie seu primeiro perfil para começar a registrar ponto.
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[520px] rounded-[18px] border border-border-1 bg-[rgba(20,40,63,0.4)] px-5 py-5 shadow-[0_10px_26px_rgba(0,0,0,0.25)]">
            <div className="mb-3 text-[13px] font-semibold text-text-2">
              Perfis criados
            </div>
            <ul className="space-y-2">
              {profiles.map((profile) => (
                <li
                  key={profile.id}
                  onClick={() => navigate(`/perfis/${profile.id}`)}
                  className="flex cursor-pointer items-center justify-between rounded-[14px] border border-border-1 bg-[rgba(15,23,42,0.9)] px-4 py-3 text-[13px] hover:border-primary/70 hover:bg-[rgba(15,23,42,0.98)] transition"
                >
                  <span className="font-semibold text-text-1">
                    {profile.name}
                  </span>
                  <span className="text-[11px] text-text-3">
                    Toque para editar horários e alarmes
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/45">
          <div className="w-full max-w-sm rounded-2xl border border-border-1 bg-[rgba(10,27,51,0.98)] px-5 py-5 shadow-[0_18px_46px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-semibold text-text-1">
                Novo perfil
              </div>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="text-[12px] text-text-3 hover:text-text-1 transition"
              >
                Fechar
              </button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleCreate}>
              <div className="space-y-1.5">
                <label
                  htmlFor="perfil-nome"
                  className="block text-[12px] font-medium text-text-3"
                >
                  Nome do perfil
                </label>
                <input
                  id="perfil-nome"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Trabalho, Projeto X..."
                  className="w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.9)] px-3 py-2 text-[13px] text-text-1 outline-none placeholder:text-text-3 focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-[999px] bg-primary text-[13px] font-semibold text-slate-900 shadow-[0_12px_32px_rgba(249,115,22,0.45)] hover:brightness-110 transition"
              >
                Salvar perfil
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-[92px] right-[18px] h-12 w-12 rounded-full bg-accentBlue text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] hover:brightness-110 transition"
        aria-label="Criar perfil"
      >
        <div className="flex items-center justify-center">
          <Plus size={22} strokeWidth={2.6} />
        </div>
      </button>
    </div>
  );
}

