'use strict';

// Le terrain défile autour de Yarden : aucune salle ni collision à cette étape.
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');
const player = { x: 0, y: 0, speed: 180, radius: 13 };
const input = { x: 0, y: 0, pointerId: null };
const keys = new Set();
const movementKeys = new Set(['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'z', 'q', 's', 'd', 'w', 'a']);
let width = 0;
let height = 0;
let lastTime = null;
let facing = { x: 0, y: -1 };

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
  if (input.pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
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
  const key = event.key.toLowerCase();
  if (!movementKeys.has(key)) return;
  event.preventDefault();
  keys.add(key);
});
window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
function resetInput() {
  keys.clear();
  releaseStick();
  lastTime = null;
}
window.addEventListener('blur', resetInput);
document.addEventListener('visibilitychange', resetInput);
window.addEventListener('resize', resetInput);

function update(seconds) {
  let x = input.x;
  let y = input.y;
  if (input.pointerId === null) {
    x = Number(keys.has('arrowright') || keys.has('d')) - Number(keys.has('arrowleft') || keys.has('q') || keys.has('a'));
    y = Number(keys.has('arrowdown') || keys.has('s')) - Number(keys.has('arrowup') || keys.has('z') || keys.has('w'));
  }
  const length = Math.hypot(x, y);
  if (length > 1) { x /= length; y /= length; }
  player.x += x * player.speed * seconds;
  player.y += y * player.speed * seconds;
  if (length > 0) facing = { x: x / Math.hypot(x, y), y: y / Math.hypot(x, y) };
}

function draw() {
  ctx.fillStyle = '#1a1c2c';
  ctx.fillRect(0, 0, width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  // La caméra laisse d’abord bouger Yarden, puis accompagne son déplacement.
  const screenX = Math.max(width * .3, Math.min(width * .7, centerX + player.x));
  const screenY = Math.max(height * .3, Math.min(height * .7, centerY + player.y));
  const offsetX = screenX - player.x;
  const offsetY = screenY - player.y;
  const spacing = 48;
  ctx.strokeStyle = '#292b40';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = ((offsetX % spacing) + spacing) % spacing; x < width; x += spacing) {
    ctx.moveTo(x, 0); ctx.lineTo(x, height);
  }
  for (let y = ((offsetY % spacing) + spacing) % spacing; y < height; y += spacing) {
    ctx.moveTo(0, y); ctx.lineTo(width, y);
  }
  ctx.stroke();
  ctx.fillStyle = '#b5afca';
  ctx.font = '12px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('ABYSSE · DÉPLACEMENT', 14, 24);
  ctx.fillStyle = '#c5afff';
  ctx.beginPath();
  ctx.arc(screenX, screenY, player.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(screenX + facing.x * 7, screenY + facing.y * 7, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#eae7f5';
  ctx.textAlign = 'center';
  ctx.fillText('Yarden', screenX, screenY - 23);
}

function frame(time) {
  const seconds = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, .05);
  lastTime = time;
  update(seconds);
  draw();
  requestAnimationFrame(frame);
}
resize();
requestAnimationFrame(frame);
