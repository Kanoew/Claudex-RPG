'use strict';

// Mode libre : ouvert à la fin du prototype, pour passer le temps. Une carte de Lausanne, des failles dans trois quartiers,
// et un donjon tiré au hasard à chaque entrée : 2 ou 3 décors, 5 à 8 monstres, puis un chef. Ni butin, ni vente, ni expérience.
// Rien ici ne touche à l'histoire : la dette de Félix reste la même.
const freeKey = 'yarden-mode-libre';
const freeMode = { active: false, clears: 0, from: 'quartier', done: false, rng: Math.random, mapOpen: false, destination: null, mapSelected: null };

// Les trois quartiers où s'ouvrent des failles : position de la faille dans la rue et niveau de base des monstres.
const freeSpots = {
  quartier: { x: 120, y: 150, label: 'Quartier étudiant', short: 'Quartier', base: 8 },
  marterey: { x: 150, y: 60, label: 'Rue Marterey', short: 'Marterey', base: 14 },
  sousgare: { x: 150, y: 100, label: 'Sous-gare', short: 'Sous-gare', base: 20 }
};
const freeThemes = ['pierre', 'cristal', 'ocre'];
// Les rues se suivent : on sort par le bord est ou ouest pour passer à la rue voisine (la carte montre le plan).
const freeLinks = { quartier: { east: 'marterey' }, marterey: { west: 'quartier', east: 'sousgare' }, sousgare: { west: 'marterey' } };

function freeUnlocked() {
  try { return typeof localStorage !== 'undefined' && localStorage.getItem(freeKey) === '1'; } catch (error) { return false; }
}

function unlockFree() {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(freeKey, '1'); } catch (error) { /* pas de stockage : le bouton reste là jusqu'à la fermeture */ }
  freeMode.unlockedNow = true;
}

// Les rues gardent leurs textes d'histoire ; en mode libre, l'objectif devient « cherche la faille ».
function freeGoal(original) {
  return () => {
    if (!freeMode.active) return original ? original() : '';
    const direction = freeDirection(freeMode.destination);
    return direction ? `${direction === 'east' ? '→' : '←'} ${freeSpots[freeMode.destination].label} · à pied` : 'Entre dans la faille ✦';
  };
}
zones.quartier.goal = freeGoal(zones.quartier.goal);
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
  const pool = ['goblin', 'goblin', 'sauteur', 'ogre', 'fuyard', 'insecte', 'insecte', 'rampant', 'rampant', 'crabe', 'tatou', 'rouge'];
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0;
    for (let tries = 0; tries < 60; tries++) {
      x = area.x + 70 + freeRoll(width - 140); y = area.y + 100 + freeRoll(height - 260);
      if (free(x, y, 40) && Math.hypot(x - start.x, y - start.y) > 260) break;
    }
    const kind = freePick(pool);
    specs.push({ kind, x, y, level: level + freeRoll(4), aggro: 260 + freeRoll(40), ...(kind === 'fuyard' ? { refuge: { x: freeRoll(2) ? area.x + 90 : area.x + width - 90, y: area.y + 90 } } : {}) });
  }
  specs.push({ kind: freePick(['chef', 'golem']), x: 0, y: area.y + 110, level: level + 5, aggro: 340 });
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

// Passage d'une rue à l'autre : on arrive du côté opposé, à hauteur du départ de la nouvelle rue.
function walkToStreet(id, side) {
  const previousY = player.y;
  enterHub(id);
  const r = zones[id].room;
  player.x = side === 'west' ? r.x + 56 : r.x + r.width - 56;
  // On garde à peu près la hauteur d'où l'on vient, pour que la rue paraisse continue ; le fondu est très bref.
  const lane = zones[id].start.y;
  player.y = Math.max(lane - 60, Math.min(lane + 40, previousY));
  zoneFade = .1;
  zoneTransition.duration = .1;
  if (freeMode.destination === id) freeMode.destination = null;
  updateStatus();
}

function startFreeMode() {
  result.hidden = true;
  resultDelay = 0;
  combatOver = false;
  paused = false;
  freeMode.active = true;
  freeMode.clears = 0;
  freeMode.destination = null;
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
    const links = freeLinks[currentZone.id] || {};
    if (links.east && player.x > room.x + room.width - 38) { walkToStreet(links.east, 'west'); return; }
    if (links.west && player.x < room.x + 38) { walkToStreet(links.west, 'east'); return; }
    const spot = freeSpots[currentZone.id];
    if (Math.hypot(player.x - spot.x, player.y - spot.y) < 40) enterFaille(currentZone.id);
  }
}

