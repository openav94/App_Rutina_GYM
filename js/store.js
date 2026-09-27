// Persistencia local: perfiles de usuario (sin backend) y su progreso/historial de entrenamientos.
// Todo vive en localStorage, particionado por perfil, para que cada usuario tenga su propio seguimiento.

const PROFILES_KEY = "gym-app:profiles";
const ACTIVE_KEY = "gym-app:active-profile";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function uid() {
  return `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function listProfiles() {
  return read(PROFILES_KEY, []);
}

export function createProfile(name) {
  const profiles = listProfiles();
  const profile = { id: uid(), name: name.trim(), createdAt: new Date().toISOString() };
  profiles.push(profile);
  write(PROFILES_KEY, profiles);
  setActiveProfile(profile.id);
  return profile;
}

export function deleteProfile(id) {
  const profiles = listProfiles().filter((p) => p.id !== id);
  write(PROFILES_KEY, profiles);
  ["completed", "history"].forEach((ns) => localStorage.removeItem(`gym-app:user:${id}:${ns}`));
  if (getActiveProfile() === id) {
    setActiveProfile(profiles[0]?.id || null);
  }
}

export function getActiveProfile() {
  return read(ACTIVE_KEY, null);
}

export function setActiveProfile(id) {
  write(ACTIVE_KEY, id);
}

function ns(id, key) {
  return `gym-app:user:${id}:${key}`;
}

export function getCompleted(profileId) {
  return new Set(read(ns(profileId, "completed"), []));
}

export function setCompleted(profileId, set) {
  write(ns(profileId, "completed"), [...set]);
}

export function getHistory(profileId) {
  return read(ns(profileId, "history"), []);
}

// Guarda una sesión de entrenamiento finalizada en el historial del perfil.
export function addHistorySession(profileId, session) {
  const history = getHistory(profileId);
  history.unshift({
    id: `s_${Date.now().toString(36)}`,
    date: new Date().toISOString(),
    ...session
  });
  write(ns(profileId, "history"), history);
  return history;
}

export function deleteHistorySession(profileId, sessionId) {
  const history = getHistory(profileId).filter((s) => s.id !== sessionId);
  write(ns(profileId, "history"), history);
  return history;
}

export function clearHistory(profileId) {
  write(ns(profileId, "history"), []);
}
