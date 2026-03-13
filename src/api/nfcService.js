const NFC_STATUS = {
  IDLE: "idle",
  WAITING: "waiting",
  SUCCESS: "success",
  ERROR: "error",
};

export { NFC_STATUS };

export async function simulateNfcSession({ readOnly = false } = {}) {
  // Fake delay to simulate hardware interação
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // Aqui no futuro vamos usar Web NFC / APIs nativas
  // Mantém try/catch preparado para ambientes mobile / PWA.
  try {
    const fakeTagId = `TAG-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
    const payload = {
      id: fakeTagId,
      mode: readOnly ? "read-only" : "read-write",
      lastUpdated: new Date().toISOString(),
    };

    return {
      ok: true,
      tag: payload,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error?.message ??
        "Falha na simulação de sessão NFC. Verifique o dispositivo.",
    };
  }
}