// Mini-plan permanent en haut à droite du terrain : les trois rues reliées, la position actuelle en clair, une étoile quand une faille est ouverte.
function drawFreeMinimap() {
  const ids = Object.keys(freeSpots), here = currentZone.id === 'faille' ? freeMode.from : currentZone.id;
  const w = 46, h = 14, gap = 8, total = ids.length * w + (ids.length - 1) * gap;
  const x0 = width - total - 12, y0 = 34;
  ctx.save();
  ctx.globalAlpha = .9;
  ctx.fillStyle = '#120d22cc'; ctx.beginPath(); (ctx.roundRect || ctx.rect).call(ctx, x0 - 6, y0 - 8, total + 12, h + 24, 8); ctx.fill();
  ids.forEach((id, i) => {
    const x = x0 + i * (w + gap), active = id === here;
    if (i < ids.length - 1) { ctx.fillStyle = '#8b78c9'; ctx.fillRect(x + w, y0 + h / 2 - 1, gap, 2); }
    ctx.fillStyle = active ? '#d8c2ff' : '#3b2f5f'; ctx.beginPath(); (ctx.roundRect || ctx.rect).call(ctx, x, y0, w, h, 4); ctx.fill();
    ctx.strokeStyle = '#8b78c9'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = active ? '#24162f' : '#cbbbf0'; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(freeSpots[id].short, x + w / 2, y0 + 10);
  });
  ctx.fillStyle = '#ffe3a8'; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
  const direction = freeDirection(freeMode.destination);
  const hint = direction ? `${direction === 'east' ? '→' : '←'} ${freeSpots[freeMode.destination].short}` : '✦ Une faille par rue';
  ctx.fillText(currentZone.id === 'faille' ? '✦ Dans une faille' : hint, x0, y0 + h + 12);
  ctx.restore();
}

// La faille : un rectangle d'air déformé, violet ; dans la salle, le même signe sert de sortie une fois le chef vaincu.
function drawFreeRift(offsetX, offsetY) {
  if (!freeMode.active) return;
  const links = freeLinks[currentZone.id];
  if (links) {
    ctx.save();
    ctx.font = '11px system-ui'; ctx.fillStyle = '#e4d8ff'; ctx.strokeStyle = '#e4d8ff'; ctx.lineWidth = 2;
    const y = zones[currentZone.id].start.y + offsetY, pulse = 3 * Math.sin(mirrorNow() * 3);
    for (const [side, id] of Object.entries(links)) {
      const east = side === 'east', x = (east ? room.x + room.width - 30 : room.x + 30) + offsetX, dir = east ? 1 : -1;
      ctx.beginPath(); ctx.moveTo(x - 6 * dir + pulse * dir, y - 10); ctx.lineTo(x + 2 * dir + pulse * dir, y); ctx.lineTo(x - 6 * dir + pulse * dir, y + 10); ctx.stroke();
      ctx.textAlign = east ? 'right' : 'left'; ctx.fillText(freeSpots[id].short, x - 4 * dir, y - 16);
    }
    ctx.restore();
  }
  let point = null;
  if (freeSpots[currentZone.id]) point = freeSpots[currentZone.id];
  else if (currentZone.id === 'faille' && freeMode.done) point = zones.faille.start;
  if (!point) return;
  // La même faille que dans la ruelle d'Helvara : bords qui ondulent, éclats aspirés, lueur bleue, toujours grande ouverte.
  const opened = riftOpenedAt;
  riftOpenedAt = mirrorNow() - 5;
  drawFaille(point.x + offsetX, point.y + offsetY - 14, currentZone.id === 'faille' ? 'RETOUR' : 'FAILLE', false);
  riftOpenedAt = opened;
}

// ---------- La carte ----------
const mapPanel = document.getElementById('map-panel');

// Itinéraire fondé uniquement sur les liaisons jouables, sans géographie supplémentaire.
function freeRoute(target) {
  const here = currentZone.id === 'faille' ? freeMode.from : currentZone.id;
  const queue = [[here]], seen = new Set([here]);
  while (queue.length) {
    const path = queue.shift(), last = path[path.length - 1];
    if (last === target) return path;
    for (const next of Object.values(freeLinks[last] || {})) {
      if (!seen.has(next)) { seen.add(next); queue.push([...path, next]); }
    }
  }
  return [];
}

