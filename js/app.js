import { exercises, categoryOrder, zoneLabels } from "./data.js";
import { renderPhase, phaseLabel } from "./illustrations.js";
import * as store from "./store.js";

document.addEventListener("load", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.matches(".exercise-art img")) return;
  image.closest(".exercise-art").querySelector(".exercise-art-fallback").hidden = true;
}, true);

document.addEventListener("error", (event) => {
  const image = event.target;
  if (image instanceof HTMLImageElement && image.matches(".exercise-art img")) image.hidden = true;
}, true);

const VIDEOS_KEY = "gym-app:videos";
function getVideos() { try { return JSON.parse(localStorage.getItem(VIDEOS_KEY) || "{}"); } catch { return {}; } }
function setVideo(exerciseId, url) {
  const videos = getVideos();
  if (url) videos[exerciseId] = url; else delete videos[exerciseId];
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
}
function youtubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

const DAY_TITLES = {
  "1": "Día 1 · Piernas",
  "2": "Día 2 · Espalda, abdomen y pecho",
  "3": "Día 3 · Glúteos",
  custom: "Arma tu rutina por músculo"
};
const DAY_LABEL_SHORT = { "1": "Día 1 · Piernas", "2": "Día 2 · Espalda/Core/Pecho", "3": "Día 3 · Glúteos", custom: "Rutina personalizada" };

const state = {
  day: "1",
  category: "Todos",
  zone: null,
  query: "",
  exercises,
  selected: new Set(),
  sessionActive: false,
  sessionExercises: [],
  profileId: null,
  completed: new Set()
};

/* ------------------------------------------------------------------ */
/* Perfiles                                                            */
/* ------------------------------------------------------------------ */
function ensureProfile() {
  let profiles = store.listProfiles();
  if (profiles.length === 0) {
    const p = store.createProfile("Invitado");
    profiles = [p];
  }
  let active = store.getActiveProfile();
  if (!active || !profiles.some((p) => p.id === active)) {
    active = profiles[0].id;
    store.setActiveProfile(active);
  }
  state.profileId = active;
  state.completed = store.getCompleted(active);
}

function renderProfileSelect() {
  const select = document.getElementById("profileSelect");
  const profiles = store.listProfiles();
  select.innerHTML = profiles.map((p) => `<option value="${p.id}" ${p.id === state.profileId ? "selected" : ""}>${escapeHtml(p.name)}</option>`).join("");
}

function renderProfileDialogList() {
  const list = document.getElementById("profileList");
  const profiles = store.listProfiles();
  list.innerHTML = profiles.map((p) => `
    <div class="profile-row">
      <button class="select" data-select-profile="${p.id}">${escapeHtml(p.name)}${p.id === state.profileId ? " · activo" : ""}</button>
      <button class="remove" data-remove-profile="${p.id}" title="Eliminar perfil" ${profiles.length <= 1 ? "disabled" : ""}>✕</button>
    </div>`).join("");
  list.querySelectorAll("[data-select-profile]").forEach((btn) => btn.addEventListener("click", () => {
    switchProfile(btn.dataset.selectProfile);
    renderProfileDialogList();
  }));
  list.querySelectorAll("[data-remove-profile]").forEach((btn) => btn.addEventListener("click", () => {
    if (store.listProfiles().length <= 1) return;
    if (!confirm("¿Eliminar este perfil y todo su historial guardado en este navegador?")) return;
    store.deleteProfile(btn.dataset.removeProfile);
    ensureProfile();
    renderProfileSelect();
    renderProfileDialogList();
    renderAll();
  }));
}

