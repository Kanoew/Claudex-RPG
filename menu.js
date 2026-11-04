'use strict';

// Menu du jeu : écran titre (nouvelle partie ou reprise) et pause (reprendre, recommencer, effacer la sauvegarde).
// Tant qu'il est ouvert, le jeu est figé (`menu.open` bloque les commandes comme un récit).
const menu = { open: false, kind: 'title', view: 'main', confirm: null };
const menuPanel = document.getElementById('menu-panel');
const menuButtons = {
  continue: document.getElementById('menu-continue'), new: document.getElementById('menu-new'), resume: document.getElementById('menu-resume'),
  restart: document.getElementById('menu-restart'), settings: document.getElementById('menu-settings'), back: document.getElementById('menu-back'), music: document.getElementById('menu-music'), effects: document.getElementById('menu-effects'), stats: document.getElementById('menu-stats'), free: document.getElementById('menu-free')
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

// Les deux vues du menu : le menu principal et les paramètres (musique, effets).
function showMenuView(view) {
  menu.view = view;
  document.getElementById('menu-main').hidden = view !== 'main';
  document.getElementById('menu-settings-view').hidden = view !== 'settings';
  document.getElementById('menu-vignette').hidden = !(menu.kind === 'title' && view === 'main');
  document.getElementById('menu-title').textContent = view === 'settings' ? 'Paramètres' : menu.kind === 'title' ? 'Le Sang de Tiamat' : 'Pause';
  menuButtons.music.textContent = musicLabel();
  menuButtons.effects.textContent = effectsLabel();
  musicSlider.value = Math.round(audio.musicVolume * 100);
  effectsSlider.value = Math.round(audio.effectsVolume * 100);
}

function openMenu(kind) {
  resetInput();
  Object.assign(menu, { open: true, kind, confirm: null });
  const save = readSave();
  document.getElementById('menu-note').textContent = kind === 'title' ? 'Yarden · Chapitre 1' : (save ? `Dernier point de passage : ${checkpointNames[save.checkpoint]}` : 'Aucun point de passage encore');
  menuButtons.continue.hidden = kind !== 'title' || !save;
  menuButtons.continue.textContent = menuLabelFor(save);
  menuButtons.new.hidden = kind !== 'title';
  menuButtons.new.textContent = save ? 'Nouvelle partie' : 'Commencer';
  menuButtons.free.hidden = kind !== 'title' || !freeUnlocked();
  menuButtons.resume.hidden = kind !== 'pause';
  menuButtons.restart.hidden = kind !== 'pause' || !save;
  menuButtons.restart.textContent = 'Revenir au dernier point de passage';
  menuButtons.stats.hidden = kind !== 'pause' || !stats.unlocked;
  showMenuView('main');
  document.getElementById('pause-button').hidden = kind === 'title';
  syncMusic();
  menuPanel.hidden = false;
  (kind === 'title' ? (save ? menuButtons.continue : menuButtons.new) : menuButtons.resume).focus();
  updateAttackButton();
}

function closeMenu() {
  menu.open = false;
  menu.confirm = null;
  menuPanel.hidden = true;
  document.getElementById('pause-button').hidden = false;
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
menuButtons.free.addEventListener('click', () => { closeMenu(); skipOpening(); startFreeMode(); });
menuButtons.restart.addEventListener('click', menuContinue);
const musicSlider = document.getElementById('menu-music-volume'), effectsSlider = document.getElementById('menu-effects-volume');
musicSlider.addEventListener('input', () => setMusicVolume(Number(musicSlider.value) / 100));
effectsSlider.addEventListener('input', () => { setEffectsVolume(Number(effectsSlider.value) / 100); playSfx('hit'); });
menuButtons.settings.addEventListener('click', () => { showMenuView('settings'); menuButtons.music.focus(); });
menuButtons.back.addEventListener('click', () => { showMenuView('main'); menuButtons.settings.focus(); });
menuButtons.music.addEventListener('click', () => { setMusic(!audio.musicOn); menuButtons.music.textContent = musicLabel(); });
menuButtons.effects.addEventListener('click', () => { setEffects(!audio.effectsOn); menuButtons.effects.textContent = effectsLabel(); playSfx('slash'); });
menuButtons.stats.addEventListener('click', () => { menuPanel.hidden = true; openStats(() => { menuPanel.hidden = false; menuButtons.stats.focus(); }); });
const pauseButton = document.getElementById('pause-button');
pauseButton.addEventListener('click', () => { if (!menu.open && !combatOver) openMenu('pause'); else if (menu.open && menu.kind === 'pause') closeMenu(); });
window.addEventListener('keydown', event => {
  if (event.defaultPrevented) return;
  if (event.code === 'Escape' && !event.repeat && !combatOver && !(menu.open && menu.kind === 'title')) {
    event.preventDefault();
    if (menu.open && menu.view === 'settings') { showMenuView('main'); menuButtons.settings.focus(); } else if (menu.open) closeMenu(); else if (!story.active) openMenu('pause');
  }
});

// Vignette animée de l'écran titre : Yarden fauche un gobelin, en boucle. Dessinée dans son propre petit canevas.
function drawMenuVignette() {
  if (!menu.open || menu.kind !== 'title' || menu.view !== 'main') return;
  const target = document.getElementById('menu-vignette');
  if (!target || !target.getContext) return;
  const pen = target.getContext('2d'), t = (mirrorNow() % 4.6);
  pen.clearRect(0, 0, target.width, target.height);
  const ground = 150, yardenX = 112, scale = yardenCell.scale * 1.55;
  pen.fillStyle = '#00000055';
  pen.beginPath(); pen.ellipse(yardenX, ground - 2, 26, 7, 0, 0, Math.PI * 2); pen.fill();
  // Yarden : repos, puis les six images du coup de faux.
  const swing = yardenArt.strips['scythe-right'], clip = yardenClips['scythe-right'];
  if (swing) {
    const frame = t < 2.0 ? 0 : t < 2.6 ? Math.min(5, Math.floor((t - 2.0) / .6 * 6)) : 0;
    pen.drawImage(swing, frame * clip.cell[0], 0, clip.cell[0], clip.cell[1], yardenX - clip.anchor[0] * scale, ground - clip.anchor[1] * scale, clip.cell[0] * scale, clip.cell[1] * scale);
  }
  // Le gobelin arrive de la droite, prend le coup (flash puis disparition), puis un autre revient.
  const strip = monsterArt.strips.goblin, gob = monsterClips.goblin, gs = yardenCell.scale * 1.55;
  if (strip && t < 3.6) {
    const x = t < 1.9 ? 400 - (t / 1.9) * 170 : 230;
    const hit = t > 2.35;
    pen.save();
    pen.globalAlpha = hit ? Math.max(0, 1 - (t - 2.35) / .9) : 1;
    const frame = t < 1.9 ? Math.floor(t / gob.walkSeconds) % 4 : t < 2.3 ? gob.windup : gob.strike;
    const px = x + (hit ? (t - 2.35) * 40 : 0);
    pen.drawImage(strip, frame * gob.cell[0], 0, gob.cell[0], gob.cell[1], px - gob.anchor[0] * gs, ground - gob.anchor[1] * gs, gob.cell[0] * gs, gob.cell[1] * gs);
    pen.restore();
  }
}

const textSpeedSelect = document.getElementById('text-speed');
if (textSpeedSelect) {
  textSpeedSelect.value = textSpeed;
  textSpeedSelect.addEventListener('change', () => {
    textSpeed = textSpeedSelect.value;
    try { localStorage.setItem('textSpeed', textSpeed); } catch (error) { /* stockage indisponible */ }
  });
}
