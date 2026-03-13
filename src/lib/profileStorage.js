export const PROFILE_STORAGE_KEY = "ponto-certo-perfis";

export function loadProfiles() {
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

export function saveProfiles(list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function findProfileById(id) {
  const profiles = loadProfiles();
  return profiles.find((p) => String(p.id) === String(id)) ?? null;
}