function switchProfile(id) {
  store.setActiveProfile(id);
  state.profileId = id;
  state.completed = store.getCompleted(id);
  state.sessionActive = false;
  state.sessionExercises = [];
  state.selected.clear();
  renderProfileSelect();
  renderAll();
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function saveCompleted() { store.setCompleted(state.profileId, state.completed); }

/* ------------------------------------------------------------------ */
/* Vistas: navegación                                                   */
/* ------------------------------------------------------------------ */
function setView(view) {
  document.querySelectorAll(".view").forEach((el) => (el.hidden = el.id !== `view-${view}`));
  document.querySelectorAll(".tabs-nav button").forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  if (view === "inicio") renderHero();
  if (view === "rutinas") renderRoutinesView();
  if (view === "seguimiento") renderTrackingView();
}

/* ------------------------------------------------------------------ */
/* Inicio                                                               */
/* ------------------------------------------------------------------ */
function renderHero() {
  const history = store.getHistory(state.profileId);
  const totalExercisesDone = history.reduce((acc, s) => acc + (s.doneIds?.length || 0), 0);
  const el = document.getElementById("heroStats");
  el.innerHTML = `
    <div class="stat-card"><b>${exercises.length}</b><span>Ejercicios en la guía</span></div>
    <div class="stat-card"><b>${history.length}</b><span>Sesiones registradas</span></div>
    <div class="stat-card"><b>${totalExercisesDone}</b><span>Ejercicios completados</span></div>
    <div class="stat-card"><b>${computeStreak(history)}</b><span>Días de racha</span></div>`;
}

function computeStreak(history) {
  if (!history.length) return 0;
  const days = [...new Set(history.map((s) => s.date.slice(0, 10)))].sort().reverse();
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const cur = new Date(days[i]);
    const diffDays = Math.round((prev - cur) / 86400000);
    if (diffDays === 1) streak++; else break;
  }
  return streak;
}

/* ------------------------------------------------------------------ */
/* Rutinas                                                              */
/* ------------------------------------------------------------------ */
function visibleExercises() {
  if (state.sessionActive) {
    return state.exercises.filter((ex) => state.sessionExercises.includes(ex.id));
  }
  return state.exercises.filter((exercise) => {
    const dayMatch = state.day === "custom" || String(exercise.day) === state.day;
    const categoryMatch = state.category === "Todos" || exercise.category === state.category;
    const zoneMatch = !state.zone || exercise.zone === state.zone;
    const haystack = [exercise.name, exercise.category, exercise.equipment, ...exercise.muscles].join(" ").toLowerCase();
    const searchMatch = haystack.includes(state.query.toLowerCase().trim());
    return dayMatch && categoryMatch && zoneMatch && searchMatch;
  });
}

function renderDayTabs() {
  document.querySelectorAll(".day-tab").forEach((btn) => btn.classList.toggle("active", btn.dataset.day === state.day));
  document.getElementById("routineTitle").textContent = DAY_TITLES[state.day];
}

function renderCategoryFilters() {
  const wrap = document.getElementById("categoryFilters");
  const pool = state.day === "custom" ? exercises : exercises.filter((x) => String(x.day) === state.day);
  const allowed = [...new Set(pool.map((x) => x.category))];
  if (state.category !== "Todos" && !allowed.includes(state.category)) { state.category = "Todos"; state.zone = null; }

  let html = ["Todos", ...allowed].map((category) =>
    `<button class="filter-chip ${state.category === category ? "active" : ""}" data-category="${category}">${category}</button>`
  ).join("");

  if (state.category !== "Todos") {
    const zonePool = pool.filter((x) => x.category === state.category);
    const zones = [...new Set(zonePool.map((x) => x.zone))];
    if (zones.length > 1) {
      html += `<span style="width:100%"></span>` + zones.map((z) =>
        `<button class="filter-chip ${state.zone === z ? "active" : ""}" data-zone="${z}" style="border-style:dashed;">${zoneLabels[z] || z}</button>`
      ).join("");
    }
  }

  wrap.innerHTML = html;
  wrap.querySelectorAll("[data-category]").forEach((btn) => btn.addEventListener("click", () => {
    state.category = btn.dataset.category;
    state.zone = null;
    renderRoutinesView();
  }));
  wrap.querySelectorAll("[data-zone]").forEach((btn) => btn.addEventListener("click", () => {
    state.zone = state.zone === btn.dataset.zone ? null : btn.dataset.zone;
    renderRoutinesView();
  }));
}

function renderBuilderBars() {
  const builderBar = document.getElementById("builderBar");
  const sessionBar = document.getElementById("sessionBar");
  builderBar.hidden = state.sessionActive;
  sessionBar.hidden = !state.sessionActive;

  if (!state.sessionActive) {
    document.getElementById("builderCount").textContent = state.selected.size;
    document.getElementById("startCustomSession").disabled = state.selected.size === 0;
  } else {
    const doneCount = state.sessionExercises.filter((id) => state.completed.has(id)).length;
    document.getElementById("sessionDoneCount").textContent = `${doneCount} / ${state.sessionExercises.length}`;
  }
}

