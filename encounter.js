'use strict';

// Première version jouable de l'antre : le venin, la ruse et le réveil sont
// séparés de la progression du premier donjon. L'araignée est immobilisée, pas tuée.
const encounter = { phase: 'waiting', elapsed: 0, blind: 0, slow: 0, fall: 0, projectiles: [], complete: false };
const story = { active: false, lines: [], done: null };
const spiderEnemy = () => zoneEnemies.antre[0];

function showStory(lines, done) {
  resetInput();
  story.active = true;
  story.lines = [...lines];
  story.done = done;
  document.getElementById('story-panel').hidden = false;
  document.getElementById('story-text').textContent = story.lines.shift();
  document.getElementById('story-next').focus();
  updateAttackButton();
}

function advanceStory() {
  if (!story.active) return;
  if (story.lines.length) {
    document.getElementById('story-text').textContent = story.lines.shift();
    return;
  }
  const done = story.done;
  Object.assign(story, { active: false, done: null });
  document.getElementById('story-panel').hidden = true;
  resetInput();
  if (done) done();
  canvas.focus();
  updateAttackButton();
  updateStatus();
}

function resetEncounter() {
  antreResonance.until = 0;
  Object.assign(encounter, { phase: 'waiting', elapsed: 0, blind: 0, slow: 0, fall: 0, complete: false });
  encounter.projectiles.length = 0;
  Object.assign(story, { active: false, lines: [], done: null });
  document.getElementById('story-panel').hidden = true;
}

function doorIsOpen(door) {
  if (!door.needs) return true;
  if (door.needs === 'exitOpen') return exitOpen;
  if (door.needs === 'riftOpen') return !encounter.complete;
  if (door.needs === 'antreOpen') return encounter.phase === 'waiting';
  return false;
}

function retryAntre() {
  resetInput();
  resetEncounter();
  resetEnemy(spiderEnemy());
  Object.assign(player, { hp: player.maxHp, mana: player.maxMana, flash: 0, armed: true });
  Object.assign(attack, { cooldown: 0, remaining: 0 });
  attack.hits.clear();
  skill.cooldown = 0;
  Object.assign(dodge, { remaining: 0, cooldown: 0 });
  combatOver = false;
  paused = false;
  resultDelay = 0;
  result.hidden = true;
  resetYardenSprite();
  enterZone('antre', 'south');
}

// Le combat débute en franchissant les fils. Jusqu'ici, le retour est libre.
function updateEncounter(seconds) {
  if (currentZone.id !== 'antre') return;
  if (encounter.phase === 'waiting' && player.y < 200) {
    encounter.phase = 'intro';
    showStory(['Une araignée de cristal défend cet antre.', 'Sa carapace est trop dure. Le cristal noir peut l’aveugler.'], () => {
      encounter.phase = 'combat';
      stage = 'spider';
    });
    return;
  }
  encounter.elapsed += seconds;
  encounter.slow = Math.max(0, encounter.slow - seconds);
  if (encounter.phase === 'blinded') {
    encounter.blind = Math.max(0, encounter.blind - seconds);
    if (encounter.blind === 0) encounter.phase = 'combat';
  }
  if (encounter.phase === 'falling') {
    encounter.fall = Math.max(0, encounter.fall - seconds);
    tickYardenSprite(seconds);
    if (encounter.fall === 0) {
      encounter.phase = 'resolution';
      showStory(['L’araignée est immobilisée. Yarden perd connaissance.', 'Yarden reprend connaissance dans la ruelle d’Helvara.'], () => {
        encounter.complete = true;
        encounter.phase = 'complete';
        resetYardenSprite();
        player.flash = 0;
        restoreAfterCombat();
        enterZone('exterieur', 'south');
      });
    }
  }
  tickVenom(seconds);
}

function encounterBlocksMovement() {
  return story.active || (scene.active && !scene.free) || (currentZone.id === 'antre' && ['falling', 'resolution'].includes(encounter.phase));
}

function canUseCrystal() {
  const crystal = currentZone.crystal;
  return !paused && !combatOver && !document.hidden && !story.active && crystal &&
    encounter.phase === 'combat' && Math.hypot(player.x - crystal.x, player.y - crystal.y) <= 55;
}

function useCrystal() {
  if (!canUseCrystal()) return;
  encounter.phase = 'blinded';
  encounter.blind = 5;
  pulseAntre();
  encounter.projectiles.length = 0;
  const spider = spiderEnemy();
  spider.windup = 0;
  spider.cooldown = 1;
  attack.remaining = 0;
  updateStatus();
}

function hitSpider(empowered) {
  const spider = spiderEnemy();
  spider.flash = .2;
  pulseAntre();
  if (encounter.phase !== 'blinded' || !empowered) return;
  encounter.phase = 'falling';
  encounter.fall = 1.2;
  encounter.slow = 0;
  encounter.projectiles.length = 0;
  spider.incapacitated = true;
  spider.windup = 0;
  // Elle reste vivante. La chute de Yarden est une transition, pas une défaite.
  spider.hp = 1;
  playYardenReaction('defeat');
  resetInput();
  updateStatus();
}

