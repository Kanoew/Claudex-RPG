'use strict';

// Histoire du hub (CAHIER-DES-CHARGES.md, étape 5) : les scènes déjà dans le jeu (chapitres 2b à 6) sont découpées en dix morceaux.
// Chaque run réussi (chef vaincu) débloque le morceau suivant ; le bouton « Histoire » le rejoue depuis la rue. Aucune scène nouvelle, aucun texte réécrit.
// L'ordre est une simple liste (`hubUnits`) : à réordonner avec Jordan. Les scènes rejouées ne touchent ni aux crédits, ni au sac, ni à la dette, ni au niveau
// (tout est remis comme avant à la fin) et ne changent jamais le point de passage de l'histoire.
const hubPlayback = { active: false, unit: null, snap: null };
let storyChain = true;

const hubUnits = [
  { id: 'remi', title: 'Le comptoir de Rémi', steps: () => marteryScript(), grants: 'remi' },
  { id: 'sousgare', title: 'Sous-gare, le 4B', steps: () => [...sousgareScript(), ...quatrebScript()] },
  { id: 'pates', title: 'Les pâtes et la rupture', steps: () => [...pastaScene(), ...ruptureScene()] },
  { id: 'equipe', title: 'L’équipe', steps: () => [...equipeScene(), ...retourScene()] },
  { id: 'celeste', title: 'Céleste', steps: () => celesteScene() },
  { id: 'araignee', title: 'L’araignée', steps: () => araigneeScene() },
  { id: 'dette', title: 'Le poids d’une dette', steps: () => [...morningScene(), ...cityScene()] },
  { id: 'felix', title: 'Félix et les costumes', steps: () => [...felixScene(), ...costumesScene(), ...chefReturns()] },
  { id: 'preau', title: 'Le préau et le Flon', steps: () => [...preauScene(), ...searchScene(), ...repayScene()] },
  { id: 'ouchy', title: 'Ouchy', steps: () => [...ouchyScene(), ...penthouseScene()] }
];

// Un run réussi débloque un morceau de plus.
function unlockStoryUnit() {
  meta.unlocked = Math.min(hubUnits.length, meta.unlocked + 1);
  saveMeta();
}

function nextHubUnit() {
  const index = hubUnits.findIndex(unit => !meta.seen.includes(unit.id));
  return index >= 0 && index < meta.unlocked ? hubUnits[index] : null;
}

const hubStoryReady = () => freeMode.active && !!freeSpots[currentZone.id] && !hubPlayback.active && !scene.active && !story.active && !!nextHubUnit();

// Copie des états que les scènes d'histoire modifient (elles ont été écrites pour un parcours linéaire).
function cloneStateObject(object) {
  const copy = {};
  for (const [key, value] of Object.entries(object)) copy[key] = value instanceof Set ? new Set(value) : Array.isArray(value) ? [...value] : value;
  return copy;
}
const hubTracked = () => ({ ch2b, ch4, ch6, home, levelUp, pointsState, yardenStats, player });
function hubSnapshot() {
  const objects = {};
  for (const [name, object] of Object.entries(hubTracked())) objects[name] = cloneStateObject(object);
  return { objects, credits, debt, bag: bag.map(item => ({ ...item })), yardenOutfit, isharaOutfit, identityName, playerLevel, scytheFreed, abyssReached, stage };
}
function hubRestore(snap) {
  for (const [name, object] of Object.entries(hubTracked())) Object.assign(object, snap.objects[name]);
  credits = snap.credits; debt = snap.debt;
  bag.length = 0; bag.push(...snap.bag);
  ({ yardenOutfit, isharaOutfit, identityName, playerLevel, scytheFreed, abyssReached, stage } = snap);
}

function playHubUnit() {
  const unit = nextHubUnit();
  if (!unit || !hubStoryReady()) return false;
  resetInput();
  hubPlayback.active = true; hubPlayback.unit = unit; hubPlayback.snap = hubSnapshot();
  storyChain = false; freeMode.active = false;
  const steps = unit.steps().filter(step => !('end' in step));
  startScene([...steps, { run: finishHubUnit }, { finish: true }]);
  updateFreeHud();
  return true;
}

function finishHubUnit() {
  const unit = hubPlayback.unit;
  if (hubPlayback.snap) hubRestore(hubPlayback.snap);
  Object.assign(hubPlayback, { active: false, unit: null, snap: null });
  storyChain = true;
  resetScene();
  scene.done = true;
  freeMode.active = true;
  if (unit) {
    if (!meta.seen.includes(unit.id)) meta.seen.push(unit.id);
    if (unit.grants === 'remi') meta.remiMet = true;
  }
  saveMeta();
  Object.assign(player, { hp: player.maxHp, mana: player.maxMana });
  enterHub(freeMode.from);
  updateStatus(); updateAttackButton(); updateFreeHud(); updateBagHud();
  lootToast(unit ? `Histoire : ${unit.title}` : 'Histoire');
}

function updateStoryButton() {
  const button = document.getElementById('story-button');
  if (!button) return;
  const unit = hubStoryReady() ? nextHubUnit() : null;
  button.hidden = !unit;
  if (unit) { button.textContent = 'Histoire ✦'; button.setAttribute('aria-label', `Histoire : ${unit.title}`); button.title = unit.title; }
}

document.getElementById('story-button').addEventListener('click', playHubUnit);
