'use strict';

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

function nextWaypoint(enemy) {
  // Après une charge contre un mur, dégager le disque avant de reprendre le trajet.
  if (!clearPath(enemy, enemy, enemy.radius + .5)) {
    for (const distance of [6, 12, 24]) {
      for (const [x, y] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        const point = { x: enemy.x + x * distance, y: enemy.y + y * distance };
        if (clearPath(point, point, enemy.radius + .5) && clearPath(enemy, point)) return point;
      }
    }
  }
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


// Modèles de monstres : une zone n'indique que le type et la position de départ.
const enemyKinds = {
  goblin: { name: 'Gobelin', art: 'goblin', speed: 95, radius: 14, maxHp: 3, charger: false },
  ogre: { name: 'Ogre', art: 'ogre', speed: 80, radius: 14, maxHp: 2, charger: true },
  troll: { name: 'Troll', art: 'troll', speed: 65, radius: 24, maxHp: 8, boss: true, active: false }
};

function makeEnemy(spec) {
  const enemy = { ...enemyKinds[spec.kind], kind: spec.kind, spawnX: spec.x, spawnY: spec.y };
  resetEnemy(enemy);
  return enemy;
}

function resetEnemy(enemy) {
  Object.assign(enemy, { x: enemy.spawnX, y: enemy.spawnY, hp: enemy.maxHp, flash: 0, cooldown: 0, windup: 0, charge: 0, chargeHit: false, dirX: 0, dirY: 1, routeTimer: 0, waypoint: null , sprite: { time: 0, moving: false, face: -1, strike: 0 } });
  if (enemy.boss) enemy.active = false;
}

function hurtPlayer(damage = 1) {
  if (combatOver || dodge.remaining > 0) return;
  player.hp = Math.max(0, player.hp - damage);
  player.flash = .2;
  updateStatus();
  if (player.hp === 0) {
    playYardenReaction('defeat');
    // Le message de défaite attend un instant pour laisser voir Yarden tomber.
    finishCombat('Yarden est tombée. Réessaie !', 1);
  } else playYardenReaction('hurt');
}

function updateEnemy(enemy, seconds) {
  const x = enemy.x, y = enemy.y;
  stepEnemy(enemy, seconds);
  updateMonsterSprite(enemy, seconds, Math.hypot(enemy.x - x, enemy.y - y));
}

function stepEnemy(enemy, seconds) {
  if (enemy.hp <= 0 || (enemy.boss && !enemy.active)) return;
  enemy.cooldown = Math.max(0, enemy.cooldown - seconds);
  const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
  const reach = enemy.boss ? 105 + player.radius : player.radius + enemy.radius + 8;
  if (enemy.charge > 0) {
    const before = { x: enemy.x, y: enemy.y };
    const step = Math.min(seconds, enemy.charge) * 420;
    movePlayer(enemy.dirX * step, enemy.dirY * step, enemy);
    enemy.charge = Math.max(0, enemy.charge - seconds);
    // Contact sur tout le trajet pour ne pas sauter par-dessus Yarden entre deux images.
    const dx = enemy.x - before.x, dy = enemy.y - before.y;
    const length2 = dx * dx + dy * dy;
    const t = length2 > 0 ? clamp(((player.x - before.x) * dx + (player.y - before.y) * dy) / length2, 0, 1) : 0;
    const closest = { x: before.x + dx * t, y: before.y + dy * t };
    if (!enemy.chargeHit && Math.hypot(player.x - closest.x, player.y - closest.y) <= player.radius + enemy.radius && clearPath(closest, player)) {
      enemy.chargeHit = true;
      hurtPlayer();
    }
    if (Math.hypot(dx, dy) < step - .1) enemy.charge = 0;
    return;
  }
  if (enemy.windup > 0) {
    enemy.windup = Math.max(0, enemy.windup - seconds);
    if (enemy.windup === 0) {
      if (enemy.charger) { enemy.charge = .32; enemy.chargeHit = false; }
      else {
        enemy.sprite.strike = enemy.art ? monsterClips[enemy.art].strikeSeconds : 0;
        if (distance <= reach && clearPath(enemy, player)) hurtPlayer(enemy.boss ? 2 : 1);
      }
    }
    return;
  }
  const canStrike = enemy.charger
    ? distance <= 150 && clearPath(enemy, player, distance <= reach ? 0 : enemy.radius + .5)
    : distance <= reach && clearPath(enemy, player);
  if (canStrike) {
    if (enemy.cooldown === 0) {
      enemy.windup = enemy.boss ? (enemy.hp <= 4 ? .6 : .8) : enemy.charger ? .55 : .35;
      enemy.cooldown = enemy.boss ? 2.1 : enemy.charger ? 1.8 : .95;
      enemy.dirX = distance > 0 ? (player.x - enemy.x) / distance : 0;
      enemy.dirY = distance > 0 ? (player.y - enemy.y) / distance : 1;
    }
    return;
  }
  enemy.routeTimer -= seconds;
  if (enemy.routeTimer <= 0 || !enemy.waypoint || Math.hypot(enemy.waypoint.x - enemy.x, enemy.waypoint.y - enemy.y) < 2) {
    enemy.waypoint = nextWaypoint(enemy);
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

function drawEnemy(enemy, offsetX, offsetY) {
  if (enemy.hp <= 0 || (enemy.boss && !enemy.active)) return;
  const ex = enemy.x + offsetX, ey = enemy.y + offsetY;
  if (enemy.windup > 0) {
    ctx.strokeStyle = '#ffb86b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (enemy.charger) {
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + enemy.dirX * 135, ey + enemy.dirY * 135);
    } else ctx.arc(ex, ey, enemy.boss ? 105 : enemy.radius + player.radius + 8, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Sprite du monstre s'il est chargé ; sinon la forme provisoire (disque ou carré de couleur).
  const spriteTop = drawMonsterSprite(enemy, ex, ey);
  if (spriteTop === null) {
    ctx.fillStyle = enemy.flash > 0 ? '#fff' : enemy.windup > 0 ? '#ffb86b' : enemy.boss ? '#b187ef' : enemy.charger ? '#e7c567' : '#df6c82';
    if (enemy.charger) ctx.fillRect(ex - enemy.radius, ey - enemy.radius, enemy.radius * 2, enemy.radius * 2);
    else {
      ctx.beginPath();
      ctx.arc(ex, ey, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const barY = (spriteTop === null ? ey - enemy.radius : spriteTop) - 11;
  ctx.fillStyle = '#302633';
  ctx.fillRect(ex - 20, barY, 40, 5);
  ctx.fillStyle = enemy.charger ? '#e7c567' : '#df6c82';
  ctx.fillRect(ex - 20, barY, 40 * enemy.hp / enemy.maxHp, 5);
  if (enemy.boss) {
    ctx.fillStyle = '#eae7f5';
    ctx.textAlign = 'center';
    ctx.fillText('TROLL', ex, barY - 9);
  }
}