function stepSpider(enemy, seconds) {
  if (encounter.phase !== 'combat' || enemy.incapacitated) return;
  enemy.cooldown = Math.max(0, enemy.cooldown - seconds);
  if (enemy.windup > 0) {
    enemy.windup = Math.max(0, enemy.windup - seconds);
    if (enemy.windup === 0) {
      encounter.projectiles.push({ x: enemy.x, y: enemy.y, dx: enemy.dirX, dy: enemy.dirY, life: 3 });
      enemy.sprite.strike = .22;
    }
    return;
  }
  const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
  if (distance < 550 && clearPath(enemy, player) && enemy.cooldown === 0) {
    enemy.dirX = distance ? (player.x - enemy.x) / distance : 0;
    enemy.dirY = distance ? (player.y - enemy.y) / distance : 1;
    enemy.windup = .9;
    enemy.cooldown = 2.1;
    return;
  }
  // L'araignée suit dans son territoire seulement, sans traverser les piliers.
  if (distance > 180) {
    const point = nextWaypoint(enemy);
    if (!point) return;
    const dx = point.x - enemy.x, dy = point.y - enemy.y, length = Math.hypot(dx, dy);
    if (!length) return;
    const step = Math.min(length, enemy.speed * seconds);
    movePlayer(dx / length * step, dy / length * step, enemy);
    const area = currentZone.territory;
    enemy.x = clamp(enemy.x, area.x + enemy.radius, area.x + area.width - enemy.radius);
    enemy.y = clamp(enemy.y, area.y + enemy.radius, area.y + area.height - enemy.radius);
  }
}

function segmentTouchesPlayer(from, to, radius) {
  const dx = to.x - from.x, dy = to.y - from.y, length2 = dx * dx + dy * dy;
  const t = length2 ? clamp(((player.x - from.x) * dx + (player.y - from.y) * dy) / length2, 0, 1) : 0;
  return Math.hypot(player.x - from.x - dx * t, player.y - from.y - dy * t) <= player.radius + radius;
}

function tickVenom(seconds) {
  if (encounter.phase !== 'combat') { encounter.projectiles.length = 0; return; }
  encounter.projectiles = encounter.projectiles.filter(shot => {
    const before = { x: shot.x, y: shot.y };
    shot.x += shot.dx * 460 * seconds;
    shot.y += shot.dy * 460 * seconds;
    shot.life -= seconds;
    if (shot.life <= 0 || !clearPath(before, shot, 4)) return false;
    if (!segmentTouchesPlayer(before, shot, 5)) return true;
    if (dodge.remaining <= 0) {
      hurtPlayer();
      if (!combatOver) encounter.slow = 3;
    }
    return false;
  });
}

function encounterGoal() {
  if (story.active) return 'Continuer le récit';
  if (encounter.phase === 'waiting') return 'Avance vers l’antre · retour au sud';
  if (encounter.phase === 'blinded') return `Aveuglée ${encounter.blind.toFixed(1)} s · approche et utilise Fauchage`;
  if (encounter.phase === 'falling' || encounter.phase === 'resolution') return 'L’araignée est immobilisée';
  if (canUseCrystal()) return 'Utilise le cristal noir · bouton Cristal ou F';
  return encounter.slow > 0 ? 'Venin : déplacement ralenti · esquive le prochain tir' : 'Évite le venin · rejoins le cristal noir ◇';
}

function drawEncounter(offsetX, offsetY) {
  if (currentZone.id !== 'antre') return;
  const crystal = currentZone.crystal, x = crystal.x + offsetX, y = crystal.y + offsetY;
  ctx.fillStyle = '#242c3e';
  ctx.strokeStyle = '#b4d7ed';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 12); ctx.lineTo(x - 9, y - 14); ctx.lineTo(x + 5, y - 6);
  ctx.lineTo(x + 17, y + 11); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#dcefff';
  ctx.textAlign = 'center';
  ctx.fillText('CRISTAL NOIR', x, y - 23);
  const spider = spiderEnemy();
  if (spider.windup > 0) {
    ctx.strokeStyle = '#ffb86b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(spider.x + offsetX, spider.y + offsetY);
    ctx.lineTo(spider.x + offsetX + spider.dirX * 550, spider.y + offsetY + spider.dirY * 550); ctx.stroke();
  }
  for (const shot of encounter.projectiles) {
    ctx.strokeStyle = '#8ed9ff'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(shot.x + offsetX - shot.dx * 22, shot.y + offsetY - shot.dy * 22);
    ctx.lineTo(shot.x + offsetX, shot.y + offsetY); ctx.stroke();
  }
}
