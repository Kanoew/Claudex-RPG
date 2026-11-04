'use strict';

// Le sac à dos et les crédits : le butin ramassé dans l'Abysse reste dans le sac jusqu'à la vente chez Rémi.
// L'écran du sac réutilise l'état « stats.open » pour mettre le jeu en pause, comme l'écran des statistiques.
const bagPanel = document.getElementById('bag-panel');

function bagHtml() {
  const rows = bag.length
    ? bag.map(item => `<div class="bag-row"><span>${item.name}</span><b>${item.display || `niv. ${item.level}${item.note ? ' · ' + item.note : ''}`}</b></div>`).join('')
    : '<div class="bag-empty">Le sac est vide.</div>';
  return `<div class="bag-credits"><span>CRÉDITS</span><strong>${credits}</strong></div>${debt ? `<div class="bag-row"><span>Dette envers Félix</span><b>${debt}</b></div>` : ''}${rows}`;
}

function openBag() {
  resetInput();
  stats.open = true;
  stats.from = null;
  document.getElementById('bag-body').innerHTML = bagHtml();
  bagPanel.hidden = false;
  document.getElementById('bag-close').focus();
  updateAttackButton();
}

function closeBag() {
  if (bagPanel.hidden) return;
  bagPanel.hidden = true;
  stats.open = false;
  lastTime = null;
  canvas.focus();
  updateAttackButton();
}

// Pastille de crédits et bouton du sac : visibles dès qu'il y a du butin ou de l'argent.
function updateBagHud() {
  const visible = bag.length > 0 || credits > 0 || debt > 0;
  const chip = document.getElementById('credit-chip'), button = document.getElementById('bag-button');
  if (!chip || !button) return;
  chip.hidden = !visible;
  button.hidden = !visible;
  hudText('credit-chip', `${credits} ¢`);
  button.textContent = bag.length ? `Sac · ${bag.length}` : 'Sac';
}

function resetBag() {
  bag.length = 0;
  bagPanel.hidden = true;
}

document.getElementById('bag-button').addEventListener('click', openBag);
document.getElementById('bag-close').addEventListener('click', closeBag);
