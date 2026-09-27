// Motor de ilustración vectorial: dibuja una figura articulada estilizada (vista lateral)
// a partir de ángulos por pose, más una silueta de equipo y una zona muscular resaltada.
// Todo se genera en SVG inline: liviano, nítido a cualquier tamaño y sin fotos/videos externos.

import { exerciseImages } from "./exercise-images.js";

const LEN = { torso: 46, thigh: 40, shank: 40, upperArm: 24, forearm: 24, headR: 12, foot: 20 };

function toRad(deg) { return (deg * Math.PI) / 180; }

// Calcula las articulaciones en un sistema local donde la cadera está en (0,0).
// theta = inclinación de torso (0 = vertical, + = inclina hacia delante/+x)
// phi   = ángulo del muslo respecto a la vertical (+ = rodilla avanza hacia delante)
// psi   = flexión de rodilla (0 = pierna recta, + = talón se recoge)
// alpha = ángulo del brazo respecto a la vertical (0 = brazo caído, 180 = brazo arriba)
// beta  = flexión de codo (0 = brazo recto)
function computeJoints({ hip: phi = 8, knee: psi = 8, torso: theta = 5, arm: alpha = 8, elbow: beta = 8 }) {
  const hip = { x: 0, y: 0 };
  const knee = { x: hip.x + LEN.thigh * Math.sin(toRad(phi)), y: hip.y + LEN.thigh * Math.cos(toRad(phi)) };
  const shankAngle = phi - psi;
  const ankle = { x: knee.x + LEN.shank * Math.sin(toRad(shankAngle)), y: knee.y + LEN.shank * Math.cos(toRad(shankAngle)) };
  const footTip = { x: ankle.x + LEN.foot, y: ankle.y };

  const neck = { x: hip.x + LEN.torso * Math.sin(toRad(theta)), y: hip.y - LEN.torso * Math.cos(toRad(theta)) };
  const head = { x: neck.x + (LEN.headR + 6) * Math.sin(toRad(theta)), y: neck.y - (LEN.headR + 6) * Math.cos(toRad(theta)) };

  const shoulder = neck;
  const elbow = { x: shoulder.x + LEN.upperArm * Math.sin(toRad(alpha)), y: shoulder.y + LEN.upperArm * Math.cos(toRad(alpha)) };
  const forearmAngle = alpha - beta;
  const wrist = { x: elbow.x + LEN.forearm * Math.sin(toRad(forearmAngle)), y: elbow.y + LEN.forearm * Math.cos(toRad(forearmAngle)) };

  return { hip, knee, ankle, footTip, neck, head, shoulder, elbow, wrist };
}

// Zonas resaltadas: elipse translúcida ubicada en coordenadas LOCALES (antes del transform del grupo).
const ZONE_SPOTS = {
  quads: (j) => mid(j.hip, j.knee, 1.15),
  hamstrings: (j) => mid(j.hip, j.knee, 0.95),
  glutes: (j) => ({ x: j.hip.x - 6, y: j.hip.y - 6, rx: 20, ry: 16 }),
  adductors: (j) => mid(j.hip, j.knee, 0.7),
  calves: (j) => mid(j.knee, j.ankle, 1.1),
  core: (j) => mid(j.hip, j.neck, 0.55),
  back: (j) => mid(j.hip, j.neck, 0.6),
  chest: (j) => mid(j.neck, j.shoulder, 1, 16, 14),
  biceps: (j) => mid(j.shoulder, j.elbow, 1, 12, 10),
  shoulders: (j) => ({ x: j.shoulder.x, y: j.shoulder.y, rx: 13, ry: 12 }),
  lowerback: (j) => mid(j.hip, j.neck, 0.3, 18, 12)
};
function mid(a, b, t = 1, rx = 16, ry = 13) {
  return { x: a.x + (b.x - a.x) * t * 0.5, y: a.y + (b.y - a.y) * t * 0.5, rx, ry };
}