function renderCards() {
  const items = visibleExercises();
  const grid = document.getElementById("exerciseGrid");
  document.getElementById("emptyState").hidden = items.length !== 0;

  grid.innerHTML = items.map((exercise) => {
    const globalNumber = exercises.findIndex((x) => x.id === exercise.id) + 1;
    const isSelected = state.selected.has(exercise.id);
    const isDone = state.completed.has(exercise.id);
    const showCheckbox = state.sessionActive;
    return `
      <article class="exercise-card ${!state.sessionActive ? "selectable" : ""} ${isSelected && !state.sessionActive ? "selected" : ""}" data-card="${exercise.id}">
        <div class="exercise-visual">${renderPhase(exercise, 0)}</div>
        <span class="exercise-number">${String(globalNumber).padStart(2, "0")}</span>
        ${!state.sessionActive ? `<button class="select-check" data-select="${exercise.id}" title="Añadir a mi rutina" aria-label="Seleccionar ${exercise.name}">✓</button>` : ""}
        <div class="exercise-body">
          <div class="exercise-meta"><span>${exercise.category}</span><span>Día ${exercise.day}</span></div>
          <h3>${exercise.name}</h3>
          <p class="equipment">${exercise.equipment}</p>
          <div class="card-actions">
            <button class="view-btn" data-open="${exercise.id}">Ver técnica</button>
            ${showCheckbox ? `
              <label class="complete-label">
                <input type="checkbox" data-complete="${exercise.id}" ${isDone ? "checked" : ""}>
                Hecho
              </label>` : ""}
          </div>
        </div>
      </article>`;
  }).join("");

  grid.querySelectorAll("[data-open]").forEach((btn) => btn.addEventListener("click", (e) => { e.stopPropagation(); openExercise(btn.dataset.open); }));
  grid.querySelectorAll("[data-select]").forEach((btn) => btn.addEventListener("click", (e) => { e.stopPropagation(); toggleSelect(btn.dataset.select); }));
  grid.querySelectorAll("[data-complete]").forEach((input) => input.addEventListener("change", (e) => { e.stopPropagation(); toggleComplete(input.dataset.complete, input.checked); }));
  grid.querySelectorAll(".exercise-card.selectable").forEach((card) => card.addEventListener("click", () => toggleSelect(card.dataset.card)));
}

function toggleSelect(id) {
  if (state.selected.has(id)) state.selected.delete(id); else state.selected.add(id);
  renderCards();
  renderBuilderBars();
}

function toggleComplete(id, checked) {
  checked ? state.completed.add(id) : state.completed.delete(id);
  saveCompleted();
  document.querySelectorAll(`[data-complete="${id}"]`).forEach((input) => (input.checked = checked));
  renderBuilderBars();
}

function startSession() {
  state.sessionExercises = [...state.selected];
  state.sessionExercises.forEach((id) => state.completed.delete(id));
  saveCompleted();
  state.sessionActive = true;
  state.selected.clear();
  renderRoutinesView();
}

function cancelSession() {
  state.sessionActive = false;
  state.sessionExercises = [];
  renderRoutinesView();
}

function finishSession() {
  const doneIds = state.sessionExercises.filter((id) => state.completed.has(id));
  const involved = state.sessionExercises.map((id) => exercises.find((x) => x.id === id)).filter(Boolean);
  const zonesSet = [...new Set(involved.map((x) => x.zone))];
  store.addHistorySession(state.profileId, {
    label: state.day === "custom" ? "Rutina personalizada" : DAY_LABEL_SHORT[state.day],
    day: state.day,
    exerciseIds: state.sessionExercises,
    doneIds,
    zones: zonesSet
  });
  state.sessionActive = false;
  state.sessionExercises = [];
  state.lastSessionSummary = `Sesión guardada: ${doneIds.length} de ${involved.length} ejercicios completados.`;
  renderRoutinesView();
  window.clearTimeout(state._summaryTimer);
  state._summaryTimer = window.setTimeout(() => { state.lastSessionSummary = null; renderRoutinesView(); }, 5000);
}

function renderSessionSummary() {
  const el = document.getElementById("sessionSummary");
  el.hidden = !state.lastSessionSummary;
  el.innerHTML = el.hidden ? "" : `<span>${escapeHtml(state.lastSessionSummary)}</span>`;
}

function renderRoutinesView() {
  renderDayTabs();
  renderCategoryFilters();
  renderBuilderBars();
  renderSessionSummary();
  renderCards();
}

