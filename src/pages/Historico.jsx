import { useMemo, useState } from "react";

export default function Historico() {
  const profiles = useMemo(
    () => [
      { id: "escola-cambauba", name: "Escola Cambauba" },
      { id: "trabalho-principal", name: "Trabalho Principal" },
      { id: "freela", name: "Freela" },
    ],
    [],
  );

  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id ?? "");

  return (
    <div className="min-h-[calc(100dvh-220px)]">
      <div className="relative">
        <div className="pointer-events-none select-none text-[44px] font-semibold tracking-tight text-text-3/20">
          Histórico
        </div>
      </div>

      <div className="mt-2 flex justify-center">
        <div className="w-full max-w-[540px]">
          <label className="sr-only" htmlFor="perfil-historico">
            Selecionar perfil
          </label>
          <select
            id="perfil-historico"
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full rounded-[18px] border border-border-1 bg-[rgba(20,40,63,0.35)] px-4 py-3 text-[13px] font-semibold text-text-2 outline-none focus:ring-2 focus:ring-primary"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900">
                {p.name}
              </option>
            ))}
          </select>
          <div className="mt-2 text-[11px] text-text-3">
            Exibindo registros de:{" "}
            <span className="font-semibold text-text-2">
              {profiles.find((p) => p.id === selectedProfileId)?.name ?? "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-14 text-center text-[13px] text-text-3">
        Nenhum registro encontrado.
      </div>
    </div>
  );
}

