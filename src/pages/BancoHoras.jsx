import { useMemo, useState } from "react";

function ProfileSelect() {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-border-1 bg-[rgba(20,40,63,0.35)] px-4 py-3 text-text-3">
      <div className="h-8 w-8 rounded-full bg-[rgba(255,255,255,0.06)]" />
      <div className="flex-1 text-[13px] font-semibold text-text-2">
        Selecione um perfil...
      </div>
      <div className="h-2 w-2 rotate-45 border-r-2 border-b-2 border-text-3" />
    </div>
  );
}

function TimeValue({ value, className = "" }) {
  return (
    <div className={["font-mono tracking-tight", className].join(" ")}>
      {value}
    </div>
  );
}

function Tabs({ value, onChange }) {
  return (
    <div className="mt-4 rounded-[14px] border border-border-1 bg-[rgba(20,40,63,0.35)] p-1">
      <div className="grid grid-cols-2">
        {[
          { id: "semana", label: "Semana" },
          { id: "mes", label: "Mês" },
        ].map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={[
                "h-9 rounded-[12px] text-[13px] font-semibold transition",
                active
                  ? "bg-white text-slate-800 shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
                  : "text-text-3 hover:text-text-2",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BancoHoras() {
  const [tab, setTab] = useState("semana");

  const values = useMemo(() => {
    const saldo = "+00:00";
    return {
      saldoAcumulado: saldo,
      trabalhado: "00:00",
      esperado: "00:00",
      saldo,
    };
  }, [tab]);

  return (
    <div className="min-h-[calc(100dvh-220px)]">
      <div className="pointer-events-none select-none text-[44px] font-semibold tracking-tight text-text-3/20">
        Banco de Horas
      </div>

      <div className="mt-2">
        <ProfileSelect />
      </div>

      <div className="mt-5 rounded-[18px] border border-border-1 bg-accentBlue px-6 py-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
        <div className="text-[12px] font-semibold text-white/85">Saldo Acumulado</div>
        <TimeValue value={values.saldoAcumulado} className="mt-2 text-[42px] font-semibold text-white" />
      </div>

      <Tabs value={tab} onChange={setTab} />

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-[16px] border border-border-1 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
          <div className="text-[10px] font-semibold tracking-wider text-slate-400">
            TRABALHADO
          </div>
          <TimeValue value={values.trabalhado} className="mt-2 text-[18px] font-semibold text-success" />
        </div>

        <div className="rounded-[16px] border border-border-1 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
          <div className="text-[10px] font-semibold tracking-wider text-slate-400">
            ESPERADO
          </div>
          <TimeValue value={values.esperado} className="mt-2 text-[18px] font-semibold text-success" />
        </div>

        <div className="rounded-[16px] border border-border-1 bg-accentBlue px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="text-[10px] font-semibold tracking-wider text-white/75">
            SALDO
          </div>
          <TimeValue value={values.saldo} className="mt-2 text-[18px] font-semibold text-white" />
        </div>
      </div>
    </div>
  );
}

