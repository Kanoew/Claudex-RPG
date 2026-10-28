'use strict';

// Porte que Yarden touche en ce moment : près du mur de son côté, dans la largeur de la porte.
function doorAtPlayer() {
  for (const door of currentZone.doors) {
    if (door.decorative) continue;
    if (door.needs === 'exitOpen' && !exitOpen) continue;
    if (Math.abs(player.x - door.x) > door.half - player.radius) continue;
    if (door.side === 'north' && player.y <= room.y + 32) return door;
    if (door.side === 'south' && player.y >= room.y + room.height - 32) return door;
  }
  return null;
}

function updateDungeon() {
  if (currentZone.id === 'donjon' && !player.armed) {
    if (Math.hypot(player.x - weapon.x, player.y - weapon.y) > 28) return true;
    player.armed = true;
    stage = 'guards';
    updateStatus();
    updateAttackButton();
  }
  const door = doorAtPlayer();
  if (door && door.end) {
    stage = 'escaped';
    finishCombat(door.end);
    updateStatus();
    return true;
  }
  return false;
}

function drawDungeon(offsetX, offsetY) {
  for (const door of currentZone.doors) {
    const open = !door.needs || exitOpen;
    const y = door.side === 'north' ? room.y + offsetY : room.y + room.height + offsetY - 36;
    drawStoneDoor(door.x + offsetX, y, open && !door.decorative, open ? door.label + (door.side === 'north' ? ' ↑' : '') : door.sealed);
  }
  ctx.font = '12px system-ui';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#eae7f5';
  if (currentZone.id !== 'donjon' || player.armed) return;
  const x = weapon.x + offsetX, y = weapon.y + offsetY;
  ctx.strokeStyle = '#c5afff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 27, 0, Math.PI * 2);
  ctx.moveTo(x - 8, y + 16);
  ctx.lineTo(x + 6, y - 16);
  ctx.quadraticCurveTo(x + 28, y - 14, x + 13, y + 3);
  ctx.stroke();
  ctx.fillStyle = '#eae7f5';
  ctx.fillText('FAUX', x, y - 37);
}