// Definición de cada familia de movimiento: ángulos en fase A (inicio) y fase B (final),
// más el equipo decorativo y una rotación de cuerpo completo (para posiciones tumbadas/prono).
export const POSES = {
  squat: { equipment: "machineBack", frames: [{ hip: 8, knee: 10, torso: 6, arm: 10, elbow: 12 }, { hip: 78, knee: 100, torso: 24, arm: 10, elbow: 12 }] },
  hinge: { equipment: "barbellHands", frames: [{ hip: 12, knee: 12, torso: 8, arm: 4, elbow: 6 }, { hip: 22, knee: 18, torso: 66, arm: 18, elbow: 8 }] },
  seatedExtension: { equipment: "seat", frames: [{ hip: 92, knee: 95, torso: 4, arm: 30, elbow: 75 }, { hip: 92, knee: 12, torso: 4, arm: 30, elbow: 75 }] },
  legCurl: { equipment: "bench", rotate: 90, frames: [{ hip: 92, knee: 8, torso: 2, arm: 35, elbow: 55 }, { hip: 92, knee: 105, torso: 2, arm: 35, elbow: 55 }] },
  stepUp: { equipment: "box", frames: [{ hip: 70, knee: 92, torso: 16, arm: 12, elbow: 22 }, { hip: 10, knee: 8, torso: 4, arm: 12, elbow: 12 }] },
  splitSquat: { equipment: "benchBack", frames: [{ hip: 58, knee: 82, torso: 12, arm: 6, elbow: 10 }, { hip: 22, knee: 22, torso: 6, arm: 6, elbow: 10 }] },
  seatedAdduction: { equipment: "seat", frames: [{ hip: 92, knee: 90, torso: 2, arm: 30, elbow: 40 }, { hip: 92, knee: 90, torso: 2, arm: 30, elbow: 40 }] },
  calfRaise: { equipment: "platform", frames: [{ hip: 6, knee: 6, torso: 2, arm: 8, elbow: 8, heel: -14 }, { hip: 6, knee: 6, torso: 2, arm: 8, elbow: 8, heel: 14 }] },
  hipThrust: { equipment: "benchShoulders", frames: [{ hip: 95, knee: 92, torso: 92, arm: 30, elbow: 90 }, { hip: 16, knee: 92, torso: 8, arm: 30, elbow: 90 }] },
  lunge: { equipment: "barbellShoulders", frames: [{ hip: 15, knee: 15, torso: 8, arm: 90, elbow: 100 }, { hip: 62, knee: 84, torso: 14, arm: 90, elbow: 100 }] },
  singleLegHinge: { equipment: "dumbbellHand", frames: [{ hip: 10, knee: 8, torso: 5, arm: 5, elbow: 5 }, { hip: 16, knee: 12, torso: 74, arm: 24, elbow: 8 }] },
  hyperextension: { equipment: "romanBench", frames: [{ hip: 74, knee: 8, torso: 74, arm: 84, elbow: 60 }, { hip: 8, knee: 5, torso: 4, arm: 84, elbow: 60 }] },
  seatedAbduction: { equipment: "seat", frames: [{ hip: 92, knee: 90, torso: 2, arm: 20, elbow: 30, abduct: -14 }, { hip: 92, knee: 90, torso: 2, arm: 20, elbow: 30, abduct: 14 }] },
  crunch: { equipment: "cableHigh", frames: [{ hip: 96, knee: 132, torso: 18, arm: 110, elbow: 118 }, { hip: 96, knee: 132, torso: 56, arm: 110, elbow: 118 }] },
  woodchop: { equipment: "cableSide", frames: [{ hip: 10, knee: 10, torso: 10, arm: 22, elbow: 20 }, { hip: 10, knee: 10, torso: 16, arm: 150, elbow: 20 }] },
  reverseCrunch: { equipment: "benchOverhead", rotate: 90, frames: [{ hip: 92, knee: 92, torso: 0, arm: 172, elbow: 12 }, { hip: 150, knee: 138, torso: 0, arm: 172, elbow: 12 }] },
  abWheel: { equipment: "ground", frames: [{ hip: 100, knee: 122, torso: 68, arm: 62, elbow: 8 }, { hip: 168, knee: 168, torso: 8, arm: 150, elbow: 4 }] },
  pallof: { equipment: "cableSide", frames: [{ hip: 8, knee: 10, torso: 4, arm: 84, elbow: 78 }, { hip: 8, knee: 10, torso: 4, arm: 84, elbow: 8 }] },
  pulldown: { equipment: "cableHighSeat", frames: [{ hip: 92, knee: 90, torso: 4, arm: 168, elbow: 10 }, { hip: 92, knee: 90, torso: 4, arm: 40, elbow: 108 }] },
  seatedRow: { equipment: "cableLowSeat", frames: [{ hip: 92, knee: 90, torso: 16, arm: 78, elbow: 8 }, { hip: 92, knee: 90, torso: 0, arm: 18, elbow: 108 }] },
  benchRow: { equipment: "bench3point", frames: [{ hip: 85, knee: 15, torso: 78, arm: 60, elbow: 8 }, { hip: 85, knee: 15, torso: 78, arm: 12, elbow: 108 }] },
  curl: { equipment: "cableLow", frames: [{ hip: 6, knee: 6, torso: 4, arm: 6, elbow: 6 }, { hip: 6, knee: 6, torso: 4, arm: 6, elbow: 118 }] },
  rearDeltRaise: { equipment: "benchIncline", frames: [{ hip: 80, knee: 10, torso: 74, arm: 6, elbow: 15 }, { hip: 80, knee: 10, torso: 74, arm: 94, elbow: 15 }] },
  inclinePress: { equipment: "benchIncline2", frames: [{ hip: 94, knee: 100, torso: 58, arm: 168, elbow: 118 }, { hip: 94, knee: 100, torso: 58, arm: 80, elbow: 14 }] },
  pecDeck: { equipment: "seatBack", frames: [{ hip: 92, knee: 90, torso: 4, arm: 92, elbow: 92 }, { hip: 92, knee: 90, torso: 4, arm: 16, elbow: 92 }] },
  chestPressMachine: { equipment: "seatBack", frames: [{ hip: 92, knee: 90, torso: 4, arm: 78, elbow: 118 }, { hip: 92, knee: 90, torso: 4, arm: 78, elbow: 14 }] },
  pushUp: { equipment: "ground", rotate: 90, frames: [{ hip: 0, knee: 0, torso: 0, arm: 0, elbow: 108 }, { hip: 0, knee: 0, torso: 0, arm: 0, elbow: 10 }] }
};

