'use strict';

// Sauvegarde par points de passage, dans le navigateur (localStorage) : aucun compte, rien n'est envoyé.
// Trois points : l'entrée dans l'Abysse, la sortie du Troll vers l'antre, l'arrivée dans la ruelle après l'araignée.
// Si le navigateur refuse le stockage (navigation privée), le jeu continue sans sauvegarde.
const saveKey = 'yarden-sauvegarde-1';
const checkpointNames = { abysse: 'Entrée dans l’Abysse', antre: 'Devant l’antre', rue: 'Ruelle d’Helvara', appart: 'Chez Ishara', nuit: 'Chez Ishara, le soir', matin: 'Chez Ishara, le matin', impasse: 'Jour 2, l’impasse', marterey: 'Rue Marterey', sousgare: 'Quartier Sous-gare', quatreb: 'Le 4B', pates: 'Chapitre 4, les pâtes', chasse: 'Chapitre 4, le square', celeste: 'Chapitre 4, 14 h', jour4: 'Chapitre 5, jour 4', costumes: 'Chapitre 6, la porte cochère', seizieme: 'Chapitre 6, le seizième étage' };

function storage() {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch (error) { return null; }
}

function saveCheckpoint(name) {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(saveKey, JSON.stringify({ version: 1, checkpoint: name, elapsed: Math.floor(elapsed) }));
    return true;
  } catch (error) {
    return false;
  }
}

function readSave() {
  const store = storage();
  if (!store) return null;
  try {
    const data = JSON.parse(store.getItem(saveKey));
    return data && data.version === 1 && checkpointNames[data.checkpoint] ? data : null;
  } catch (error) {
    return null;
  }
}

function clearSave() {
  const store = storage();
  try { if (store) store.removeItem(saveKey); } catch (error) { /* rien à effacer */ }
}

// Remet le monde dans l'état du point de passage : monstres vaincus, portes ouvertes, stats du moment.
function applyCheckpoint(name) {
  skipOpening();
  elapsed = (readSave() || {}).elapsed || 0;
  if (name === 'abysse') return;
  for (const enemy of enemies) enemy.hp = 0;
  stage = 'exit';
  exitOpen = true;
  player.armed = true;
  enterZone('antre', 'south');
  if (name === 'antre') return;
  const spider = spiderEnemy();
  Object.assign(spider, { incapacitated: true, hp: 1 });
  Object.assign(encounter, { phase: 'complete', complete: true });
  Object.assign(player, levelStats);
  playerLevel = levelUp.level;
  stats.unlocked = true;
  player.hp = player.maxHp;
  player.mana = player.maxMana;
  enterZone('exterieur', 'south');
  if (name === 'rue') return;
  scene.done = true;
  scytheFreed = !['rue', 'appart', 'nuit'].includes(name);
  yardenOutfit = name === 'nuit' ? 'tshirt-short' : '';
  if (name === 'marterey') for (const drop of runDrops) if (drop) bag.push({ ...drop });
  if (name === 'sousgare' || name === 'quatreb') credits = 280;
  if (['costumes', 'seizieme'].includes(name)) { credits = 0; debt = 0; identityName = 'Yarden Weiss'; playerLevel = 27; yardenStats.level = 27; yardenStats.VIT = 11; }
  if (['pates', 'chasse', 'celeste', 'jour4'].includes(name)) { credits = 0; debt = 520; identityName = 'Yarden Weiss'; if (name === 'celeste' || name === 'jour4') { playerLevel = 27; yardenStats.level = 27; } }
  isharaOutfit = ['impasse', 'matin', 'marterey', 'sousgare', 'quatreb', 'pates', 'chasse', 'celeste', 'jour4', 'costumes', 'seizieme'].includes(name) ? 'course' : 'soiree';
  if (name === 'appart') { enterApartment('arrive'); startScene(apartmentArrivalSteps()); }
  else if (name === 'impasse' || name === 'matin') startScene(impasseScript());
  else if (name === 'marterey') startScene(marteryScript());
  else if (name === 'sousgare') startScene(sousgareScript());
  else if (name === 'quatreb') startScene(quatrebScript());
  else if (name === 'pates') startScene(chapter4Script());
  else if (name === 'chasse') startScene(chapter4Script().slice(pastaScene().length));
  else if (name === 'celeste') startScene([...celesteScene(), ...araigneeScene()]);
  else if (name === 'jour4') startScene(chapter5Script());
  else if (name === 'costumes') startScene(costumesScene());
  else if (name === 'seizieme') startScene(penthouseScene());
  else enterApartment('nuit');
}
