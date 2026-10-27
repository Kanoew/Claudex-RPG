'use strict';

// Une salle fixe ; la caméra suit Yarden sur les petits écrans.
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');
const attackButton = document.getElementById('attack');
const skillButton = document.getElementById('skill');
const skill = { cost: 12, cooldown: 0, recovery: 2.5 };
const status = document.getElementById('status');
const result = document.getElementById('result');
const resultText = document.getElementById('result-text');
const retryButton = document.getElementById('retry');
const player = { x: 0, y: 0, speed: 180, radius: 13, hp: 5, maxHp: 5, flash: 0, mana: 30, maxMana: 30 };
const enemy = { x: 0, y: -200, speed: 95, radius: 14, hp: 3, maxHp: 3, flash: 0, cooldown: 0, windup: 0, routeTimer: 0, waypoint: null };
let combatOver = false;
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
const attack = { remaining: 0, cooldown: 0, duration: .22, recovery: .45, range: 72, halfAngle: Math.PI / 3, angle: 0, hit: false };

function startAttack(empowered = false) {
  const cost = empowered ? skill.cost : 3;
  if (combatOver || attack.cooldown > 0 || document.hidden || player.mana < cost || (empowered && skill.cooldown > 0)) return;
  player.mana -= cost;
  if (empowered) skill.cooldown = skill.recovery;
  Object.assign(attack, { empowered, damage: empowered ? 2 : 1, duration: empowered ? .3 : .22, recovery: empowered ? .8 : .45, range: empowered ? 110 : 72 });
  attack.angle = Math.atan2(facing.y, facing.x);
  attack.remaining = attack.duration;
  attack.cooldown = attack.recovery;
  attack.hit = false;
  updateAttackButton();
  updateStatus();
}

function updateAttackButton() {
  const recovering = combatOver || attack.cooldown > 0 || player.mana < 3;
  attackButton.classList.toggle('recovering', recovering);
  attackButton.setAttribute('aria-disabled', String(recovering));
  const unavailable = combatOver || attack.cooldown > 0 || skill.cooldown > 0 || player.mana < skill.cost;
  skillButton.classList.toggle('recovering', unavailable);
  skillButton.setAttribute('aria-disabled', String(unavailable));
}

// Secteur de 120 degrés : portée de 72 pixels, ou 110 pour Fauchage.
// Chaque coup ne peut infliger qu’une seule blessure à l’ennemi.
function attackHitsCircle(target) {
  if (attack.remaining <= 0) return false;
  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const distance = Math.hypot(dx, dy);
  if (distance > attack.range + target.radius) return false;
  const angle = Math.atan2(dy, dx) - attack.angle;
  const relative = Math.atan2(Math.sin(angle), Math.cos(angle));
  if (Math.abs(relative) <= attack.halfAngle) return true;
  // Une cible peut aussi toucher les bords du secteur avec son rayon.
  for (const side of [-1, 1]) {
    const edge = attack.angle + side * attack.halfAngle;
    const along = Math.max(0, Math.min(attack.range, dx * Math.cos(edge) + dy * Math.sin(edge)));
    if (Math.hypot(dx - along * Math.cos(edge), dy - along * Math.sin(edge)) <= target.radius) return true;
  }
  return false;
}

for (const [button, empowered] of [[attackButton, false], [skillButton, true]]) {
  button.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    startAttack(empowered);
  });
  // Clic clavier ou lecteur d’écran, sans doubler le déclenchement tactile.
  button.addEventListener('click', event => {
    if (event.detail === 0) startAttack(empowered);
  });
}

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
  if (event.code === 'KeyE') {
    event.preventDefault();
    if (!event.repeat) startAttack(true);
    return;
  }
  if (event.code === 'Space' && event.target !== attackButton && event.target !== skillButton && event.target !== retryButton) {
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
function resetInput() {
  keys.clear();
  releaseStick();
  lastTime = null;
  attack.remaining = 0;
}
window.addEventListener('blur', resetInput);
document.addEventListener('visibilitychange', resetInput);
window.addEventListener('resize', resetInput);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function moveAxis(axis, distance, body = player) {
  if (distance === 0) return;
  const other = axis === 'x' ? 'y' : 'x';
  const size = axis === 'x' ? 'width' : 'height';
  const otherSize = axis === 'x' ? 'height' : 'width';
  let target = body[axis] + distance;
  for (const wall of walls) {
    const gap = body[other] - clamp(body[other], wall[other], wall[other] + wall[otherSize]);
    if (Math.abs(gap) >= body.radius) continue;
    // La distance au coin tient compte du disque visible de Yarden.
    const reach = Math.sqrt(body.radius ** 2 - gap ** 2);
    const min = wall[axis] - reach;
    const max = wall[axis] + wall[size] + reach;
    if (target > min && target < max) {
      target = distance > 0 ? min : max;
    }
  }
  body[axis] = target;
}

function movePlayer(dx, dy, body = player) {
  // Petits pas pour ne pas traverser un mur, même lors d’une image lente.
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / (body.radius / 2)));
  for (let step = 0; step < steps; step++) {
    moveAxis('x', dx / steps, body);
    moveAxis('y', dy / steps, body);
  }
}

