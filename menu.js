'use strict';

// Menu du jeu : écran titre (nouvelle partie ou reprise) et pause (reprendre, recommencer, effacer la sauvegarde).
// Tant qu'il est ouvert, le jeu est figé (`menu.open` bloque les commandes comme un récit).
const menu = { open: false, kind: 'title', confirm: null };
const menuPanel = document.getElementById('menu-panel');
const menuButtons = {
  continue: document.getElementById('menu-continue'), new: document.getElementById('menu-new'), resume: document.getElementById('menu-resume'),
  restart: document.getElementById('menu-restart'), sound: document.getElementById('menu-sound'), stats: document.getElementById('menu-stats')
};

function menuLabelFor(save) {
  return save ? `Continuer · ${checkpointNames[save.checkpoint]}` : 'Continuer';
}

// Derrière l'écran titre : la ruelle du réveil, sans la faille ni les jauges.
function titleBackdrop() {
  abyssReached = false;
  riftShown = false;
  loadZone('exterieur');
  Object.assign(player, zones.exterieur.start);
  updateStatus();
}

function openMenu(kind) {
  resetInput();
  Object.assign(menu, { open: true, kind, confirm: null });
  const save = readSave();
  document.getElementById('menu-title').textContent = kind === 'title' ? 'YARDEN' : 'Pause';
  document.getElementById('menu-note').textContent = kind === 'title' ? 'L’Abysse · Chapitre 1' : (save ? `Dernier point de passage : ${checkpointNames[save.checkpoint]}` : 'Aucun point de passage encore');
  menuButtons.continue.hidden = kind !== 'title' || !save;
  menuButtons.continue.textContent = menuLabelFor(save);
  menuButtons.new.hidden = kind !== 'title';
  menuButtons.new.textContent = save ? 'Nouvelle partie' : 'Commencer';
  menuButtons.resume.hidden = kind !== 'pause';
  menuButtons.restart.hidden = kind !== 'pause' || !save;
  menuButtons.restart.textContent = 'Revenir au dernier point de passage';
  menuButtons.stats.hidden = kind !== 'pause' || !stats.unlocked;
  menuButtons.sound.textContent = soundLabel();
  syncMusic();
  menuPanel.hidden = false;
  (kind === 'title' ? (save ? menuButtons.continue : menuButtons.new) : menuButtons.resume).focus();
  updateAttackButton();
}

function closeMenu() {
  menu.open = false;
  menu.confirm = null;
  menuPanel.hidden = true;
  lastTime = null;
  canvas.focus();
  updateAttackButton();
}

// Nouvelle partie quand une sauvegarde existe : deux appuis pour ne pas l'effacer par erreur.
function menuNewGame() {
  if (readSave() && menu.confirm !== 'new') {
    menu.confirm = 'new';
    menuButtons.new.textContent = 'Confirmer : effacer la sauvegarde';
    return;
  }
  clearSave();
  closeMenu();
  startOpening();
}

function menuContinue() {
  const save = readSave();
  closeMenu();
  if (save) applyCheckpoint(save.checkpoint); else startOpening();
}

menuButtons.continue.addEventListener('click', menuContinue);
menuButtons.new.addEventListener('click', menuNewGame);
menuButtons.resume.addEventListener('click', closeMenu);
menuButtons.restart.addEventListener('click', menuContinue);
menuButtons.sound.addEventListener('click', () => { setSound(!audio.enabled); menuButtons.sound.textContent = soundLabel(); });
menuButtons.stats.addEventListener('click', () => { menuPanel.hidden = true; openStats(() => { menuPanel.hidden = false; menuButtons.stats.focus(); }); });
const pauseButton = document.getElementById('pause-button');
pauseButton.addEventListener('click', () => { if (!menu.open && !combatOver) openMenu('pause'); else if (menu.open && menu.kind === 'pause') closeMenu(); });
window.addEventListener('keydown', event => {
  if (event.code === 'Escape' && !event.repeat && !combatOver && !(menu.open && menu.kind === 'title')) {
    event.preventDefault();
    if (menu.open) closeMenu(); else if (!story.active) openMenu('pause');
  }
});
