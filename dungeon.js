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

// Passage d'une zone à l'autre : Yarden arrive devant la porte d'en face, à bonne distance pour ne pas la retraverser.
function enterZone(id, arrival) {
  loadZone(id);
  const door = currentZone.doors.find(item => item.side === arrival);
  player.x = door.x;
  player.y = arrival === 'south' ? room.y + room.height - 90 : room.y + 90;
  // On coupe le coup et l'esquive en cours, mais pas le joystick : le pouce est peut-être encore posé.
  attack.remaining = 0;
  dodge.remaining = 0;
  zoneFade = .4;
  updateStatus();
  updateAttackButton();
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
  if (door && door.to) {
    enterZone(door.to, door.arrive);
    return true;
  }
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
    if (currentZone.theme === 'dehors') {
      if (door.side === 'south') drawCaveMouth(door.x + offsetX, y, door.label);
      else drawPathGate(door.x + offsetX, y, door.label);
    } else drawStoneDoor(door.x + offsetX, y, open && !door.decorative, open ? door.label + (door.side === 'north' ? ' ↑' : '') : door.sealed);
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
