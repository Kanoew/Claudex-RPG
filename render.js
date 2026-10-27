'use strict';

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
  if (debugMode) {
    const lines = [
      `stage ${stage} · delay ${bossDelay.toFixed(2)} · pause ${paused} · fin ${combatOver}`,
      `doigt ${input.pointerId} · joy ${input.x.toFixed(2)},${input.y.toFixed(2)}`,
      `reset ${debugInfo.resets} (dernier : ${debugInfo.last})`,
      `yarden ${Math.round(player.x)},${Math.round(player.y)} · boss ${Math.round(boss.x)},${Math.round(boss.y)} actif ${boss.active}`
    ];
    ctx.fillStyle = '#ffd36b';
    lines.forEach((line, i) => ctx.fillText(line, 14, 44 + i * 16));
  }
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
  ctx.fillText('GARDIEN', labelX, labelY);
  ctx.restore();
}
