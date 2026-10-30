'use strict';

// Mode libre : ouvert à la fin du prototype, pour passer le temps. Une carte de Lausanne, des failles dans trois quartiers,
// et un donjon tiré au hasard à chaque entrée : 2 ou 3 décors, 5 à 8 monstres, puis un chef. Ni butin, ni vente, ni expérience.
// Rien ici ne touche à l'histoire : la dette de Félix reste la même.
const freeKey = 'yarden-mode-libre';
const freeMode = { active: false, clears: 0, from: 'quartier', done: false, rng: Math.random, mapOpen: false };

// Les trois quartiers où s'ouvrent des failles : position de la faille dans la rue et niveau de base des monstres.
const freeSpots = {
  quartier: { x: 120, y: 150, label: 'Quartier étudiant', base: 8 },
  marterey: { x: 150, y: 60, label: 'Rue Marterey', base: 14 },
  sousgare: { x: 150, y: 100, label: 'Sous-gare', base: 20 }
};
const freeThemes = ['pierre', 'cristal', 'ocre'];

function freeUnlocked() {
  try { return typeof localStorage !== 'undefined' && localStorage.getItem(freeKey) === '1'; } catch (error) { return false; }
}

function unlockFree() {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(freeKey, '1'); } catch (error) { /* pas de stockage : le bouton reste là jusqu'à la fermeture */ }
  freeMode.unlockedNow = true;
}

// Les rues gardent leurs textes d'histoire ; en mode libre, l'objectif devient « cherche la faille ».
function freeGoal(original) { return () => freeMode.active ? 'Entre dans la faille ✦' : original ? original() : ''; }
zones.quartier.goal = freeGoal(() => 'Rejoins Ishara devant la porte ↑');
zones.marterey.goal = freeGoal(zones.marterey.goal);
zones.sousgare.goal = freeGoal(zones.sousgare.goal);

const failleRemaining = () => (zoneEnemies.faille || []).filter(enemy => enemy.hp > 0).length;

function freeRoll(count) { return Math.floor(freeMode.rng() * count); }
function freePick(list) { return list[freeRoll(list.length)]; }

// Construit une salle au hasard : décor, taille, blocs sans recouvrement ni devant l'entrée, monstres répartis, chef au fond.
function generateFaille(spot) {
  const width = 760 + freeRoll(5) * 40, height = 560 + freeRoll(4) * 40;
  const area = { x: -width / 2, y: -height / 2, width, height };
  const start = { x: 0, y: area.y + area.height - 70 };
  const theme = freePick(freeThemes);
  const level = spot.base + Math.min(freeMode.clears, 6);
  const blocks = [];
  const free = (x, y, margin) => !blocks.some(b => x > b.x - margin && x < b.x + b.width + margin && y > b.y - margin && y < b.y + b.height + margin);
  for (let tries = 0, target = 3 + freeRoll(4); tries < 80 && blocks.length < target; tries++) {
    const w = 50 + freeRoll(4) * 20, h = 50 + freeRoll(4) * 20;
    const x = area.x + 60 + freeRoll(width - 120 - w), y = area.y + 150 + freeRoll(height - 300 - h);
    const candidate = { x, y, width: w, height: h, ...(theme === 'ocre' ? { kind: 'pilier' } : {}) };
    const nearStart = Math.hypot(x + w / 2 - start.x, y + h / 2 - start.y) < 170;
    const overlap = blocks.some(b => x < b.x + b.width + 60 && x + w + 60 > b.x && y < b.y + b.height + 60 && y + h + 60 > b.y);
    if (!nearStart && !overlap) blocks.push(candidate);
  }
  const specs = [];
  const count = 5 + freeRoll(4);
  const pool = ['goblin', 'goblin', 'sauteur', 'ogre', 'fuyard'];
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0;
    for (let tries = 0; tries < 60; tries++) {
      x = area.x + 70 + freeRoll(width - 140); y = area.y + 100 + freeRoll(height - 260);
      if (free(x, y, 40) && Math.hypot(x - start.x, y - start.y) > 260) break;
    }
    const kind = freePick(pool);
    specs.push({ kind, x, y, level: level + freeRoll(4), aggro: 260 + freeRoll(40), ...(kind === 'fuyard' ? { refuge: { x: freeRoll(2) ? area.x + 90 : area.x + width - 90, y: area.y + 90 } } : {}) });
  }
  specs.push({ kind: 'chef', x: 0, y: area.y + 110, level: level + 5, aggro: 340 });
  zones.faille = { id: 'faille', title: `ABYSSE · FAILLE ${spot.label.toUpperCase()}`, theme, room: area, start, blocks, doors: [], enemies: specs, props: [],
    goal: () => freeMode.done ? 'Faille refermée : rejoins le passage ↓' : `Vaincs-les tous (${specs.length - failleRemaining()}/${specs.length})`,
    label: () => `Niv. ${level} à ${level + 5} · ${specs.length - failleRemaining()}/${specs.length}` };
  zoneEnemies.faille = specs.map(makeEnemy);
  return zones.faille;
}

function enterFaille(spotId) {
  const spot = freeSpots[spotId];
  freeMode.from = spotId;
  freeMode.done = false;
  generateFaille(spot);
  enterZone('faille', 'start');
  for (const enemy of zoneEnemies.faille) resetEnemy(enemy);
  Object.assign(player, { hp: player.maxHp, mana: player.maxMana });
  updateStatus();
}

