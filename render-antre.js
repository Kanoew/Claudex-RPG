'use strict';

// Décor de l'antre d'après le canon fourni par Jordan : sol de cristal noir, poudre de cristal le long des murs
// (environ 30 cm, soit une dizaine de pixels), câbles de cristal translucides tendus des parois vers l'araignée
// avec du mana qui circule lentement, dominante noire et froide sans aucune couleur chaude.
// Les colonnes sont une adaptation de jeu (non canon) : des colonnes de cristal noir, jamais de la pierre.
// La frontière entre la pierre du couloir et le cristal est tracée sur la ligne qui déclenche le combat.
// La couleur exacte des reflets n'est pas fournie : un blanc bleuté très pâle sert d'attente.
const antreLook = { powder: 11, frontier: 200, reflect: '#aebfd6', floor: '#07090e', facet: '#10151d' };
const antreCables = [];
const antrePowder = [];
(function buildAntre() {
  let state = 38;
  const next = () => (state = (state * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const r = zones.antre.room;
  // Points d'attache espacés de façon irrégulière sur les quatre parois.
  for (let along = 0; along < 2 * (r.width + r.height); along += 34 + next() * 26) {
    let x, y, remain = along;
    if (remain < r.width) { x = r.x + remain; y = r.y; }
    else if ((remain -= r.width) < r.height) { x = r.x + r.width; y = r.y + remain; }
    else if ((remain -= r.height) < r.width) { x = r.x + r.width - remain; y = r.y + r.height; }
    else { remain -= r.width; x = r.x; y = r.y + r.height - remain; }
    antreCables.push({ x, y, phase: next(), speed: .05 + next() * .05, low: next() < .5 });
  }
  const band = antreLook.powder;
  for (let i = 0; i < 520; i++) {
    const side = Math.floor(next() * 4), t = next(), d = next() * band;
    const x = side === 0 ? r.x + t * r.width : side === 1 ? r.x + r.width - d : side === 2 ? r.x + t * r.width : r.x + d;
    const y = side === 0 ? r.y + d : side === 1 ? r.y + t * r.height : side === 2 ? r.y + r.height - d : r.y + t * r.height;
    antrePowder.push({ x, y, light: next() < .35 });
  }
})();

function drawAntreFloor(offsetX, offsetY) {
  const r = room, x0 = r.x + offsetX, y0 = r.y + offsetY, frontier = antreLook.frontier + offsetY;
  // Pierre brute du couloir au sud.
  ctx.fillStyle = '#171a1f';
  ctx.fillRect(x0, y0, r.width, r.height);
  if (roomArt.floor) {
    ctx.save();
    ctx.translate(x0, y0);
    ctx.globalAlpha = .55;
    ctx.fillStyle = roomArt.floor;
    ctx.fillRect(0, 0, r.width, r.height);
    ctx.restore();
  }
  // Cristal noir au nord de la frontière, aux arêtes en dents.
  ctx.fillStyle = antreLook.floor;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0 + r.width, y0);
  ctx.lineTo(x0 + r.width, frontier);
  for (let x = x0 + r.width; x > x0; x -= 48) {
    ctx.lineTo(x - 24, frontier - 9 - ((x * 7) % 11));
    ctx.lineTo(x - 48, frontier);
  }
  ctx.lineTo(x0, y0);
  ctx.fill();
  ctx.strokeStyle = antreLook.facet;
  ctx.lineWidth = 1;
  for (let i = -6; i < 8; i++) {
    ctx.beginPath(); ctx.moveTo(offsetX - 480 + i * 100, offsetY - 400);
    ctx.lineTo(offsetX + i * 100, offsetY + 400); ctx.stroke();
  }
  // Poudre de cristal noir le long des murs : sable et cendre.
  ctx.fillStyle = '#24272c';
  const band = antreLook.powder;
  ctx.fillRect(x0, y0, r.width, band);
  ctx.fillRect(x0, y0 + r.height - band, r.width, band);
  ctx.fillRect(x0, y0, band, r.height);
  ctx.fillRect(x0 + r.width - band, y0, band, r.height);
  for (const grain of antrePowder) {
    ctx.fillStyle = grain.light ? '#4a4f58' : '#15171b';
    ctx.fillRect(grain.x + offsetX, grain.y + offsetY, 2, 2);
  }
}

// Câbles tendus entre les parois et l'araignée ; un point de mana clair y glisse lentement.
function drawAntreCables(offsetX, offsetY) {
  const spider = spiderEnemy();
  const tx = spider.x + offsetX, ty = spider.y + offsetY;
  ctx.save();
  ctx.lineWidth = 1.6;
  for (const cable of antreCables) {
    const x = cable.x + offsetX, y = cable.y + offsetY;
    ctx.strokeStyle = cable.low ? '#2a3442' : '#3a4658';
    ctx.globalAlpha = .38;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
    const t = (cable.phase + elapsed * cable.speed) % 1;
    ctx.globalAlpha = .75;
    ctx.fillStyle = antreLook.reflect;
    ctx.beginPath(); ctx.arc(x + (tx - x) * t, y + (ty - y) * t, 1.7, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// Murs de cristal noir et colonnes de cristal noir : chacun reste dans son rectangle de collision.
function drawAntreSolid(wall, x, y, column) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = column ? '#0b0e14' : '#05070b';
  ctx.fillRect(0, 0, wall.width, wall.height);
  ctx.strokeStyle = '#1c2633';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, wall.width - 4, wall.height - 4);
  if (column) {
    ctx.fillStyle = '#16202c';
    ctx.beginPath();
    ctx.moveTo(4, wall.height - 4); ctx.lineTo(wall.width * .3, 4); ctx.lineTo(wall.width * .55, wall.height - 4);
    ctx.moveTo(wall.width * .5, wall.height - 4); ctx.lineTo(wall.width * .75, 6); ctx.lineTo(wall.width - 4, wall.height - 4);
    ctx.fill();
  }
  ctx.restore();
}
