function ProfileSelect() {
  return (
    <div className="w-full max-w-[540px]">
      <div className="flex items-center gap-3 rounded-[18px] border border-border-1 bg-[rgba(20,40,63,0.35)] px-4 py-3 text-text-3">
        <div className="h-8 w-8 rounded-full bg-[rgba(255,255,255,0.06)]" />
        <div className="flex-1 text-[13px] font-semibold text-text-2">
          Selecione um perfil...
        </div>
        <div className="h-2 w-2 rotate-45 border-r-2 border-b-2 border-text-3" />
      </div>
    </div>
  );
}

export default function Historico() {
  return (
    <div className="min-h-[calc(100dvh-220px)]">
      <div className="relative">
        <div className="pointer-events-none select-none text-[44px] font-semibold tracking-tight text-text-3/20">
          Histórico
        </div>
      </div>

      <div className="mt-2 flex justify-center">
        <ProfileSelect />
      </div>

      <div className="mt-14 text-center text-[13px] text-text-3">
        Nenhum registro encontrado.
      </div>
    </div>
  );
}

