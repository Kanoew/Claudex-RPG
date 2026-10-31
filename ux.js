'use strict';

// Présentation uniquement : fenêtres, commandes selon le support et lecture hors du terrain.
const uxApp = document.getElementById('app');
const uxPrefs = { input: 'auto', textSize: 18 };
try {
  const saved = JSON.parse(localStorage.getItem('yarden-interface') || '{}');
  if (['auto', 'touch', 'keyboard'].includes(saved.input)) uxPrefs.input = saved.input;
  if (Number.isFinite(saved.textSize)) uxPrefs.textSize = Math.max(16, Math.min(24, saved.textSize));
} catch (error) { /* Les réglages restent utilisables sans stockage. */ }
let uxAutomaticInput = window.matchMedia('(pointer: coarse)').matches ? 'touch' : 'keyboard';
let uxModal = null;
const uxPanels = ['menu-panel', 'stats-panel', 'bag-panel', 'map-panel', 'history-panel', 'result'].map(id => document.getElementById(id));
const uxStory = document.getElementById('story-panel');

function uxTouchMode() { return (uxPrefs.input === 'auto' ? uxAutomaticInput : uxPrefs.input) === 'touch'; }

// Le cadrage du poignet reste centré sur les deux protagonistes, même après une rotation
// ou l'apparition du dialogue qui réduit la hauteur du terrain.
function uxSceneOffsets() {
  const actor = sceneActors.compact;
  if (currentZone.id !== 'exterieur' || !scene.active || !actor || (actor.mode !== 'stumble' && actor.variant !== 'recul')) return null;
  return { x: width / 2 - (player.x + actor.x) / 2, y: height * .6 - (player.y + actor.y) / 2 };
}

function uxSavePreferences() {
  try { localStorage.setItem('yarden-interface', JSON.stringify(uxPrefs)); } catch (error) { /* Stockage facultatif. */ }
}

// Sortir les fenêtres et le dialogue du conteneur Canvas empêche leur découpage par son overflow.
for (const panel of uxPanels) {
  uxApp.append(panel);
  panel.classList.add('ux-window');
  if (panel.id === 'result') {
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'result-text');
    continue;
  }
  const heading = document.createElement('div');
  heading.className = 'window-heading';
  heading.append(panel.querySelector('h2'));
  const body = document.createElement('div');
  body.className = 'window-body';
  const close = panel.id === 'menu-panel' ? document.createElement('button') : panel.querySelector('button[id$="-close"]');
  if (panel.id === 'menu-panel') {
    close.id = 'ux-menu-close'; close.type = 'button'; close.textContent = 'Retour';
    close.addEventListener('click', () => {
      if (menu.view === 'settings') { showMenuView('main'); menuButtons.settings.focus(); }
      else if (menu.kind === 'pause') closeMenu();
    });
  }
  heading.append(close);
  for (const child of [...panel.children]) body.append(child);
  panel.append(heading, body);
}
uxApp.append(uxStory);
const uxStoryActions = document.createElement('div');
uxStoryActions.className = 'story-actions';
uxStoryActions.append(document.getElementById('story-next'));
const uxStoryPause = document.createElement('button');
uxStoryPause.id = 'story-pause'; uxStoryPause.type = 'button'; uxStoryPause.textContent = 'Pause';
uxStoryPause.addEventListener('click', () => openMenu('pause'));
uxStoryActions.append(uxStoryPause);
uxStoryActions.append(document.getElementById('story-history'));
uxStory.append(uxStoryActions);

// La zone de lecture reste au-dessus du terrain durant toute la scène de la ruelle,
// y compris ses animations sans texte. Sa position suit la hauteur réelle de l'en-tête.
function uxMeasureHeader() {
  const top = Math.round(uxApp.querySelector('header').getBoundingClientRect().bottom - uxApp.getBoundingClientRect().top + 8);
  const value = `${top}px`;
  if (uxApp.style.getPropertyValue('--story-top') !== value) uxApp.style.setProperty('--story-top', value);
}
new ResizeObserver(uxMeasureHeader).observe(uxApp.querySelector('header'));
uxMeasureHeader();

const uxInputSelect = document.getElementById('ux-input');
const uxTextSlider = document.getElementById('ux-text-size');
uxInputSelect.value = uxPrefs.input;
uxTextSlider.value = uxPrefs.textSize;
function uxApplyPreferences() {
  uxApp.style.setProperty('--reading-size', `${uxPrefs.textSize}px`);
  document.getElementById('ux-text-value').value = `${uxPrefs.textSize} px`;
  updateUxLayout();
  updateButtonHints();
}
uxInputSelect.addEventListener('change', () => {
  resetInput(); uxPrefs.input = uxInputSelect.value; uxSavePreferences(); uxApplyPreferences();
});
uxTextSlider.addEventListener('input', () => {
  uxPrefs.textSize = Number(uxTextSlider.value); uxSavePreferences(); uxApplyPreferences();
});

function uxSetData(name, value) {
  if (uxApp.dataset[name] !== value) uxApp.dataset[name] = value;
}