// Intersection segment/rectangle : sert au contournement et bloque les coups à travers les murs.
function clearPath(from, to, padding = 0) {
  return walls.every(wall => {
    let enter = 0, exit = 1;
    for (const [axis, size] of [['x', 'width'], ['y', 'height']]) {
      const delta = to[axis] - from[axis];
      const min = wall[axis] - padding, max = wall[axis] + wall[size] + padding;
      if (Math.abs(delta) < 1e-9) {
        if (from[axis] < min || from[axis] > max) return true;
      } else {
        const a = (min - from[axis]) / delta, b = (max - from[axis]) / delta;
        enter = Math.max(enter, Math.min(a, b));
        exit = Math.min(exit, Math.max(a, b));
        if (enter > exit) return true;
      }
    }
    return false;
  });
}

function nextWaypoint() {
  // Dix points seulement : ennemi, Yarden et coins des deux blocs.
  const padding = enemy.radius + 2;
  const goal = { x: clamp(player.x, room.x + padding, room.x + room.width - padding), y: clamp(player.y, room.y + padding, room.y + room.height - padding) };
  // Yarden peut serrer un bloc de plus près que l’ennemi : viser un point accessible à côté.
  for (const wall of walls.slice(4)) {
    const left = wall.x - padding, right = wall.x + wall.width + padding;
    const top = wall.y - padding, bottom = wall.y + wall.height + padding;
    if (goal.x <= left || goal.x >= right || goal.y <= top || goal.y >= bottom) continue;
    const sides = [{ x: left, y: goal.y }, { x: right, y: goal.y }, { x: goal.x, y: top }, { x: goal.x, y: bottom }];
    sides.sort((a, b) => Math.hypot(a.x - goal.x, a.y - goal.y) - Math.hypot(b.x - goal.x, b.y - goal.y));
    Object.assign(goal, sides[0]);
  }
  const nodes = [{ x: enemy.x, y: enemy.y }, goal];
  for (const wall of walls.slice(4)) {
    for (const x of [wall.x - padding, wall.x + wall.width + padding]) {
      for (const y of [wall.y - padding, wall.y + wall.height + padding]) nodes.push({ x, y });
    }
  }
  const costs = nodes.map(() => Infinity), previous = nodes.map(() => -1), visited = new Set();
  costs[0] = 0;
  for (let count = 0; count < nodes.length; count++) {
    let current = -1;
    for (let i = 0; i < nodes.length; i++) {
      if (!visited.has(i) && (current < 0 || costs[i] < costs[current])) current = i;
    }
    if (current < 0 || !Number.isFinite(costs[current])) break;
    if (current === 1) {
      while (previous[current] > 0) current = previous[current];
      return nodes[current];
    }
    visited.add(current);
    for (let i = 1; i < nodes.length; i++) {
      if (visited.has(i) || !clearPath(nodes[current], nodes[i], enemy.radius + .5)) continue;
      const cost = costs[current] + Math.hypot(nodes[i].x - nodes[current].x, nodes[i].y - nodes[current].y);
      if (cost < costs[i]) { costs[i] = cost; previous[i] = current; }
    }
  }
  return null;
}

function updateStatus() {
  const text = `Yarden : ${player.hp}/${player.maxHp} PV · Mana : ${Math.floor(player.mana)}/${player.maxMana} · Ennemi : ${enemy.hp}/${enemy.maxHp} PV`;
  if (status.textContent !== text) status.textContent = text;
}

function finishCombat(message) {
  combatOver = true;
  resetInput();
  enemy.windup = 0;
  resultText.textContent = message;
  result.hidden = false;
  updateAttackButton();
}

