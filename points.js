'use strict';

// Écran d'attribution des points (chapitre 5) : deux points par niveau, six points pour les niveaux 24 à 27.
// Le canon les met tous en VIT (5 → 11) : c'est le seul bouton actif, les autres lignes sont fixées par le récit.
// L'écran réutilise « stats.open » pour mettre le jeu en pause, comme le sac et les statistiques.
const pointsPanel = document.getElementById('points-panel');
const pointsState = { open: false, left: 0, spent: 0 };

function pointsHtml() {
  const lock = '<span class="points-lock">fixé</span>';
  const row = (name, value, extra) => `<div class="points-row"><span>${name}</span><b>${value}</b>${extra}</div>`;
  return `<div class="points-left">Points disponibles <strong>${pointsState.left}</strong></div>`
    + row('FOR', yardenStats.FOR, lock) + row('DEX', yardenStats.DEX, lock) + row('AGI', yardenStats.AGI, lock)
    + row('VIT', yardenStats.VIT, `<button type="button" id="points-add" ${pointsState.left > 0 ? '' : 'disabled'} aria-label="Ajouter un point en VIT">+1</button>`)
    + row('INT', '∞', '<span class="points-lock">suit le niveau</span>')
    + `<p class="points-note">${pointsState.left > 0 ? 'Une seule chose à acheter : du temps.' : 'Tout est placé.'}</p>`;
}

function renderPoints() {
  document.getElementById('points-body').innerHTML = pointsHtml();
  const ok = document.getElementById('points-close');
  ok.disabled = pointsState.left > 0;
  ok.textContent = 'Valider';
}

function openPoints(total = 6) {
  resetInput();
  Object.assign(pointsState, { open: true, left: total, spent: 0 });
  stats.open = true;
  stats.from = null;
  renderPoints();
  pointsPanel.hidden = false;
  updateAttackButton();
  const add = document.getElementById('points-add');
  if (add) add.focus();
}

function addPoint() {
  if (!pointsState.open || pointsState.left <= 0) return;
  pointsState.left--; pointsState.spent++;
  yardenStats.VIT++;
  playSfx('hit');
  renderPoints();
  const next = pointsState.left > 0 ? document.getElementById('points-add') : document.getElementById('points-close');
  if (next) next.focus();
}

function closePoints() {
  if (!pointsState.open || pointsState.left > 0) return;
  pointsState.open = false;
  pointsPanel.hidden = true;
  stats.open = false;
  lastTime = null;
  canvas.focus();
  updateAttackButton();
}

function resetPoints() {
  pointsState.open = false; pointsState.left = 0; pointsState.spent = 0;
  pointsPanel.hidden = true;
}

document.getElementById('points-body').addEventListener('click', event => {
  if (event.target && event.target.id === 'points-add') addPoint();
});
document.getElementById('points-close').addEventListener('click', closePoints);
