import { Plus } from "lucide-react";

export default function Perfis() {
  return (
    <div className="relative min-h-[calc(100dvh-220px)]">
      <div className="pointer-events-none select-none text-[44px] font-semibold tracking-tight text-text-3/20">
        Perfis
      </div>

      <div className="mt-8 text-center">
        <div className="text-[13px] text-text-2">Nenhum perfil criado.</div>
        <div className="mt-1 text-[12px] text-text-3">
          Crie seu primeiro perfil para começar a registrar ponto.
        </div>
      </div>

      <button
        type="button"
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

