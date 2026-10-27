'use strict';

// Une salle fixe ; la caméra suit Yarden sur les petits écrans.
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');
const player = { x: 0, y: 0, speed: 180, radius: 13 };
const room = { x: -480, y: -336, width: 960, height: 672 };
const wallThickness = 24;
const walls = [
  { x: room.x - wallThickness, y: room.y - wallThickness, width: room.width + wallThickness * 2, height: wallThickness },
  { x: room.x - wallThickness, y: room.y + room.height, width: room.width + wallThickness * 2, height: wallThickness },
  { x: room.x - wallThickness, y: room.y, width: wallThickness, height: room.height },
  { x: room.x + room.width, y: room.y, width: wallThickness, height: room.height },
  // Deux blocs neutres pour tester les collisions à l’intérieur de la salle.
  { x: -192, y: -96, width: 72, height: 144 },
  { x: 120, y: 48, width: 96, height: 72 }
];
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

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function moveAxis(axis, distance) {
  if (distance === 0) return;
  const other = axis === 'x' ? 'y' : 'x';
  const size = axis === 'x' ? 'width' : 'height';
  const otherSize = axis === 'x' ? 'height' : 'width';
  let target = player[axis] + distance;
  for (const wall of walls) {
    const gap = player[other] - clamp(player[other], wall[other], wall[other] + wall[otherSize]);
    if (Math.abs(gap) >= player.radius) continue;
    // La distance au coin tient compte du disque visible de Yarden.
    const reach = Math.sqrt(player.radius ** 2 - gap ** 2);
    const min = wall[axis] - reach;
    const max = wall[axis] + wall[size] + reach;
    if (target > min && target < max) {
      target = distance > 0 ? min : max;
    }
  }
  player[axis] = target;
}

function movePlayer(dx, dy) {
  // Petits pas pour ne pas traverser un mur, même lors d’une image lente.
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / (player.radius / 2)));
  for (let step = 0; step < steps; step++) {
    moveAxis('x', dx / steps);
    moveAxis('y', dy / steps);
  }
}

function update(seconds) {
  let x = input.x;
  let y = input.y;
  if (input.pointerId === null) {
    x = Number(keys.has('arrowright') || keys.has('d')) - Number(keys.has('arrowleft') || keys.has('q') || keys.has('a'));
    y = Number(keys.has('arrowdown') || keys.has('s')) - Number(keys.has('arrowup') || keys.has('z') || keys.has('w'));
  }
  const length = Math.hypot(x, y);
  if (length > 1) { x /= length; y /= length; }
  movePlayer(x * player.speed * seconds, y * player.speed * seconds);
  if (length > 0) facing = { x: x / Math.hypot(x, y), y: y / Math.hypot(x, y) };
}

function draw() {
  ctx.fillStyle = '#0e0f19';
  ctx.fillRect(0, 0, width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  // La caméra laisse d’abord bouger Yarden, puis accompagne son déplacement.
  const screenX = Math.max(width * .3, Math.min(width * .7, centerX + player.x));
  const screenY = Math.max(height * .3, Math.min(height * .7, centerY + player.y));
  const offsetX = screenX - player.x;
  const offsetY = screenY - player.y;
  ctx.save();
  ctx.beginPath();
  ctx.rect(room.x + offsetX, room.y + offsetY, room.width, room.height);
  ctx.clip();
  ctx.fillStyle = '#1a1c2c';
  ctx.fillRect(room.x + offsetX, room.y + offsetY, room.width, room.height);
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
  ctx.restore();
  for (const wall of walls) {
    ctx.fillStyle = '#454158';
    ctx.fillRect(wall.x + offsetX, wall.y + offsetY, wall.width, wall.height);
    ctx.strokeStyle = '#746986';
    ctx.strokeRect(wall.x + offsetX + .5, wall.y + offsetY + .5, wall.width - 1, wall.height - 1);
  }
  ctx.fillStyle = '#b5afca';
  ctx.font = '12px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('ABYSSE · SALLE 1', 14, 24);
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
