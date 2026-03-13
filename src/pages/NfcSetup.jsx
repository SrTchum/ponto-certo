import { useState } from "react";
import { CheckCircle2, Cpu, Nfc, Radio } from "lucide-react";
import { NFC_STATUS, simulateNfcSession } from "../api/nfcService";

export default function NfcSetup() {
  const [status, setStatus] = useState(NFC_STATUS.IDLE);
  const [readOnly, setReadOnly] = useState(false);
  const [result, setResult] = useState(null);

  async function handleStart() {
    setStatus(NFC_STATUS.WAITING);
    setResult(null);

    const response = await simulateNfcSession({ readOnly });
    if (response.ok) {
      setStatus(NFC_STATUS.SUCCESS);
      setResult(response.tag);
    } else {
      setStatus(NFC_STATUS.ERROR);
      setResult({ error: response.error });
    }
  }

  const isWaiting = status === NFC_STATUS.WAITING;

  return (
    <div className="min-h-[calc(100dvh-220px)]">
      <div className="pointer-events-none select-none text-[32px] font-semibold tracking-tight text-text-3/20">
        NFC
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <div className="rounded-[20px] border border-border-1 bg-[rgba(15,23,42,0.95)] px-6 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(15,23,42,1)] text-primary">
                <Nfc size={26} />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-text-1">
                  Configuração de Tag / Crachá
                </div>
                <div className="text-[12px] text-text-3">
                  Aproxime o cartão ou tag NFC do leitor para associar ao seu
                  perfil.
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-[13px] text-text-2">
              <p>
                1. Certifique-se de que o NFC está ativado no dispositivo.
              </p>
              <p>2. Selecione se a tag será somente leitura ou leitura/escrita.</p>
              <p>3. Clique em &quot;Iniciar leitura/gravação&quot; e aproxime a tag.</p>
            </div>

            <div className="mt-5 flex items-center gap-2 text-[12px] text-text-2">
              <input
                id="nfc-readonly"
                type="checkbox"
                checked={readOnly}
                onChange={(e) => setReadOnly(e.target.checked)}
                className="h-4 w-4 rounded border-border-1 bg-[rgba(15,23,42,1)] text-primary"
              />
              <label htmlFor="nfc-readonly" className="select-none">
                Marcar como somente leitura
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
              <button
                type="button"
                onClick={handleStart}
                disabled={isWaiting}
                className="inline-flex h-11 items-center justify-center rounded-[999px] bg-primary px-5 text-[13px] font-semibold text-slate-900 shadow-[0_16px_40px_rgba(249,115,22,0.6)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 transition"
              >
                <Radio className="mr-2" size={18} />
                {isWaiting ? "Aguardando Tag..." : "Iniciar leitura/gravação"}
              </button>

              <div className="flex items-center gap-2 text-[12px] text-text-3">
                <Cpu size={14} />
                <span>
                  Interface pronta para Web NFC / APIs nativas em dispositivos
                  móveis.
                </span>
              </div>
            </div>
          </div>

          {result && (
            <div className="rounded-[18px] border border-border-1 bg-[rgba(15,23,42,0.9)] px-5 py-4 text-[12px] text-text-2">
              {result.error ? (
                <div className="text-rose-300">{result.error}</div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 size={16} />
                    <span>Tag configurada com sucesso.</span>
                  </div>
                  <div className="text-text-3">
                    ID:{" "}
                    <span className="font-mono text-[11px] text-text-1">
                      {result.id}
                    </span>
                  </div>
                  <div className="text-text-3">
                    Modo:{" "}
                    <span className="font-semibold">
                      {result.mode === "read-only"
                        ? "Somente leitura"
                        : "Leitura e escrita"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-border-1 bg-[rgba(15,23,42,0.95)] px-5 py-5 text-[12px] text-text-3 shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
          <div className="text-[13px] font-semibold text-text-1">
            Status da sessão
          </div>

          <div className="mt-3">
            {status === NFC_STATUS.IDLE && (
              <p>Aguardando para iniciar uma nova sessão NFC.</p>
            )}
            {status === NFC_STATUS.WAITING && (
              <p className="text-primary">
                Aguardando aproximação da Tag... mantenha o cartão próximo ao
                dispositivo.
              </p>
            )}
            {status === NFC_STATUS.SUCCESS && (
              <p className="text-emerald-300">
                Tag lida/grava com sucesso. Você pode associá-la a um perfil de
                usuário.
              </p>
            )}
            {status === NFC_STATUS.ERROR && (
              <p className="text-rose-300">
                Não foi possível completar a sessão NFC simulada. Tente
                novamente.
              </p>
            )}
          </div>

          <div className="mt-5 border-t border-dashed border-border-1 pt-4 text-[11px] text-text-3">
            Esta tela segue o visual dark mode do aplicativo e foi pensada para
            ser reutilizada tanto no navegador (quando Web NFC estiver
            disponível) quanto em camadas nativas (Android/iOS) via bridge.
          </div>
        </div>
      </div>
    </div>
  );
}

