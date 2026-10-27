'use strict';

// Une salle fixe ; la caméra suit Yarden sur les petits écrans.
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');
const attackButton = document.getElementById('attack');
const skillButton = document.getElementById('skill');
const dodgeButton = document.getElementById('dodge');
const dodge = { remaining: 0, cooldown: 0, duration: .2, recovery: 1.1, speed: 500, x: 0, y: -1 };
const skill = { cost: 12, cooldown: 0, recovery: 2.5 };
const status = document.getElementById('status');
const result = document.getElementById('result');
const resultText = document.getElementById('result-text');
const resultDetails = document.getElementById('result-details');
const retryButton = document.getElementById('retry');
const player = { x: 0, y: 240, speed: 180, radius: 13, hp: 5, maxHp: 5, flash: 0, mana: 30, maxMana: 30, armed: false };
const weapon = { x: 0, y: 144 };
let exitOpen = false;
const enemies = [
  { name: 'Rôdeur', x: 0, y: -200, spawnX: 0, spawnY: -200, speed: 95, radius: 14, hp: 3, maxHp: 3, charger: false },
  { name: 'Chargeur', x: 220, y: -160, spawnX: 220, spawnY: -160, speed: 80, radius: 14, hp: 2, maxHp: 2, charger: true },
  { name: 'Gardien', spawnX: 0, spawnY: -220, speed: 65, radius: 24, maxHp: 8, boss: true, active: false }
];
const boss = enemies[2];
for (const enemy of enemies) resetEnemy(enemy);
let combatOver = false;
let paused = false;
let elapsed = 0;
let stage = 'entry';
let bossDelay = 0;
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
const attack = { remaining: 0, cooldown: 0, duration: .22, recovery: .45, range: 72, halfAngle: Math.PI / 3, angle: 0, hits: new Set() };

function startAttack(empowered = false) {
  const cost = empowered ? skill.cost : 3;
  if (!player.armed || paused || combatOver || bossDelay > 0 || dodge.remaining > 0 || attack.cooldown > 0 || document.hidden || player.mana < cost || (empowered && skill.cooldown > 0)) return;
  player.mana -= cost;
  if (empowered) skill.cooldown = skill.recovery;
  Object.assign(attack, { empowered, damage: empowered ? 2 : 1, duration: empowered ? .3 : .22, recovery: empowered ? .8 : .45, range: empowered ? 110 : 72 });
  attack.angle = Math.atan2(facing.y, facing.x);
  attack.remaining = attack.duration;
  attack.cooldown = attack.recovery;
  attack.hits.clear();
  updateAttackButton();
  updateStatus();
}

function updateAttackButton() {
  const recovering = !player.armed || combatOver || bossDelay > 0 || dodge.remaining > 0 || attack.cooldown > 0 || player.mana < 3;
  attackButton.classList.toggle('recovering', recovering);
  attackButton.setAttribute('aria-disabled', String(recovering));
  const unavailable = !player.armed || combatOver || bossDelay > 0 || dodge.remaining > 0 || attack.cooldown > 0 || skill.cooldown > 0 || player.mana < skill.cost;
  skillButton.classList.toggle('recovering', unavailable);
  skillButton.setAttribute('aria-disabled', String(unavailable));
  dodgeButton.classList.toggle('recovering', combatOver || bossDelay > 0 || dodge.cooldown > 0);
  dodgeButton.setAttribute('aria-disabled', String(combatOver || bossDelay > 0 || dodge.cooldown > 0));
}

function startDodge() {
  if (paused || combatOver || bossDelay > 0 || document.hidden || dodge.cooldown > 0) return;
  let x = input.pointerId === null ? Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('q') || keys.has('a') || keys.has('arrowleft')) : input.x;
  let y = input.pointerId === null ? Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('z') || keys.has('w') || keys.has('arrowup')) : input.y;
  const length = Math.hypot(x, y);
  if (length > 0) { x /= length; y /= length; } else { x = facing.x; y = facing.y; }
  Object.assign(dodge, { x, y, remaining: dodge.duration, cooldown: dodge.recovery });
  attack.remaining = 0;
  updateAttackButton();
}

dodgeButton.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  event.preventDefault();
  startDodge();
});
dodgeButton.addEventListener('click', event => { if (event.detail === 0) startDodge(); });

// Secteur de 120 degrés : portée de 72 pixels, ou 110 pour Fauchage.
// Chaque coup touche au plus une fois chacune des cibles.
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
function resetInput() {
  keys.clear();
  releaseStick();
  lastTime = null;
  attack.remaining = 0;
  dodge.remaining = 0;
}
window.addEventListener('blur', () => { paused = true; resetInput(); updateStatus(); });
window.addEventListener('focus', () => { paused = false; lastTime = null; updateStatus(); });
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

