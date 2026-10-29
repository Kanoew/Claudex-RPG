'use strict';

// Taille du canevas, joystick, clavier, pause et remise à zéro des commandes.

function resize() {
  const rect = canvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
new ResizeObserver(resize).observe(canvas);

function moveStick(event) {
  if (encounterBlocksMovement()) return;
  const rect = joystick.getBoundingClientRect();
  const limit = (rect.width - stick.offsetWidth) / 2 - 4;
  const dx = event.clientX - rect.left - rect.width / 2;
  const dy = event.clientY - rect.top - rect.height / 2;
  const distance = Math.hypot(dx, dy);
  const scale = distance > limit ? limit / distance : 1;
  const x = dx * scale;
  const y = dy * scale;
  stick.style.transform = `translate(${x}px, ${y}px)`;
  input.x = distance < 6 ? 0 : x / limit;
  input.y = distance < 6 ? 0 : y / limit;
}

function releaseStick() {
  const pointerId = input.pointerId;
  input.pointerId = null;
  input.x = 0;
  input.y = 0;
  stick.style.transform = '';
  if (pointerId !== null && joystick.hasPointerCapture(pointerId)) {
    joystick.releasePointerCapture(pointerId);
  }
}

joystick.addEventListener('pointerdown', event => {
  if (encounterBlocksMovement() || input.pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
  event.preventDefault();
  input.pointerId = event.pointerId;
  joystick.setPointerCapture(event.pointerId);
  moveStick(event);
});
joystick.addEventListener('pointermove', event => {
  if (event.pointerId === input.pointerId) moveStick(event);
});
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  joystick.addEventListener(name, event => {
    if (event.pointerId === input.pointerId) releaseStick();
  });
}
window.addEventListener('keydown', event => {
  if (menu.open) return;
  if (story.active) {
    if (event.key === 'Tab') { event.preventDefault(); document.getElementById('story-next').focus(); }
    if (['Enter', 'Space'].includes(event.code)) {
      event.preventDefault();
      if (!event.repeat) advanceStory();
    }
    return;
  }
  if (event.code === 'KeyF') {
    event.preventDefault();
    if (!event.repeat) useCrystal();
    return;
  }
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    event.preventDefault();
    if (!event.repeat) startDodge();
    return;
  }
  if (event.code === 'KeyE') {
    event.preventDefault();
    if (!event.repeat) startAttack(true);
    return;
  }
  if (event.code === 'Space' && ![attackButton, skillButton, dodgeButton, retryButton].includes(event.target)) {
    event.preventDefault();
    if (!event.repeat) startAttack();
    return;
  }
  const key = event.key.toLowerCase();
  if (!movementKeys.has(key)) return;
  event.preventDefault();
  keys.add(key);
});
window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
// Mode diagnostic : ouvrir le jeu avec ?debug à la fin du lien affiche l'état interne.
const debugMode = typeof location !== 'undefined' && /[?&]debug\b/.test(location.search);
const debugInfo = { resets: 0, last: '-' };
function resetInput(source) {
  debugInfo.resets++;
  debugInfo.last = (source && source.type) || 'code';
  keys.clear();
  releaseStick();
  lastTime = null;
  attack.remaining = 0;
  dodge.remaining = 0;
}
window.addEventListener('blur', () => { paused = true; resetInput(); updateStatus(); updateAttackButton(); });
window.addEventListener('focus', () => { paused = false; lastTime = null; updateStatus(); updateAttackButton(); });
document.addEventListener('visibilitychange', resetInput);
window.addEventListener('resize', resetInput);
