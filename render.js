'use strict';

const roomArt = { floor: null, wall: null, ground: null, cliff: null };

function loadRoomArt() {
  if (typeof Image === 'undefined') return;
  for (const [name, file] of [['floor', 'sol-pierre.svg'], ['wall', 'mur-pierre.svg'], ['ground', 'sol-terre.svg'], ['cliff', 'mur-falaise.svg']]) {
    const image = new Image();
    image.onload = () => { roomArt[name] = ctx.createPattern(image, 'repeat'); };
    image.onerror = () => { roomArt[name] = null; };
    image.src = `assets/${file}?v=28`;
  }
}

function roundedRectPath(x, y, w, h, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// Rocher de la zone extérieure : base arrondie légère, qui reste dans le rectangle de collision.
function drawBoulder(x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#05090ea0';
  roundedRectPath(6, 9, w, h, 10);
  ctx.fill();
  ctx.fillStyle = '#4b555c';
  roundedRectPath(0, 0, w, h, 10);
  ctx.fill();
  ctx.fillStyle = '#6b767d';
  roundedRectPath(4, 3, w - 8, h * .52, 9);
  ctx.fill();
  ctx.fillStyle = '#232b31';
  ctx.fillRect(5, h - 8, w - 10, 8);
  ctx.strokeStyle = '#2a3238';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * .28, h * .12); ctx.lineTo(w * .4, h * .42); ctx.lineTo(w * .33, h * .7);
  ctx.moveTo(w * .66, h * .2); ctx.lineTo(w * .58, h * .5);
  ctx.stroke();
  ctx.fillStyle = '#3a5a47';
  ctx.beginPath();
  ctx.ellipse(w * .2, h * .84, 9, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(w * .78, h * .78, 7, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Décor sans collision de la zone extérieure : herbes, cailloux, petites fleurs.
function drawProps(offsetX, offsetY) {
  for (const prop of currentZone.props || []) {
    const x = prop.x + offsetX, y = prop.y + offsetY;
    if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;
    if (prop.kind === 'tuft') {
      ctx.strokeStyle = '#3a5a47';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x - 4, y + 3); ctx.lineTo(x - 5, y - 4);
      ctx.moveTo(x, y + 3); ctx.lineTo(x, y - 6);
      ctx.moveTo(x + 4, y + 3); ctx.lineTo(x + 5, y - 3);
      ctx.stroke();
    } else if (prop.kind === 'pebble') {
      ctx.fillStyle = '#3b4745';
      ctx.beginPath();
      ctx.ellipse(x, y, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#566360';
      ctx.fillRect(x - 2, y - 2, 3, 1);
    } else {
      ctx.fillStyle = '#d9d2b0';
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c9a85a';
      ctx.fillRect(x - .5, y - .5, 1, 1);
    }
  }
}

function drawRoom(offsetX, offsetY) {
  const outdoors = currentZone.theme === 'dehors';
  const floorArt = outdoors ? roomArt.ground : roomArt.floor;
  const wallArt = outdoors ? roomArt.cliff : roomArt.wall;
  ctx.save();
  ctx.beginPath();
  ctx.rect(room.x + offsetX, room.y + offsetY, room.width, room.height);
  ctx.clip();
  if (floorArt) {
    ctx.save();
    ctx.translate(room.x + offsetX, room.y + offsetY);
    ctx.fillStyle = floorArt;
    ctx.fillRect(0, 0, room.width, room.height);
    ctx.restore();
  } else if (outdoors) {
    // Terre unie de secours : aucun chargement d’image n’est nécessaire pour jouer.
    ctx.fillStyle = '#18231f';
    ctx.fillRect(room.x + offsetX, room.y + offsetY, room.width, room.height);
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
  if (outdoors) drawProps(offsetX, offsetY);
  ctx.restore();
  walls.forEach((wall, index) => {
    const x = wall.x + offsetX, y = wall.y + offsetY;
    ctx.save();
    if (outdoors && index >= 4) {
      ctx.restore();
      drawBoulder(x, y, wall.width, wall.height);
      return;
    }
    ctx.fillStyle = '#080d16aa';
    ctx.fillRect(x + 6, y + 8, wall.width, wall.height);
    ctx.translate(x, y);
    ctx.fillStyle = wallArt || (outdoors ? '#2a3238' : '#4c5762');
    ctx.fillRect(0, 0, wall.width, wall.height);
    ctx.strokeStyle = outdoors ? '#56636b' : '#8c969b';
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
  const tint = currentZone.theme === 'dehors' ? ['#0b172200', '#0b172214', '#0b172272'] : ['#07101b00', '#07101b28', '#07101ba8'];
  shade.addColorStop(0, tint[0]);
  shade.addColorStop(.6, tint[1]);
  shade.addColorStop(1, tint[2]);
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

// Entrée de grotte dans la falaise : retour vers le donjon.
function drawCaveMouth(x, y, label) {
  ctx.save();
  ctx.fillStyle = '#1b2025';
  ctx.fillRect(x - 49, y - 7, 98, 45);
  ctx.fillStyle = '#4b5860';
  ctx.fillRect(x - 49, y - 7, 98, 6);
  ctx.fillStyle = '#05070b';
  ctx.beginPath();
  ctx.moveTo(x - 36, y + 38); ctx.lineTo(x - 36, y + 14);
  ctx.quadraticCurveTo(x, y - 14, x + 36, y + 14); ctx.lineTo(x + 36, y + 38);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6b4fa855';
  ctx.beginPath();
  ctx.ellipse(x, y + 28, 26, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111924e6';
  ctx.fillRect(x - 40, y + 8, 80, 17);
  ctx.fillStyle = '#eee1c8';
  ctx.font = 'bold 11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(label + ' ↓', x, y + 21);
  ctx.restore();
}

// Sentier qui quitte la zone : deux poteaux, un linteau et un passage plus clair.
function drawPathGate(x, y, label) {
  ctx.save();
  ctx.fillStyle = '#0c121b';
  ctx.fillRect(x - 49, y - 7, 98, 45);
  ctx.fillStyle = '#2d3a35';
  ctx.fillRect(x - 38, y + 2, 76, 36);
  ctx.fillStyle = '#6b5239';
  ctx.fillRect(x - 46, y - 7, 9, 45);
  ctx.fillRect(x + 37, y - 7, 9, 45);
  ctx.fillRect(x - 46, y - 7, 92, 8);
  ctx.fillStyle = '#8affc1';
  ctx.fillRect(x - 33, y + 33, 66, 3);
  ctx.fillStyle = '#111924e6';
  ctx.fillRect(x - 40, y + 8, 80, 17);
  ctx.fillStyle = '#a5ffcf';
  ctx.font = 'bold 11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(label + ' ↑', x, y + 21);
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
  if (zoneFade > 0) {
    // Fondu depuis le noir quand Yarden arrive dans une nouvelle zone.
    ctx.fillStyle = `rgba(14, 15, 25, ${Math.min(1, zoneFade / .4)})`;
    ctx.fillRect(0, 0, width, height);
  }
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
