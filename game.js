'use strict';

// Boucle de jeu : état de la partie, combat à la chaîne, reprise, mise à jour et dessin à chaque image.

function updateStatus() {
  updateHud();
}

function awakenBoss() {
  stage = 'boss';
  boss.active = true;
  const spawns = [{ x: 0, y: -220 }, { x: 0, y: 200 }, { x: 320, y: -200 }, { x: -320, y: 200 }];
  const spawn = spawns.find(point => Math.hypot(point.x - player.x, point.y - player.y) > 160);
  Object.assign(boss, spawn);
  bossDelay = 1.2;
  // On coupe le coup et l'esquive en cours, mais pas le joystick : le pouce est peut-être encore posé.
  attack.remaining = 0;
  dodge.remaining = 0;
  updateStatus();
  updateAttackButton();
}

function finishCombat(message, delay = 0) {
  combatOver = true;
  resultDelay = delay;
  resetInput();
  for (const enemy of allEnemies()) { enemy.windup = 0; enemy.charge = 0; }
  resultText.textContent = message;
  retryButton.textContent = currentZone.id === 'antre' ? 'Reprendre l’antre' : 'Recommencer le donjon';
  resultDetails.textContent = `Temps de jeu : ${Math.floor(elapsed)} s · PV restants : ${player.hp}/${player.maxHp}`;
  result.hidden = delay > 0;
  updateAttackButton();
}

retryButton.addEventListener('click', () => {
  if (currentZone.id === 'antre' && !encounter.complete) { retryAntre(); return; }
  resetInput();
  resetEncounter();
  resetScene();
  loadZone('donjon');
  Object.assign(player, { x: zones.donjon.start.x, y: zones.donjon.start.y, hp: player.maxHp, flash: 0, mana: player.maxMana, armed: false });
  for (const enemy of allEnemies()) resetEnemy(enemy);
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
  resultDelay = 0;
  zoneFade = 0;
  resetYardenSprite();
  retryButton.blur();
  updateStatus();
  updateAttackButton();
});

function update(seconds) {
  if (combatOver && !paused && !document.hidden) {
    // Yarden finit de tomber, puis le message de fin s'affiche.
    tickYardenSprite(seconds);
    player.flash = Math.max(0, player.flash - seconds);
    if (resultDelay > 0) {
      resultDelay = Math.max(0, resultDelay - seconds);
      if (resultDelay === 0) result.hidden = false;
    }
  }
  if (combatOver || paused || document.hidden || story.active) return;
  elapsed += seconds;
  zoneFade = Math.max(0, zoneFade - seconds);
  updateEncounter(seconds);
  updateScene(seconds);
  if (combatOver || encounterBlocksMovement()) { updateStatus(); updateAttackButton(); return; }
  // Pendant l'apparition du Troll, Yarden peut bouger ; seuls les coups et les ennemis attendent.
  const appearing = bossDelay > 0;
  if (appearing) bossDelay = Math.max(0, bossDelay - seconds);
  dodge.cooldown = Math.max(0, dodge.cooldown - seconds);
  player.mana = Math.min(player.maxMana, Math.round((player.mana + 3 * seconds) * 1e6) / 1e6);
  skill.cooldown = Math.max(0, skill.cooldown - seconds);
  updateStatus();
  player.flash = Math.max(0, player.flash - seconds);
  for (const enemy of allEnemies()) enemy.flash = Math.max(0, enemy.flash - seconds);
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
    const speed = player.speed * (currentZone.id === 'antre' && encounter.slow > 0 ? .7 : 1);
    movePlayer(x * speed * seconds, y * speed * seconds);
    if (length > 0) facing = { x: x / Math.hypot(x, y), y: y / Math.hypot(x, y) };
  }
  updateYardenSprite(seconds, dodge.remaining > 0 ? dodge.x : x, dodge.remaining > 0 ? dodge.y : y, dodge.remaining > 0 || length > 0);
  if (updateDungeon()) {
    dodge.remaining = Math.max(0, dodge.remaining - seconds);
    return;
  }
  if (appearing) return;
  for (const enemy of activeEnemies()) {
    if ((enemy.boss && !enemy.active) || enemy.hp <= 0 || attack.hits.has(enemy) || !attackHitsCircle(enemy) || !clearPath(player, enemy)) continue;
    attack.hits.add(enemy);
    if (enemy.ranged) { hitSpider(attack.empowered); continue; }
    enemy.hp = Math.max(0, enemy.hp - attack.damage);
    enemy.flash = .2;
    updateStatus();
  }
  if (stage === 'guards' && enemies.filter(enemy => !enemy.boss).every(enemy => enemy.hp === 0)) { awakenBoss(); return; }
  if (stage === 'boss' && boss.hp === 0) {
    stage = 'exit';
    exitOpen = true;
    restoreAfterCombat();
    attack.remaining = 0;
    dodge.remaining = 0;
    updateStatus();
    updateAttackButton();
    return;
  }
  for (const enemy of activeEnemies()) {
    if (combatOver) break;
    updateEnemy(enemy, seconds);
  }
  dodge.remaining = Math.max(0, dodge.remaining - seconds);
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
loadRoomArt();
loadYardenArt();
loadMonsterArt();
loadSceneArt();
// Le jeu s'ouvre dans la ruelle ; ?skip dans le lien commence directement dans le donjon.
if (typeof location !== 'undefined' && /[?&]skip\b/.test(location.search)) skipOpening(); else startOpening();
requestAnimationFrame(frame);

document.getElementById('story-next').addEventListener('click', advanceStory);
const interactButton = document.getElementById('interact');
interactButton.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  event.preventDefault();
  useCrystal();
});
interactButton.addEventListener('click', event => { if (event.detail === 0) useCrystal(); });
