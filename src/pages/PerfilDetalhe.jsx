import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadProfiles, saveProfiles } from "../lib/profileStorage";

export default function PerfilDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const profiles = loadProfiles();
    const found = profiles.find((p) => String(p.id) === String(id));
    if (!found) {
      navigate("/perfis");
      return;
    }
    setProfile(found);
  }, [id, navigate]);

  if (!profile) {
    return (
      <div className="min-h-[calc(100dvh-220px)]">
        <div className="text-[13px] text-text-3">Carregando perfil...</div>
      </div>
    );
  }

  function updateProfile(patch) {
    setProfile((prev) => ({ ...prev, ...patch }));
  }

  function handleSave(e) {
    e.preventDefault();
    const profiles = loadProfiles();
    const updated = profiles.map((p) =>
      String(p.id) === String(profile.id) ? profile : p,
    );
    saveProfiles(updated);
    navigate("/perfis");
  }

  return (
    <div className="min-h-[calc(100dvh-220px)]">
      <div className="pointer-events-none select-none text-[32px] font-semibold tracking-tight text-text-3/20">
        Perfil
      </div>

      <form
        onSubmit={handleSave}
        className="mt-6 grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]"
      >
        <div className="space-y-4">
          <div className="rounded-[18px] border border-border-1 bg-[rgba(15,23,42,0.9)] px-5 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            <div className="text-[13px] font-semibold text-text-1">
              Informações do perfil
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label
                  htmlFor="perfil-nome-edit"
                  className="block text-[12px] font-medium text-text-3"
                >
                  Nome do perfil
                </label>
                <input
                  id="perfil-nome-edit"
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="mt-1 w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.96)] px-3 py-2 text-[13px] text-text-1 outline-none placeholder:text-text-3 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="entrada-fixa"
                    className="block text-[12px] font-medium text-text-3"
                  >
                    Horário de entrada
                  </label>
                  <input
                    id="entrada-fixa"
                    type="time"
                    value={profile.entradaFixa}
                    onChange={(e) =>
                      updateProfile({ entradaFixa: e.target.value })
                    }
                    className="mt-1 w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.96)] px-3 py-2 text-[13px] text-text-1 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="saida-fixa"
                    className="block text-[12px] font-medium text-text-3"
                  >
                    Horário de saída
                  </label>
                  <input
                    id="saida-fixa"
                    type="time"
                    value={profile.saidaFixa}
                    onChange={(e) =>
                      updateProfile({ saidaFixa: e.target.value })
                    }
                    className="mt-1 w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.96)] px-3 py-2 text-[13px] text-text-1 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="carga-diaria"
                  className="block text-[12px] font-medium text-text-3"
                >
                  Carga horária diária (horas)
                </label>
                <input
                  id="carga-diaria"
                  type="number"
                  min={0}
                  step={0.5}
                  value={profile.cargaDiariaMinutos / 60}
                  onChange={(e) =>
                    updateProfile({
                      cargaDiariaMinutos: Number(e.target.value || 0) * 60,
                    })
                  }
                  className="mt-1 w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.96)] px-3 py-2 text-[13px] text-text-1 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-border-1 bg-[rgba(15,23,42,0.9)] px-5 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            <div className="text-[13px] font-semibold text-text-1">
              Lembretes e tolerâncias
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="lembrete-antecedencia"
                  className="block text-[12px] font-medium text-text-3"
                >
                  Antecedência de lembrete (min)
                </label>
                <input
                  id="lembrete-antecedencia"
                  type="number"
                  min={0}
                  value={profile.lembreteAntecedenciaMin}
                  onChange={(e) =>
                    updateProfile({
                      lembreteAntecedenciaMin: Number(e.target.value || 0),
                    })
                  }
                  className="mt-1 w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.96)] px-3 py-2 text-[13px] text-text-1 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="tolerancia-esquecimento"
                  className="block text-[12px] font-medium text-text-3"
                >
                  Tolerância de esquecimento (min)
                </label>
                <input
                  id="tolerancia-esquecimento"
                  type="number"
                  min={0}
                  value={profile.toleranciaEsquecimentoMin}
                  onChange={(e) =>
                    updateProfile({
                      toleranciaEsquecimentoMin: Number(e.target.value || 0),
                    })
                  }
                  className="mt-1 w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.96)] px-3 py-2 text-[13px] text-text-1 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[18px] border border-border-1 bg-[rgba(15,23,42,0.9)] px-5 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            <div className="text-[13px] font-semibold text-text-1">
              Alarmes
            </div>

            <div className="mt-4 space-y-3 text-[13px] text-text-2">
              {[
                {
                  key: "alarmeAtivo",
                  label: "Ativar alarme",
                  description:
                    "Liga o sistema de lembrete para este perfil.",
                },
                {
                  key: "somAtivo",
                  label: "Habilitar som",
                  description:
                    "Toca um alerta sonoro nas notificações compatíveis.",
                },
                {
                  key: "vibracaoAtiva",
                  label: "Habilitar vibração",
                  description:
                    "Ativa a vibração em dispositivos móveis suportados.",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    updateProfile({ [item.key]: !profile[item.key] })
                  }
                  className="flex w-full items-center justify-between rounded-[14px] border border-border-1 bg-[rgba(15,23,42,0.98)] px-3 py-2.5 text-left hover:border-primary/70 transition"
                >
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[11px] text-text-3">
                      {item.description}
                    </div>
                  </div>
                  <div
                    className={[
                      "relative inline-flex h-6 w-11 items-center rounded-full border transition",
                      profile[item.key]
                        ? "border-primary bg-primary/90"
                        : "border-border-1 bg-[rgba(15,23,42,1)]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-block h-4 w-4 transform rounded-full bg-white shadow transition",
                        profile[item.key] ? "translate-x-[18px]" : "translate-x-[4px]",
                      ].join(" ")}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-border-1 bg-[rgba(15,23,42,0.9)] px-5 py-4 text-[12px] text-text-3">
            <div>
              Interface preparada para integração com{" "}
              <span className="font-semibold text-text-1">
                APIs nativas de notificação
              </span>{" "}
              (push, notificações locais, alarmes do sistema).
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-[999px] bg-primary text-[13px] font-semibold text-slate-900 shadow-[0_14px_34px_rgba(249,115,22,0.55)] hover:brightness-110 transition"
            >
              Salvar alterações
            </button>
            <button
              type="button"
              onClick={() => navigate("/perfis")}
              className="inline-flex h-10 items-center justify-center rounded-[999px] border border-border-1 bg-[rgba(15,23,42,0.9)] text-[12px] font-semibold text-text-2 hover:bg-[rgba(15,23,42,1)] transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