function equipmentSVG(kind) {
  switch (kind) {
    case "machineBack": return `<rect x="118" y="30" width="14" height="150" rx="6" fill="var(--eq)"/>`;
    case "barbellHands": return `<g></g>`;
    case "seat": return `<rect x="96" y="120" width="70" height="16" rx="4" fill="var(--eq)"/><rect x="150" y="60" width="16" height="66" rx="6" fill="var(--eq)"/>`;
    case "bench": return `<rect x="70" y="140" width="150" height="16" rx="6" fill="var(--eq)"/>`;
    case "box": return `<rect x="150" y="150" width="60" height="28" rx="3" fill="var(--eq)"/>`;
    case "benchBack": return `<rect x="180" y="60" width="16" height="70" rx="6" fill="var(--eq)"/>`;
    case "platform": return `<rect x="90" y="176" width="120" height="10" rx="3" fill="var(--eq)"/>`;
    case "benchShoulders": return `<rect x="40" y="118" width="150" height="18" rx="6" fill="var(--eq)"/>`;
    case "barbellShoulders": return `<g></g>`;
    case "dumbbellHand": return `<g></g>`;
    case "romanBench": return `<rect x="70" y="150" width="120" height="14" rx="5" fill="var(--eq)" transform="rotate(-18 130 157)"/>`;
    case "cableHigh": return `<rect x="230" y="10" width="10" height="130" fill="var(--eq)"/><circle cx="235" cy="14" r="7" fill="var(--eq)"/>`;
    case "cableSide": return `<rect x="240" y="20" width="10" height="150" fill="var(--eq)"/>`;
    case "cableHighSeat": return `<rect x="150" y="10" width="10" height="60" fill="var(--eq)"/><circle cx="155" cy="14" r="7" fill="var(--eq)"/><rect x="96" y="120" width="70" height="16" rx="4" fill="var(--eq)"/>`;
    case "cableLowSeat": return `<rect x="250" y="120" width="10" height="60" fill="var(--eq)"/><rect x="96" y="120" width="70" height="16" rx="4" fill="var(--eq)"/>`;
    case "cableLow": return `<rect x="140" y="150" width="10" height="40" fill="var(--eq)"/>`;
    case "bench3point": return `<rect x="60" y="150" width="120" height="14" rx="5" fill="var(--eq)"/>`;
    case "benchIncline": return `<rect x="60" y="90" width="16" height="90" rx="6" fill="var(--eq)" transform="rotate(35 68 135)"/>`;
    case "benchIncline2": return `<rect x="70" y="60" width="18" height="110" rx="6" fill="var(--eq)" transform="rotate(35 79 115)"/>`;
    case "seatBack": return `<rect x="150" y="55" width="16" height="80" rx="6" fill="var(--eq)"/>`;
    case "benchOverhead": return `<rect x="30" y="150" width="150" height="14" rx="5" fill="var(--eq)"/>`;
    case "ground": return `<rect x="20" y="176" width="240" height="6" rx="3" fill="var(--eq)"/>`;
    default: return "";
  }
}

