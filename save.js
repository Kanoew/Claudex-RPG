'use strict';

// Sauvegarde par points de passage, dans le navigateur (localStorage) : aucun compte, rien n'est envoyé.
// Trois points : l'entrée dans l'Abysse, la sortie du Troll vers l'antre, l'arrivée dans la ruelle après l'araignée.
// Si le navigateur refuse le stockage (navigation privée), le jeu continue sans sauvegarde.
const saveKey = 'yarden-sauvegarde-1';
const checkpointNames = { abysse: 'Entrée dans l’Abysse', antre: 'Devant l’antre', rue: 'Ruelle d’Helvara' };

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
  stats.unlocked = true;
  player.hp = player.maxHp;
  player.mana = player.maxMana;
  enterZone('exterieur', 'south');
}
