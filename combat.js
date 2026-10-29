'use strict';

// Coups de faux, fauchage, esquive et boutons d'action.

function startAttack(empowered = false) {
  const cost = empowered ? skill.cost : 3;
  if (!player.armed || paused || combatOver || encounterBlocksMovement() || bossDelay > 0 || dodge.remaining > 0 || attack.cooldown > 0 || document.hidden || player.mana < cost || (empowered && skill.cooldown > 0)) return;
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
  const blocked = paused || combatOver || encounterBlocksMovement();
  const recovering = blocked || !player.armed || bossDelay > 0 || dodge.remaining > 0 || attack.cooldown > 0 || player.mana < 3;
  attackButton.classList.toggle('recovering', recovering);
  attackButton.setAttribute('aria-disabled', String(recovering));
  const unavailable = blocked || !player.armed || bossDelay > 0 || dodge.remaining > 0 || attack.cooldown > 0 || skill.cooldown > 0 || player.mana < skill.cost;
  skillButton.classList.toggle('recovering', unavailable);
  skillButton.setAttribute('aria-disabled', String(unavailable));
  dodgeButton.classList.toggle('recovering', blocked || bossDelay > 0 || dodge.cooldown > 0);
  dodgeButton.setAttribute('aria-disabled', String(blocked || bossDelay > 0 || dodge.cooldown > 0));
  const interact = document.getElementById('interact');
  interact.hidden = currentZone.id !== 'antre';
  interact.classList.toggle('recovering', !canUseCrystal());
  interact.setAttribute('aria-disabled', String(!canUseCrystal()));
  updateButtonHints();
}

function startDodge() {
  if (paused || combatOver || encounterBlocksMovement() || bossDelay > 0 || document.hidden || dodge.cooldown > 0) return;
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

// Quand un combat est fini, Yarden récupère toute sa vie et tout son mana avant la suite.
function restoreAfterCombat() {
  player.hp = player.maxHp;
  player.mana = player.maxMana;
  player.flash = 0;
  updateStatus();
}