function limbPath(points) {
  return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function figureSVG(joints) {
  const legPts = limbPath([joints.hip, joints.knee, joints.ankle, joints.footTip]);
  const torsoPts = limbPath([joints.hip, joints.neck]);
  const armPts = limbPath([joints.shoulder, joints.elbow, joints.wrist]);
  return `
    <polyline points="${legPts}" fill="none" stroke="var(--fig)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="${torsoPts}" fill="none" stroke="var(--fig)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="${armPts}" fill="none" stroke="var(--fig-accent)" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${joints.head.x.toFixed(1)}" cy="${joints.head.y.toFixed(1)}" r="${LEN.headR}" fill="var(--fig)"/>
    <circle cx="${joints.hip.x.toFixed(1)}" cy="${joints.hip.y.toFixed(1)}" r="3.5" fill="var(--fig-dot)"/>
    <circle cx="${joints.knee.x.toFixed(1)}" cy="${joints.knee.y.toFixed(1)}" r="3.5" fill="var(--fig-dot)"/>
    <circle cx="${joints.elbow.x.toFixed(1)}" cy="${joints.elbow.y.toFixed(1)}" r="3" fill="var(--fig-dot)"/>`;
}

// Genera el markup SVG completo para un ejercicio en una fase concreta (0 = inicio, 1 = final).
export function renderPhase(exercise, phaseIndex) {
  const pose = POSES[exercise.pose] || POSES.squat;
  const frame = pose.frames[Math.min(phaseIndex, pose.frames.length - 1)];
  const joints = computeJoints(frame);
  const rotate = pose.rotate || 0;
  const hipCanvas = { x: 130, y: rotate ? 120 : 150 };
  const zoneFn = ZONE_SPOTS[exercise.zone] || ZONE_SPOTS.core;
  const spot = zoneFn(joints);

  const svg = `
  <svg viewBox="0 0 280 200" role="img" aria-label="Posición ${phaseIndex === 0 ? "inicial" : "final"} de ${exercise.name}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="spotGlow-${exercise.id}-${phaseIndex}" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="var(--zone)" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="var(--zone)" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="280" height="200" fill="var(--panel)"/>
    <line x1="16" y1="185" x2="264" y2="185" stroke="var(--ground)" stroke-width="2"/>
    <g opacity="0.9">${equipmentSVG(pose.equipment)}</g>
    <g transform="translate(${hipCanvas.x} ${hipCanvas.y}) rotate(${rotate})">
      <ellipse cx="${spot.x}" cy="${spot.y}" rx="${spot.rx}" ry="${spot.ry}" fill="url(#spotGlow-${exercise.id}-${phaseIndex})"/>
      ${figureSVG(joints)}
    </g>
  </svg>`;

  const phaseName = phaseIndex === 0 ? "inicio" : "ejecucion";
  const imageName = `${exercise.id}-${phaseName}.webp`;
  const imageMarkup = exerciseImages.has(imageName)
    ? `<img src="assets/exercises/${imageName}" alt="Persona realizando ${exercise.name}, fase de ${phaseName === "inicio" ? "inicio" : "ejecución"}" loading="lazy">`
    : "";
  return `<div class="exercise-art">
    ${imageMarkup}
    <div class="exercise-art-fallback">${svg}</div>
  </div>`;
}

export function phaseLabel(i) {
  return i === 0 ? "Inicio" : "Ejecución";
}
