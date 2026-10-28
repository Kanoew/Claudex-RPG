'use strict';

const roomArt = { floor: null, wall: null };

function loadRoomArt() {
  if (typeof Image === 'undefined') return;
  for (const [name, file] of [['floor', 'sol-pierre.svg'], ['wall', 'mur-pierre.svg']]) {
    const image = new Image();
    image.onload = () => { roomArt[name] = ctx.createPattern(image, 'repeat'); };
    image.onerror = () => { roomArt[name] = null; };
    image.src = `assets/${file}?v=22`;
  }
}

function drawRoom(offsetX, offsetY) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(room.x + offsetX, room.y + offsetY, room.width, room.height);
  ctx.clip();
  if (roomArt.floor) {
    ctx.save();
    ctx.translate(room.x + offsetX, room.y + offsetY);
    ctx.fillStyle = roomArt.floor;
    ctx.fillRect(0, 0, room.width, room.height);
    ctx.restore();
  } else {
    // Dalles de secours : aucun chargement d’image n’est nécessaire pour jouer.
    ctx.fillStyle = '#161f29';
    ctx.fillRect(room.x + offsetX, room.y + offsetY, room.width, room.height);
    const firstX = Math.max(0, Math.floor((-offsetX - room.x) / 48));
    const firstY = Math.max(0, Math.floor((-offsetY - room.y) / 48));
    for (let col = firstX; col * 48 < Math.min(room.width, width - offsetX - room.x); col++) {
      for (let row = firstY; row * 48 < Math.min(room.height, height - offsetY - room.y); row++) {
        const x = room.x + col * 48 + offsetX, y = room.y + row * 48 + offsetY;
        ctx.fillStyle = (col + row) % 2 ? '#303a43' : '#35404a';
        ctx.fillRect(x + 2, y + 2, 44, 44);
        ctx.strokeStyle = '#59626b';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 3, y + 3, 42, 42);
      }
    }
  }
  ctx.restore();
  walls.forEach((wall, index) => {
    const x = wall.x + offsetX, y = wall.y + offsetY;
    ctx.save();
    ctx.fillStyle = '#080d16aa';
    ctx.fillRect(x + 6, y + 8, wall.width, wall.height);
    ctx.translate(x, y);
    ctx.fillStyle = roomArt.wall || '#4c5762';
    ctx.fillRect(0, 0, wall.width, wall.height);
    ctx.strokeStyle = '#8c969b';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, wall.width - 4, wall.height - 4);
    ctx.fillStyle = '#1a2533';
    ctx.fillRect(0, wall.height - 5, wall.width, 5);
    if (index >= 4) {
      // Les bases restent rectangulaires et coïncident avec les collisions.
      ctx.fillStyle = '#77828b';
      ctx.fillRect(3, 3, wall.width - 6, 9);
      ctx.fillStyle = '#2d3845';
      ctx.fillRect(8, 16, 4, wall.height - 30);
      ctx.fillRect(wall.width - 12, 16, 4, wall.height - 30);
      ctx.strokeStyle = '#222d39';
      ctx.beginPath();
      ctx.moveTo(18, wall.height * .36); ctx.lineTo(wall.width * .55, wall.height * .48); ctx.lineTo(wall.width * .5, wall.height * .64);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawRoomShade(x, y) {
  ctx.save();
  const radius = Math.max(240, Math.min(440, Math.hypot(width, height) * .65));
  const shade = ctx.createRadialGradient(x, y, 85, x, y, radius);
  shade.addColorStop(0, '#07101b00');
  shade.addColorStop(.6, '#07101b28');
  shade.addColorStop(1, '#07101ba8');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawStoneDoor(x, y, open, label) {
  ctx.save();
  ctx.fillStyle = '#0c121b';
  ctx.fillRect(x - 49, y - 7, 98, 45);
  ctx.fillStyle = '#76818b';
  ctx.fillRect(x - 49, y - 7, 10, 45);
  ctx.fillRect(x + 39, y - 7, 10, 45);
  ctx.fillRect(x - 49, y - 7, 98, 8);
  ctx.fillStyle = open ? '#347268' : '#3d3746';
  ctx.fillRect(x - 38, y + 2, 76, 32);
  ctx.fillStyle = open ? '#8affc1' : '#aa8c68';
  ctx.fillRect(x - 33, y + 29, 66, 3);
  if (!open) {
    ctx.fillStyle = '#242d38';
    for (let i = -24; i <= 24; i += 12) ctx.fillRect(x + i, y + 3, 3, 26);
  }
  ctx.fillStyle = '#ffb66f';
  ctx.beginPath(); ctx.arc(x - 60, y + 10, 3, 0, Math.PI * 2); ctx.arc(x + 60, y + 10, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#111924e6';
  ctx.fillRect(x - 40, y + 8, 80, 17);
  ctx.fillStyle = open ? '#a5ffcf' : '#eee1c8';
  ctx.font = 'bold 11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + 21);
  ctx.restore();
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
  drawRoom(offsetX, offsetY);
  drawDungeon(offsetX, offsetY);
  drawRoomShade(screenX, screenY);
  ctx.fillStyle = '#b5afca';
  ctx.font = '12px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText(currentZone.title, 14, 24);
  if (debugMode) {
    const lines = [
      `stage ${stage} · delay ${bossDelay.toFixed(2)} · pause ${paused} · fin ${combatOver}`,
      `doigt ${input.pointerId} · joy ${input.x.toFixed(2)},${input.y.toFixed(2)}`,
      `reset ${debugInfo.resets} (dernier : ${debugInfo.last})`,
      `yarden ${Math.round(player.x)},${Math.round(player.y)} · boss ${Math.round(boss.x)},${Math.round(boss.y)} actif ${boss.active}`
    ];
    ctx.fillStyle = '#ffd36b';
    lines.forEach((line, i) => ctx.fillText(line, 14, (boss.active ? 84 : 44) + i * 16));
  }
  for (const enemy of activeEnemies()) drawEnemy(enemy, offsetX, offsetY);
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
    // Faux provisoire en formes simples, seulement si les images de Yarden manquent : sinon c'est le sprite qui la porte.
    if (!yardenSpriteActive()) {
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
    }
    ctx.restore();
  }
  let labelY = screenY - 23;
  const spriteTop = drawYardenSprite(screenX, screenY);
  if (spriteTop !== null) labelY = spriteTop - 4;
  else {
    // Disque de secours si les images de Yarden ne sont pas chargées.
    ctx.fillStyle = dodge.remaining > 0 ? '#8affc1' : player.flash > 0 ? '#fff' : '#c5afff';
    ctx.beginPath();
    ctx.arc(screenX, screenY, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(screenX + facing.x * 7, screenY + facing.y * 7, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#eae7f5';
  ctx.textAlign = 'center';
  ctx.fillText('Yarden', screenX, labelY);
  drawBossMarker(offsetX, offsetY);
}

function bossMarker(offsetX, offsetY) {
  if (!boss.active || boss.hp <= 0 || combatOver) return null;
  const x = boss.x + offsetX, y = boss.y + offsetY;
  if (x >= 30 && x <= width - 30 && y >= 72 && y <= height - 32) return null;
  const top = Math.min(82, height / 2);
  return { x: Math.max(28, Math.min(width - 28, x)), y: Math.max(top, Math.min(height - 32, y)), angle: Math.atan2(y - height / 2, x - width / 2) };
}

function drawBossMarker(offsetX, offsetY) {
  const marker = bossMarker(offsetX, offsetY);
  if (!marker) return;
  ctx.save();
  ctx.translate(marker.x, marker.y);
  ctx.rotate(marker.angle);
  ctx.fillStyle = '#f0c77d';
  ctx.strokeStyle = '#15121e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(13, 0); ctx.lineTo(-9, -9); ctx.lineTo(-4, 0); ctx.lineTo(-9, 9);
  ctx.closePath(); ctx.stroke(); ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.font = 'bold 11px system-ui';
  ctx.textAlign = 'center';
  const labelX = Math.max(42, Math.min(width - 42, marker.x));
  const labelY = Math.min(height - 4, marker.y + 26);
  ctx.fillStyle = '#12121e';
  ctx.fillRect(labelX - 34, labelY - 13, 68, 18);
  ctx.fillStyle = '#f0c77d';
  ctx.fillText('TROLL', labelX, labelY);
  ctx.restore();
}
