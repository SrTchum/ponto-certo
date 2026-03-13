import { Link } from "react-router-dom";

const PROFILE_STORAGE_KEY = "ponto-certo-perfis";

function loadProfiles() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDatePtBR(date) {
  const d = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  return d.replace(".", "");
}

export default function Hoje() {
  const now = new Date();
  const dateLine = formatDatePtBR(now);
  const perfis = loadProfiles();
  const hasProfile = perfis.length > 0;

  return (
    <div className="min-h-[calc(100dvh-220px)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[34px] font-semibold tracking-tight text-text-1">
            Hoje
          </div>
          <div className="mt-1 text-[13px] text-text-3">{dateLine}</div>
        </div>

        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border-1 bg-[rgba(20,40,63,0.35)] px-4 py-2 text-[12px] text-text-3">
          <span className="h-2 w-2 rounded-full bg-[rgba(231,238,249,0.28)]" />
          <span className="font-medium">Sem entrada</span>
        </div>
      </div>

      {!hasProfile ? (
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-[560px] rounded-[18px] border border-border-1 bg-[rgba(20,40,63,0.38)] px-6 py-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <div className="text-[13px] font-semibold text-[#fbbf24]">
              Nenhum perfil criado ainda.
            </div>
            <Link
              to="/perfis"
              className="mt-2 inline-flex items-center justify-center text-[12px] font-semibold text-primary hover:opacity-90"
            >
              Criar perfil →
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-[560px] rounded-[18px] border border-border-1 bg-[rgba(20,40,63,0.38)] px-6 py-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <div className="text-[13px] font-semibold text-text-2">
              Você já tem {perfis.length} {perfis.length === 1 ? "perfil" : "perfis"} criado
              {perfis.length === 1 ? "" : "s"}.
            </div>
            <div className="mt-1 text-[12px] text-text-3">
              Use a aba <span className="font-semibold">Banco</span> para registrar os horários do dia.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

