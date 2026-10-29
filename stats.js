'use strict';

// Interface de Yarden : niveau et statistiques du chapitre 2 (canon de Jordan). Elles ne changent rien au combat pour l'instant :
// les PV, le mana et les coûts viennent de `levelUp.js` et `state.js`. Aucun gain d'expérience pendant le chapitre 2.
const yardenStats = { level: 24, FOR: 20, DEX: 18, AGI: 12, VIT: 5, INT: 'Infinie, plafonnée par son niveau' };
const stats = { open: false, unlocked: false, from: null };
const statsPanel = document.getElementById('stats-panel');

function statsText() {
  return [
    `Niveau ${yardenStats.level}`,
    `FOR ${yardenStats.FOR}   DEX ${yardenStats.DEX}   AGI ${yardenStats.AGI}   VIT ${yardenStats.VIT}`,
    `INT : ${yardenStats.INT}`,
    `Vie ${player.maxHp}   ·   Mana ${player.maxMana}`,
    `Faux : appel gratuit, Fauchage ${skill.cost} mana`,
    `Crédits : ${credits}`,
    'Identité administrative : aucune'
  ].join('\n');
}

// `from` : 'menu' pour revenir au menu de pause à la fermeture, ou une fonction à appeler.
function openStats(from) {
  resetInput();
  stats.open = true;
  stats.from = from || null;
  document.getElementById('stats-body').textContent = statsText();
  statsPanel.hidden = false;
  document.getElementById('stats-close').focus();
  updateAttackButton();
}

function closeStats() {
  if (!stats.open) return;
  const from = stats.from;
  stats.open = false;
  stats.from = null;
  statsPanel.hidden = true;
  lastTime = null;
  canvas.focus();
  updateAttackButton();
  if (typeof from === 'function') from();
}

function resetStats() {
  stats.open = false;
  stats.unlocked = false;
  stats.from = null;
  statsPanel.hidden = true;
}

document.getElementById('stats-close').addEventListener('click', closeStats);