retryButton.addEventListener('click', () => {
  resetInput();
  Object.assign(player, { x: 0, y: 0, hp: player.maxHp, flash: 0, mana: player.maxMana });
  Object.assign(enemy, { x: 0, y: -200, hp: enemy.maxHp, flash: 0, cooldown: 0, windup: 0, routeTimer: 0, waypoint: null });
  Object.assign(attack, { cooldown: 0, remaining: 0, hit: false });
  skill.cooldown = 0;
  facing = { x: 0, y: -1 };
  combatOver = false;
  result.hidden = true;
  retryButton.blur();
  updateStatus();
  updateAttackButton();
});

function updateEnemy(seconds) {
  enemy.cooldown = Math.max(0, enemy.cooldown - seconds);
  const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
  const reach = player.radius + enemy.radius + 8;
  if (enemy.windup > 0) {
    enemy.windup = Math.max(0, enemy.windup - seconds);
    if (enemy.windup === 0 && distance <= reach && clearPath(enemy, player)) {
      player.hp = Math.max(0, player.hp - 1);
      player.flash = .2;
      updateStatus();
      if (player.hp === 0) finishCombat('Yarden est tombée. Réessaie !');
    }
    return;
  }
  if (distance <= reach && clearPath(enemy, player)) {
    if (enemy.cooldown === 0) { enemy.windup = .35; enemy.cooldown = .95; }
    return;
  }
  enemy.routeTimer -= seconds;
  if (enemy.routeTimer <= 0 || !enemy.waypoint || Math.hypot(enemy.waypoint.x - enemy.x, enemy.waypoint.y - enemy.y) < 2) {
    enemy.waypoint = nextWaypoint();
    enemy.routeTimer = .25;
  }
  if (!enemy.waypoint) return;
  const dx = enemy.waypoint.x - enemy.x, dy = enemy.waypoint.y - enemy.y;
  const length = Math.hypot(dx, dy);
  if (length > 0) {
    const step = Math.min(length, enemy.speed * seconds);
    movePlayer(dx / length * step, dy / length * step, enemy);
  }
}

function update(seconds) {
  if (combatOver || document.hidden) return;
  player.mana = Math.min(player.maxMana, Math.round((player.mana + 3 * seconds) * 1e6) / 1e6);
  skill.cooldown = Math.max(0, skill.cooldown - seconds);
  updateStatus();
  player.flash = Math.max(0, player.flash - seconds);
  enemy.flash = Math.max(0, enemy.flash - seconds);
  attack.remaining = Math.max(0, attack.remaining - seconds);
  attack.cooldown = Math.max(0, attack.cooldown - seconds);
  updateAttackButton();
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
  if (!attack.hit && attackHitsCircle(enemy) && clearPath(player, enemy)) {
    attack.hit = true;
    enemy.hp = Math.max(0, enemy.hp - attack.damage);
    enemy.flash = .2;
    updateStatus();
    if (enemy.hp === 0) { finishCombat('Ennemi vaincu !'); return; }
  }
  updateEnemy(seconds);
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
  if (enemy.hp > 0) {
    const ex = enemy.x + offsetX, ey = enemy.y + offsetY;
    if (enemy.windup > 0) {
      ctx.strokeStyle = '#ffb86b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ex, ey, enemy.radius + player.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = enemy.flash > 0 ? '#fff' : enemy.windup > 0 ? '#ffb86b' : '#df6c82';
    ctx.beginPath();
    ctx.arc(ex, ey, enemy.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#302633';
    ctx.fillRect(ex - 20, ey - 25, 40, 5);
    ctx.fillStyle = '#df6c82';
    ctx.fillRect(ex - 20, ey - 25, 40 * enemy.hp / enemy.maxHp, 5);
  }
  if (attack.remaining > 0) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(attack.angle);
    ctx.fillStyle = attack.empowered ? '#70ddff44' : '#c5afff44';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, attack.range, -attack.halfAngle, attack.halfAngle);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = attack.empowered ? '#70ddff' : '#c5afff';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Faux provisoire en formes simples, animée à travers la zone du coup.
    const progress = 1 - attack.remaining / attack.duration;
    ctx.rotate(-attack.halfAngle + progress * attack.halfAngle * 2);
    ctx.strokeStyle = '#eae7f5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(58, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(58, -5);
    ctx.quadraticCurveTo(80, 4, 53, 27);
    ctx.lineTo(62, 7);
    ctx.closePath();
    ctx.fillStyle = '#eae7f5';
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = player.flash > 0 ? '#fff' : '#c5afff';
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
updateStatus();
requestAnimationFrame(frame);