function updateStatus() {
  const text = `Yarden : ${player.hp}/${player.maxHp} PV · Mana : ${Math.floor(player.mana)}/${player.maxMana} · ${enemies.filter(enemy => enemy.boss ? enemy.active : stage === 'entry' || stage === 'guards').map(enemy => `${enemy.name} : ${enemy.hp}/${enemy.maxHp}`).join(' · ')}`;
  if (status.textContent !== text) status.textContent = text;
  const objective = document.getElementById('objective');
  const goal = paused && !combatOver ? 'Pause — reviens sur le jeu pour continuer.' : !player.armed ? 'Avance vers la faux violette pour la manifester.' : bossDelay > 0 ? 'Le Gardien apparaît…' : stage === 'guards' ? 'Vaincre le rôdeur et le chargeur.' : stage === 'boss' ? 'Vaincre le Gardien. Évite le cercle orange !' : stage === 'exit' ? 'Sortie ouverte ! Rejoins la porte verte au nord ↑.' : 'Yarden a quitté l’Abysse.';
  if (objective.textContent !== goal) objective.textContent = goal;
}

function awakenBoss() {
  stage = 'boss';
  boss.active = true;
  const spawns = [{ x: 0, y: -220 }, { x: 0, y: 200 }, { x: 320, y: -200 }, { x: -320, y: 200 }];
  const spawn = spawns.find(point => Math.hypot(point.x - player.x, point.y - player.y) > 160);
  Object.assign(boss, spawn);
  bossDelay = 1.2;
  resetInput();
  updateStatus();
  updateAttackButton();
}

function finishCombat(message) {
  combatOver = true;
  resetInput();
  for (const enemy of enemies) { enemy.windup = 0; enemy.charge = 0; }
  resultText.textContent = message;
  resultDetails.textContent = `Temps de jeu : ${Math.floor(elapsed)} s · PV restants : ${player.hp}/${player.maxHp}`;
  result.hidden = false;
  updateAttackButton();
}

retryButton.addEventListener('click', () => {
  resetInput();
  Object.assign(player, { x: 0, y: 240, hp: player.maxHp, flash: 0, mana: player.maxMana, armed: false });
  for (const enemy of enemies) resetEnemy(enemy);
  stage = 'entry';
  exitOpen = false;
  bossDelay = 0;
  Object.assign(attack, { cooldown: 0, remaining: 0 });
  attack.hits.clear();
  skill.cooldown = 0;
  Object.assign(dodge, { remaining: 0, cooldown: 0 });
  facing = { x: 0, y: -1 };
  combatOver = false;
  paused = false;
  elapsed = 0;
  result.hidden = true;
  retryButton.blur();
  updateStatus();
  updateAttackButton();
});

function update(seconds) {
  if (combatOver || paused || document.hidden) return;
  elapsed += seconds;
  if (bossDelay > 0) {
    bossDelay = Math.max(0, bossDelay - seconds);
    updateStatus();
    updateAttackButton();
    return;
  }
  dodge.cooldown = Math.max(0, dodge.cooldown - seconds);
  player.mana = Math.min(player.maxMana, Math.round((player.mana + 3 * seconds) * 1e6) / 1e6);
  skill.cooldown = Math.max(0, skill.cooldown - seconds);
  updateStatus();
  player.flash = Math.max(0, player.flash - seconds);
  for (const enemy of enemies) enemy.flash = Math.max(0, enemy.flash - seconds);
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
  if (dodge.remaining > 0) {
    const time = Math.min(seconds, dodge.remaining);
    movePlayer(dodge.x * dodge.speed * time, dodge.y * dodge.speed * time);
    facing = { x: dodge.x, y: dodge.y };
  } else {
    movePlayer(x * player.speed * seconds, y * player.speed * seconds);
    if (length > 0) facing = { x: x / Math.hypot(x, y), y: y / Math.hypot(x, y) };
  }
  if (updateDungeon()) {
    dodge.remaining = Math.max(0, dodge.remaining - seconds);
    return;
  }
  for (const enemy of enemies) {
    if ((enemy.boss && !enemy.active) || enemy.hp <= 0 || attack.hits.has(enemy) || !attackHitsCircle(enemy) || !clearPath(player, enemy)) continue;
    attack.hits.add(enemy);
    enemy.hp = Math.max(0, enemy.hp - attack.damage);
    enemy.flash = .2;
    updateStatus();
  }
  if (stage === 'guards' && enemies.filter(enemy => !enemy.boss).every(enemy => enemy.hp === 0)) { awakenBoss(); return; }
  if (stage === 'boss' && boss.hp === 0) {
    stage = 'exit';
    exitOpen = true;
    resetInput();
    updateStatus();
    updateAttackButton();
    return;
  }
  for (const enemy of enemies) {
    if (combatOver) break;
    updateEnemy(enemy, seconds);
  }
  dodge.remaining = Math.max(0, dodge.remaining - seconds);
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
  drawDungeon(offsetX, offsetY);
  ctx.fillStyle = '#b5afca';
  ctx.font = '12px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('ABYSSE · SALLE 1', 14, 24);
  for (const enemy of enemies) drawEnemy(enemy, offsetX, offsetY);
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
  ctx.fillStyle = dodge.remaining > 0 ? '#8affc1' : player.flash > 0 ? '#fff' : '#c5afff';
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
updateAttackButton();
requestAnimationFrame(frame);
