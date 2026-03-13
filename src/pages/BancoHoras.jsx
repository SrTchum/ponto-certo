import { useEffect, useMemo, useState } from "react";
import { LogIn, LogOut, PauseCircle } from "lucide-react";

const STORAGE_KEY = "ponto-certo-registros";
const SALDO_KEY = "ponto-certo-saldo-acumulado";
const JORNADA_PADRAO_MIN = 8 * 60; // 8h em minutos

function getTodayKey() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function parseHHMM(str) {
  if (!str || str.length < 5) return null;
  const [h, m] = str.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function minutosParaHHMM(totalMin) {
  const sign = totalMin < 0 ? "-" : "+";
  const abs = Math.abs(totalMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function loadTodayRecord() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const todayKey = getTodayKey();
    return parsed?.[todayKey] ?? {};
  } catch {
    return {};
  }
}

function saveTodayRecord(record) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const todayKey = getTodayKey();
    const next = {
      ...all,
      [todayKey]: record,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore write errors
  }
}

function loadSaldoAcumulado() {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(SALDO_KEY);
    if (raw === null) return 0;
    const n = Number(raw);
    return Number.isNaN(n) ? 0 : n;
  } catch {
    return 0;
  }
}

function saveSaldoAcumulado(minutos) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SALDO_KEY, String(minutos));
  } catch {
    // ignore
  }
}

/** Calcula minutos trabalhados no dia a partir de entrada, intervalo e saída */
function calcularTrabalhadoHoje(record) {
  const entrada = parseHHMM(record?.entrada);
  const saida = parseHHMM(record?.saida);
  const intervalo = parseHHMM(record?.intervalo);
  if (entrada == null || saida == null) return 0;
  if (intervalo != null) {
    return intervalo - entrada + (saida - intervalo);
  }
  return saida - entrada;
}

function ProfileSelect() {
  return (
    <div className="hidden" />
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
  const [record, setRecord] = useState(() => loadTodayRecord());
  const [saldoAcumuladoMin, setSaldoAcumuladoMin] = useState(() => loadSaldoAcumulado());

  useEffect(() => {
    saveTodayRecord(record);
  }, [record]);

  useEffect(() => {
    saveSaldoAcumulado(saldoAcumuladoMin);
  }, [saldoAcumuladoMin]);

  function marcarHorario(tipo) {
    const agora = new Date();
    const valor = agora.toTimeString().slice(0, 5);
    setRecord((prev) => {
      const next = { ...prev, [tipo]: valor };
      if (tipo === "saida" && !prev.saldoProcessado) {
        const trabalhadoMin = calcularTrabalhadoHoje({ ...next });
        const delta = trabalhadoMin - JORNADA_PADRAO_MIN;
        setSaldoAcumuladoMin((s) => s + delta);
        next.saldoProcessado = true;
      }
      return next;
    });
  }

  const values = useMemo(() => {
    const trabalhadoMin = calcularTrabalhadoHoje(record);
    const trabalhadoStr =
      trabalhadoMin > 0
        ? `${String(Math.floor(trabalhadoMin / 60)).padStart(2, "0")}:${String(trabalhadoMin % 60).padStart(2, "0")}`
        : "00:00";
    const esperadoStr = "08:00";
    const saldoDiaMin = trabalhadoMin - JORNADA_PADRAO_MIN;
    const saldoDiaStr = minutosParaHHMM(saldoDiaMin);
    return {
      saldoAcumulado: minutosParaHHMM(saldoAcumuladoMin),
      trabalhado: trabalhadoStr,
      esperado: esperadoStr,
      saldo: saldoDiaStr,
    };
  }, [tab, record, saldoAcumuladoMin]);

  return (
    <div className="min-h-[calc(100dvh-220px)]">
      <div className="relative">
        <div className="pointer-events-none select-none text-[40px] font-semibold tracking-tight text-text-3/15">
          Banco de Horas
        </div>
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

      <div className="mt-8 space-y-4">
        <div className="text-[12px] font-semibold text-text-3">
          Registrar hoje
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => marcarHorario("entrada")}
            className={`flex items-center justify-between rounded-[20px] border border-emerald-400/40 bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 py-4 text-left text-white shadow-[0_16px_40px_rgba(16,185,129,0.45)] transition ${
              record?.entrada ? "opacity-60 hover:opacity-80" : "hover:brightness-110"
            }`}
          >
            <div>
              <div className="text-[12px] uppercase tracking-wide opacity-80">
                Entrada
              </div>
              <div className="mt-1 text-[24px] font-semibold font-mono">
                {record?.entrada ?? "--:--"}
              </div>
            </div>
            <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <LogIn size={26} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => marcarHorario("intervalo")}
            className={`flex items-center justify-between rounded-[20px] border border-sky-400/40 bg-gradient-to-r from-sky-500 to-sky-400 px-5 py-4 text-left text-white shadow-[0_16px_40px_rgba(56,189,248,0.45)] transition ${
              record?.intervalo ? "opacity-60 hover:opacity-80" : "hover:brightness-110"
            }`}
          >
            <div>
              <div className="text-[12px] uppercase tracking-wide opacity-80">
                Intervalo
              </div>
              <div className="mt-1 text-[24px] font-semibold font-mono">
                {record?.intervalo ?? "--:--"}
              </div>
            </div>
            <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <PauseCircle size={26} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => marcarHorario("saida")}
            className={`flex items-center justify-between rounded-[20px] border border-rose-400/40 bg-gradient-to-r from-rose-500 to-rose-400 px-5 py-4 text-left text-white shadow-[0_16px_40px_rgba(244,63,94,0.45)] transition ${
              record?.saida ? "opacity-60 hover:opacity-80" : "hover:brightness-110"
            }`}
          >
            <div>
              <div className="text-[12px] uppercase tracking-wide opacity-80">
                Saída
              </div>
              <div className="mt-1 text-[24px] font-semibold font-mono">
                {record?.saida ?? "--:--"}
              </div>
            </div>
            <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <LogOut size={26} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