function uxVisiblePanel() {
  return [...uxPanels].reverse().find(panel => !panel.hidden) || (!uxStory.hidden ? uxStory : null);
}

function uxFocusable(panel) {
  return [...panel.querySelectorAll('button, input, select, [tabindex="0"]')].filter(el => !el.disabled && !el.closest('[hidden]') && el.getClientRects().length);
}

function updateUxLayout() {
  uxSetData('input', uxTouchMode() ? 'touch' : 'keyboard');
  const context = story.active ? 'dialogue' : scene.active && !scene.free ? 'cinematic' : ['donjon', 'antre', 'run', 'faille'].includes(currentZone.id) ? 'combat' : 'exploration';
  uxSetData('context', context);
  uxSetData('storyPlace', currentZone.id === 'exterieur' && !scene.metro && !scene.mirror ? 'top' : 'bottom');
  uxApp.classList.toggle('has-interaction', !document.getElementById('interact').hidden);
  const interact = document.getElementById('interact');
  const interactLabel = currentZone.id === 'antre' ? 'Cristal' : 'Examiner';
  const interactText = `${interactLabel}${uxTouchMode() ? '' : ' · F'}`;
  if (interact.textContent !== interactText) interact.textContent = interactText;
  interact.setAttribute('aria-label', `${interactLabel}${uxTouchMode() ? '' : ', touche F'}`);
  const close = document.getElementById('ux-menu-close');
  const hideClose = menu.kind === 'title' && menu.view === 'main';
  if (close.hidden !== hideClose) close.hidden = hideClose;
  const selected = uxVisiblePanel();
  if (selected && selected !== uxStory) uxSetData('window', selected.id);
  else if ('window' in uxApp.dataset) delete uxApp.dataset.window;
  for (const child of uxApp.children) {
    const inert = !!selected && child !== selected;
    if (child.inert !== inert) child.inert = inert;
  }
  if (selected !== uxModal) {
    const old = uxModal; uxModal = selected;
    if (selected && !selected.contains(document.activeElement)) {
      const target = selected.id === 'menu-panel' && old && old.id === 'stats-panel' ? menuButtons.stats : uxFocusable(selected)[0];
      if (target) target.focus();
    } else if (!selected && old) {
      const trigger = { 'bag-panel': 'bag-button', 'map-panel': 'map-button', 'menu-panel': 'pause-button' }[old.id];
      const target = trigger && document.getElementById(trigger);
      if (target && !target.hidden) target.focus();
    }
  }
  for (const [button, cooldown, recovery] of [[attackButton, attack.cooldown, attack.recovery], [skillButton, skill.cooldown, skill.recovery], [dodgeButton, dodge.cooldown, dodge.recovery]]) {
    const value = String(Math.round(Math.max(0, Math.min(1, cooldown / recovery)) * 100) / 100);
    if (button.style.getPropertyValue('--recovery') !== value) button.style.setProperty('--recovery', value);
  }
}

// Les fenêtres interceptent le clavier avant les commandes de jeu.
function uxHandlesKeyboard(event) {
  const panel = uxVisiblePanel();
  if (!panel) return false;
  if (panel !== uxStory) return true;
  return event.target.closest && !!event.target.closest('button, input, select') && event.target.id !== 'story-next';
}
document.addEventListener('keydown', event => {
  const panel = uxVisiblePanel();
  if (!panel) return;
  if (event.key === 'Tab') {
    const focusable = uxFocusable(panel), first = focusable[0], last = focusable.at(-1);
    if (!first) return;
    if (!panel.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault(); (event.shiftKey ? last : first).focus();
    }
    event.stopPropagation();
  } else if (event.code === 'Escape' && !event.repeat) {
    event.preventDefault(); event.stopPropagation();
    if (panel.id === 'bag-panel') closeBag();
    else if (panel.id === 'history-panel') closeDialogueHistory();
    else if (panel.id === 'map-panel') closeMap();
    else if (panel.id === 'stats-panel') closeStats();
    else if (panel === uxStory) openMenu('pause');
    else if (panel.id === 'menu-panel' && menu.view === 'settings') { showMenuView('main'); menuButtons.settings.focus(); }
    else if (panel.id === 'menu-panel' && menu.kind === 'pause') closeMenu();
    updateUxLayout();
  }
}, true);
window.addEventListener('pointerdown', event => {
  if (uxPrefs.input === 'auto' && event.pointerType === 'touch' && uxAutomaticInput !== 'touch') {
    uxAutomaticInput = 'touch'; updateUxLayout(); updateButtonHints();
  }
}, true);
window.addEventListener('keydown', event => {
  if (uxPrefs.input === 'auto' && !uxVisiblePanel() && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyZ', 'KeyQ'].includes(event.code) && uxAutomaticInput !== 'keyboard') {
    uxAutomaticInput = 'keyboard'; releaseStick(); updateUxLayout(); updateButtonHints();
  }
}, true);
new MutationObserver(updateUxLayout).observe(uxApp, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
uxApp.style.setProperty('--reading-size', `${uxPrefs.textSize}px`);
document.getElementById('ux-text-value').value = `${uxPrefs.textSize} px`;
