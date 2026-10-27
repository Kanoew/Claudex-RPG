'use strict';

function updateDungeon() {
  if (!player.armed) {
    if (Math.hypot(player.x - weapon.x, player.y - weapon.y) > 28) return true;
    player.armed = true;
    stage = 'guards';
    updateStatus();
    updateAttackButton();
  }
  if (stage === 'exit' && exitOpen && Math.abs(player.x) <= 44 - player.radius && player.y <= room.y + 32) {
    stage = 'escaped';
    finishCombat('Yarden a quitté l’Abysse. Donjon terminé !');
    updateStatus();
    return true;
  }
  return false;
}

function drawDungeon(offsetX, offsetY) {
  drawStoneDoor(offsetX, room.y + offsetY, exitOpen, exitOpen ? 'SORTIE ↑' : 'SCELLÉE');
  drawStoneDoor(offsetX, room.y + room.height + offsetY - 36, false, 'ENTRÉE');
  ctx.font = '12px system-ui';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#eae7f5';
  if (player.armed) return;
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
