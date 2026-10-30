'use strict';

// Interface de Yarden : niveau et statistiques du chapitre 2 (canon de Jordan). Elles ne changent rien au combat pour l'instant :
// les PV, le mana et les coûts viennent de `levelUp.js` et `state.js`. Aucun gain d'expérience pendant le chapitre 2.
const yardenStats = { level: 24, FOR: 20, DEX: 18, AGI: 12, VIT: 5, INT: 'Infinie, plafonnée par son niveau' };
const stats = { open: false, unlocked: false, from: null };
const statsPanel = document.getElementById('stats-panel');

const statsBarMax = 30;

// Les lignes de l'écran : une barre par statistique, l'une sous l'autre (valeur, part de la barre, couleur).
function statsRows() {
  const bar = (label, value, ratio, kind) => ({ label, value: String(value), ratio, kind });
  return [
    bar('FOR', yardenStats.FOR, yardenStats.FOR / statsBarMax, 'stat'),
    bar('DEX', yardenStats.DEX, yardenStats.DEX / statsBarMax, 'stat'),
    bar('AGI', yardenStats.AGI, yardenStats.AGI / statsBarMax, 'stat'),
    bar('VIT', yardenStats.VIT, yardenStats.VIT / statsBarMax, 'stat'),
    bar('INT', '∞', 1, 'infini'),
    bar('VIE', player.maxHp, player.hp / player.maxHp, 'vie'),
    bar('MANA', player.maxMana, player.mana / player.maxMana, 'mana')
  ];
}

const statsLines = () => [`Fauchage Circulaire : ${skill.cost} pts de Mana`, `Crédits : ${credits}`, ...(debt ? [`Dette : ${debt}`] : []), `Identité administrative : ${identityName ? identityName + ' (papiers dans 3 jours)' : 'aucune'}`];

// Version texte (pour les lecteurs d'écran et les tests).
function statsText() {
  return [`Niveau ${yardenStats.level}`, ...statsRows().map(row => `${row.label} ${row.value}`), 'INT : infinie, plafonnée par son niveau', ...statsLines()].join('\n');
}

function statsHtml() {
  const rows = statsRows().map(row => `<div class="stat ${row.kind}"><span class="stat-name">${row.label}</span><span class="stat-bar"><i style="width:${Math.round(Math.max(0, Math.min(1, row.ratio)) * 100)}%"></i></span><b>${row.value}</b></div>`).join('');
  return `<div class="stat-level"><span>NIV.</span><strong>${yardenStats.level}</strong></div>${rows}${statsLines().map(line => `<div class="stat-line">${line}</div>`).join('')}`;
}

// `from` : 'menu' pour revenir au menu de pause à la fermeture, ou une fonction à appeler.
function openStats(from) {
  resetInput();
  stats.open = true;
  stats.from = from || null;
  const body = document.getElementById('stats-body');
  body.innerHTML = statsHtml();
  body.setAttribute('aria-label', statsText().replace(/\n/g, ', '));
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