/* ------------------------------------------------------------------ */
/* Diálogo de ejercicio                                                 */
/* ------------------------------------------------------------------ */
function openExercise(id) {
  const exercise = exercises.find((x) => x.id === id);
  const dialog = document.getElementById("exerciseDialog");
  const videos = getVideos();
  const savedUrl = videos[id] || "";
  let phase = 0;

  function galleryHtml() {
    return `
      <div class="gallery-frame">${renderPhase(exercise, phase)}</div>
      <div class="gallery-steps">
        <button data-phase="0" class="${phase === 0 ? "active" : ""}">${phaseLabel(0)}</button>
        <button data-phase="1" class="${phase === 1 ? "active" : ""}">${phaseLabel(1)}</button>
      </div>
      <span class="zone-pill">Zona destacada: ${zoneLabels[exercise.zone] || exercise.zone}</span>`;
  }

  function videoHtml() {
    const vid = savedUrl ? youtubeId(savedUrl) : null;
    return `
      <div class="video-box">
        <label>Video de referencia (opcional, lo agregas tú)</label>
        <div class="video-row">
          <input type="url" id="videoUrlInput" placeholder="Pega un link de YouTube" value="${escapeHtml(savedUrl)}">
          <button class="btn ghost" id="saveVideoBtn">Guardar</button>
        </div>
        ${vid ? `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${vid}" title="Video de ${escapeHtml(exercise.name)}" allowfullscreen></iframe></div>`
          : savedUrl ? `<p style="margin-top:8px;"><a href="${escapeHtml(savedUrl)}" target="_blank" rel="noreferrer">Abrir video guardado ↗</a></p>` : ""}
      </div>`;
  }

  function renderDialogBody() {
    document.getElementById("dialogContent").innerHTML = `
      <div class="dialog-layout">
        <div class="gallery">
          <div id="galleryMount">${galleryHtml()}</div>
          <div id="videoMount">${videoHtml()}</div>
        </div>
        <div class="dialog-copy">
          <p class="eyebrow">Día ${exercise.day} · ${exercise.category}</p>
          <h2 id="dialogTitle">${exercise.name}</h2>
          <p class="prescription">${exercise.prescription}</p>
          <p class="equipment-line"><strong>Equipo:</strong> ${exercise.equipment}</p>
          <ul class="muscle-tags">${exercise.muscles.map((m) => `<li>${m}</li>`).join("")}</ul>
          <h3>Preparación</h3>
          <p>${exercise.setup}</p>
          <h3>Movimiento</h3>
          <ol>${exercise.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
          <p class="cue"><strong>Clave:</strong> ${exercise.cue}</p>
          <h3>Evita</h3>
          <ul>${exercise.errors.map((e) => `<li>${e}</li>`).join("")}</ul>
          ${state.sessionActive && state.sessionExercises.includes(exercise.id) ? `
            <label class="dialog-complete">
              <input type="checkbox" id="dialogComplete" ${state.completed.has(exercise.id) ? "checked" : ""}>
              Marcar como completado en esta sesión
            </label>` : ""}
        </div>
      </div>`;

    const saveBtn = document.getElementById("saveVideoBtn");
    if (saveBtn) saveBtn.addEventListener("click", () => {
      const url = document.getElementById("videoUrlInput").value.trim();
      setVideo(exercise.id, url);
      document.getElementById("videoMount").innerHTML = videoHtml();
    });

    const completeBox = document.getElementById("dialogComplete");
    if (completeBox) completeBox.addEventListener("change", (e) => toggleComplete(exercise.id, e.target.checked));

    wireGalleryButtons();
  }

  function wireGalleryButtons() {
    document.querySelectorAll("#galleryMount [data-phase]").forEach((btn) => {
      btn.onclick = () => {
        phase = Number(btn.dataset.phase);
        document.getElementById("galleryMount").innerHTML = galleryHtml();
        wireGalleryButtons();
      };
    });
  }

  renderDialogBody();
  dialog.showModal();
}

/* ------------------------------------------------------------------ */
/* Seguimiento                                                          */
/* ------------------------------------------------------------------ */
function renderTrackingView() {
  document.getElementById("trackingProfileLabel").textContent =
    `Perfil · ${store.listProfiles().find((p) => p.id === state.profileId)?.name || ""}`;

  const history = store.getHistory(state.profileId);
  const totalDone = history.reduce((acc, s) => acc + (s.doneIds?.length || 0), 0);
  const zoneCounts = {};
  history.forEach((s) => (s.doneIds || []).forEach((id) => {
    const ex = exercises.find((x) => x.id === id);
    if (ex) zoneCounts[ex.zone] = (zoneCounts[ex.zone] || 0) + 1;
  }));
  const topZone = Object.entries(zoneCounts).sort((a, b) => b[1] - a[1])[0];

  document.getElementById("trackingStats").innerHTML = `
    <div class="stat-card"><b>${history.length}</b><span>Sesiones totales</span></div>
    <div class="stat-card"><b>${totalDone}</b><span>Ejercicios completados</span></div>
    <div class="stat-card"><b>${computeStreak(history)}</b><span>Días de racha</span></div>
    <div class="stat-card"><b style="font-size:1.3rem;">${topZone ? (zoneLabels[topZone[0]] || topZone[0]) : "—"}</b><span>Zona más entrenada</span></div>`;

  const listEl = document.getElementById("historyList");
  document.getElementById("historyEmpty").hidden = history.length !== 0;
  listEl.innerHTML = history.map((s) => `
    <div class="history-item">
      <div>
        <div class="when">${new Date(s.date).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" })} · ${escapeHtml(s.label)}</div>
        <div class="meta">${(s.doneIds || []).length} / ${(s.exerciseIds || []).length} ejercicios completados</div>
        <div class="tags">${(s.zones || []).map((z) => `<span>${zoneLabels[z] || z}</span>`).join("")}</div>
      </div>
      <button class="del" data-del-session="${s.id}" title="Eliminar sesión" aria-label="Eliminar sesión">✕</button>
    </div>`).join("");
  listEl.querySelectorAll("[data-del-session]").forEach((btn) => btn.addEventListener("click", () => {
    if (!confirm("¿Eliminar esta sesión del historial?")) return;
    store.deleteHistorySession(state.profileId, btn.dataset.delSession);
    renderTrackingView();
  }));

  const maxCount = Math.max(1, ...Object.values(zoneCounts));
  const chart = document.getElementById("muscleChart");
  const entries = Object.entries(zoneCounts).sort((a, b) => b[1] - a[1]);
  chart.innerHTML = entries.length
    ? entries.map(([zone, count]) => `
      <div class="chart-bar">
        <span class="label">${zoneLabels[zone] || zone}</span>
        <span class="track"><span class="fill" style="width:${(count / maxCount) * 100}%"></span></span>
        <span class="count">${count}</span>
      </div>`).join("")
    : `<p class="empty" style="padding:20px 0;">Sin datos todavía.</p>`;
}

/* ------------------------------------------------------------------ */
/* Cableado general                                                     */
/* ------------------------------------------------------------------ */
function renderAll() {
  renderProfileSelect();
  const activeView = document.querySelector(".tabs-nav button.active")?.dataset.view || "inicio";
  setView(activeView);
}

function wireStaticEvents() {
  document.querySelectorAll(".tabs-nav button").forEach((btn) => btn.addEventListener("click", () => setView(btn.dataset.view)));

  document.querySelectorAll(".day-tab").forEach((btn) => btn.addEventListener("click", () => {
    state.day = btn.dataset.day;
    state.category = "Todos";
    state.zone = null;
    state.selected.clear();
    renderRoutinesView();
  }));

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderCards();
  });

  document.getElementById("clearSelection").addEventListener("click", () => { state.selected.clear(); renderRoutinesView(); });
  document.getElementById("startCustomSession").addEventListener("click", startSession);
  document.getElementById("cancelSession").addEventListener("click", cancelSession);
  document.getElementById("finishSession").addEventListener("click", finishSession);

  document.querySelectorAll(".dialog-close").forEach((btn) => btn.addEventListener("click", (e) => e.target.closest("dialog").close()));
  document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }));

  document.getElementById("profileSelect").addEventListener("change", (e) => switchProfile(e.target.value));
  document.getElementById("manageProfilesBtn").addEventListener("click", () => {
    renderProfileDialogList();
    document.getElementById("profileDialog").showModal();
  });
  document.getElementById("addProfileBtn").addEventListener("click", () => {
    const input = document.getElementById("newProfileName");
    const name = input.value.trim();
    if (!name) return;
    const p = store.createProfile(name);
    input.value = "";
    switchProfile(p.id);
    renderProfileDialogList();
  });
}

ensureProfile();
wireStaticEvents();
renderAll();