function enterHub(id) {
  freeMode.from = id;
  freeMode.done = false;
  enterZone(id, 'start');
  Object.assign(sceneActors, {});
  for (const key of Object.keys(sceneActors)) delete sceneActors[key];
}

function startFreeMode() {
  result.hidden = true;
  resultDelay = 0;
  combatOver = false;
  paused = false;
  freeMode.active = true;
  freeMode.clears = 0;
  scene.active = false; scene.done = true;
  scytheFreed = true;
  player.armed = true;
  Object.assign(player, levelStats, { flash: 0 });
  playerLevel = levelUp.level;
  stats.unlocked = true;
  isharaOutfit = 'course';
  player.hp = player.maxHp; player.mana = player.maxMana;
  enterHub('quartier');
  resetInput();
  resetYardenSprite();
  updateStatus();
  updateAttackButton();
}

// Mort ou retour volontaire : on revient dans la rue, soignée, sans rien perdre.
function freeReturn() {
  result.hidden = true;
  resultDelay = 0;
  combatOver = false;
  Object.assign(player, { hp: player.maxHp, mana: player.maxMana, flash: 0 });
  attack.remaining = 0; dodge.remaining = 0;
  enterHub(freeMode.from);
  resetYardenSprite();
  updateStatus();
  updateAttackButton();
}

function updateFree(seconds = 0) {
  if (!freeMode.active || combatOver) return;
  if (currentZone.id === 'faille') {
    if (!freeMode.done && failleRemaining() === 0) {
      freeMode.done = true;
      freeMode.doneAge = 0;
      lootToast('Faille refermée');
    }
    if (freeMode.done) freeMode.doneAge += seconds;
    // Le passage ne s'ouvre qu'une seconde après la dernière victoire, pour ne pas repartir par erreur depuis l'entrée.
    if (freeMode.done && freeMode.doneAge > 1 && Math.hypot(player.x - zones.faille.start.x, player.y - zones.faille.start.y) < 44) {
      freeMode.clears++;
      enterHub(freeMode.from);
    }
  } else if (freeSpots[currentZone.id]) {
    const spot = freeSpots[currentZone.id];
    if (Math.hypot(player.x - spot.x, player.y - spot.y) < 40) enterFaille(currentZone.id);
  }
}

// La faille : un rectangle d'air déformé, violet ; dans la salle, le même signe sert de sortie une fois le chef vaincu.
function drawFreeRift(offsetX, offsetY) {
  if (!freeMode.active) return;
  let point = null;
  if (freeSpots[currentZone.id]) point = freeSpots[currentZone.id];
  else if (currentZone.id === 'faille' && freeMode.done) point = zones.faille.start;
  if (!point) return;
  const t = mirrorNow(), x = point.x + offsetX, y = point.y + offsetY;
  const glow = ctx.createRadialGradient(x, y - 20, 4, x, y - 20, 70);
  glow.addColorStop(0, 'rgba(190, 150, 255, .55)'); glow.addColorStop(1, 'rgba(190, 150, 255, 0)');
  ctx.fillStyle = glow; ctx.fillRect(x - 70, y - 90, 140, 140);
  ctx.strokeStyle = '#d8c2ff'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 12; i++) { const yy = y - 52 + i * 9; const wobble = Math.sin(t * 3 + i * .9) * 2.5; if (i === 0) ctx.moveTo(x - 17 + wobble, yy); else ctx.lineTo(x - 17 + wobble, yy); }
  for (let i = 12; i >= 0; i--) { const yy = y - 52 + i * 9; const wobble = Math.sin(t * 3 + i * .9 + 2) * 2.5; ctx.lineTo(x + 17 + wobble, yy); }
  ctx.closePath(); ctx.fillStyle = 'rgba(70, 40, 130, .5)'; ctx.fill(); ctx.stroke();
}

// ---------- La carte ----------
const mapPanel = document.getElementById('map-panel');

function openMap() {
  if (!freeMode.active || stats.open) return;
  resetInput();
  stats.open = true;
  stats.from = null;
  freeMode.mapOpen = true;
  const list = document.getElementById('map-list');
  list.innerHTML = Object.entries(freeSpots).map(([id, spot]) => `<button type="button" data-spot="${id}"${freeMode.from === id && currentZone.id !== 'faille' ? ' class="here"' : ''}><span>${spot.label}</span><b>Failles · niv. ${spot.base} et plus</b></button>`).join('');
  mapPanel.hidden = false;
  document.getElementById('map-close').focus();
  updateAttackButton();
}

function closeMap() {
  if (!freeMode.mapOpen) return;
  freeMode.mapOpen = false;
  mapPanel.hidden = true;
  stats.open = false;
  lastTime = null;
  canvas.focus();
  updateAttackButton();
}

function updateFreeHud() {
  const button = document.getElementById('map-button');
  if (button) button.hidden = !freeMode.active;
  const free = document.getElementById('free-button');
  if (free) free.hidden = !(stage === 'escaped' && combatOver && !freeMode.active);
}

function resetFree() {
  freeMode.active = false; freeMode.done = false; freeMode.mapOpen = false; freeMode.clears = 0;
  mapPanel.hidden = true;
}

document.getElementById('map-button').addEventListener('click', openMap);
document.getElementById('map-close').addEventListener('click', closeMap);
document.getElementById('map-list').addEventListener('click', event => {
  const button = event.target && event.target.closest ? event.target.closest('button') : null;
  if (!button || !button.dataset.spot) return;
  closeMap();
  enterHub(button.dataset.spot);
  updateStatus();
});
document.getElementById('free-button').addEventListener('click', startFreeMode);