function freeDirection(target) {
  const path = freeRoute(target);
  return path.length > 1 ? Object.keys(freeLinks[path[0]]).find(side => freeLinks[path[0]][side] === path[1]) : null;
}

function renderFreeMap() {
  const here = currentZone.id === 'faille' ? freeMode.from : currentZone.id;
  const selected = freeMode.mapSelected, spot = freeSpots[selected], path = freeRoute(selected);
  const inRift = currentZone.id === 'faille';
  const nodes = Object.entries(freeSpots).map(([id, item], index) =>
    `<button id="map-spot-${id}" class="map-district${here === id ? ' here' : ''}" type="button" data-map-spot="${id}" aria-pressed="${selected === id}"${here === id ? ' aria-current="location"' : ''}><span class="map-number" aria-hidden="true">0${index + 1}</span><span>${item.label}</span><small>${here === id ? inRift ? 'Faille en cours ici' : 'Vous êtes ici' : 'Sélectionner'}</small></button>${index < 2 ? '<div class="map-street" aria-hidden="true"><span>↕</span></div>' : ''}`
  ).join('');
  const direction = freeDirection(selected) === 'east' ? 'droite' : 'gauche';
  const instruction = inRift ? 'Revenez dans la rue pour suivre un itinéraire.' : selected === here ? 'Une faille est accessible dans cette rue.' : `Sortez par le bord ${direction} de la rue. Déplacement à pied.`;
  document.getElementById('map-list').innerHTML =
    `<p class="map-location">${inRift ? 'Dans une faille · ' : 'Vous êtes ici · '}${freeSpots[here].label}</p><p class="map-caption">Plan schématique · liaisons du mode libre</p><div class="map-layout"><div class="map-plan" role="group" aria-label="Quartiers reliés">${nodes}</div><section class="map-detail" aria-labelledby="map-selected-title"><span class="map-eyebrow">Quartier sélectionné</span><h3 id="map-selected-title">${spot.label}</h3><p class="map-level">Failles · niv. ${spot.base + Math.min(freeMode.clears, 6)} et plus</p><p>Une faille par rue. Ni butin, ni expérience.</p><p class="map-itinerary">${path.map(id => freeSpots[id].label).join(' → ')}</p><p>${instruction}</p><button type="button" data-map-go${inRift || selected === here || !path.length ? ' disabled' : ''}>${selected === here ? 'Vous êtes ici' : 'Y aller'}</button></section></div>`;
}

function selectMapSpot(id) {
  if (!freeMode.mapOpen || !freeSpots[id]) return;
  freeMode.mapSelected = id;
  renderFreeMap();
  document.getElementById(`map-spot-${id}`)?.focus();
  document.getElementById('map-selected-title')?.scrollIntoView({ block: 'nearest' });
}

function followMapRoute() {
  const id = freeMode.mapSelected;
  if (!freeMode.mapOpen || currentZone.id === 'faille' || !freeDirection(id)) return;
  freeMode.destination = id;
  closeMap();
  updateStatus();
}

function openMap() {
  if (!freeMode.active || stats.open) return;
  resetInput();
  stats.open = true;
  stats.from = null;
  freeMode.mapOpen = true;
  freeMode.mapSelected = freeMode.destination || (currentZone.id === 'faille' ? freeMode.from : currentZone.id);
  renderFreeMap();
  mapPanel.hidden = false;
  document.getElementById('map-close').focus();
  updateAttackButton();
}

function closeMap() {
  if (!freeMode.mapOpen) return;
  freeMode.mapOpen = false;
  mapPanel.hidden = true;
  stats.open = false;
  resetInput();
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
  freeMode.destination = null; freeMode.mapSelected = null;
  mapPanel.hidden = true;
}

document.getElementById('map-button').addEventListener('click', openMap);
document.getElementById('map-close').addEventListener('click', closeMap);
document.getElementById('map-list').addEventListener('click', event => {
  const spot = event.target.closest('[data-map-spot]');
  if (spot) selectMapSpot(spot.dataset.mapSpot);
  else if (event.target.closest('[data-map-go]')) followMapRoute();
});
document.getElementById('free-button').addEventListener('click', startFreeMode);
