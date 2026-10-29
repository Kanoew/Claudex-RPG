'use strict';

// Images de la faux : lueur de ramassage dans le donjon et arcs de coup (violet pour le coup de base, cyan pour Fauchage).
// Les arcs sont dessinés pointe vers la droite, pivot au centre du bord gauche ; on les tourne vers le coup et on les met à l'échelle
// pour que leur rayon visuel soit la portée du coup. La zone de contact du jeu ne change pas.
const weaponArt = { glow: null, base: null, empowered: null };
const arcClips = {
  base: { cell: 300, radius: 96, weights: [30, 35, 40, 45, 35, 35] },
  empowered: { cell: 300, radius: 144, weights: [40, 45, 55, 60, 50, 50] }
};

function loadWeaponArt() {
  if (typeof Image === 'undefined') return;
  for (const [key, file] of [['glow', 'ramassage-lueur'], ['base', 'arc-base'], ['empowered', 'arc-fauchage']]) {
    const image = new Image();
    image.onload = () => { weaponArt[key] = image; };
    image.onerror = () => { weaponArt[key] = null; };
    image.src = `assets/faux/${file}.png?v=49`;
  }
}

// Lueur du ramassage : retourne vrai si l'image a été dessinée.
function drawWeaponPickup(x, y) {
  if (!weaponArt.glow) return false;
  const frame = Math.floor(mirrorNow() * 1000 / 180) % 4;
  ctx.drawImage(weaponArt.glow, frame * 128, 0, 128, 128, x - 48, y - 62, 96, 96);
  return true;
}

// Arc du coup en cours : retourne vrai si l'image a été dessinée (le centre est la position de Yarden à l'écran).
function drawAttackArc(screenX, screenY) {
  const key = attack.empowered ? 'empowered' : 'base';
  const strip = weaponArt[key], clip = arcClips[key];
  if (!strip) return false;
  const progress = Math.max(0, Math.min(1, 1 - attack.remaining / attack.duration));
  const total = clip.weights.reduce((sum, value) => sum + value, 0);
  let frame = clip.weights.length - 1, passed = 0;
  for (let i = 0; i < clip.weights.length; i++) { passed += clip.weights[i]; if (progress * total < passed) { frame = i; break; } }
  const scale = attack.range / clip.radius;
  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(attack.angle);
  ctx.drawImage(strip, frame * clip.cell, 0, clip.cell, clip.cell, 0, -clip.cell / 2 * scale, clip.cell * scale, clip.cell * scale);
  ctx.restore();
  return true;
}
