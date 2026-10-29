'use strict';

const roomArt = { floor: null, wall: null, asphalt: null, brick: null };

function loadRoomArt() {
  if (typeof Image === 'undefined') return;
  for (const [name, file] of [['floor', 'sol-pierre.svg'], ['wall', 'mur-pierre.svg'], ['asphalt', 'sol-bitume.svg'], ['brick', 'mur-brique.svg']]) {
    const image = new Image();
    image.onload = () => { roomArt[name] = ctx.createPattern(image, 'repeat'); };
    image.onerror = () => { roomArt[name] = null; };
    image.src = `assets/${file}?v=29`;
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

// Objets de la ruelle : chacun reste dans son rectangle de collision, vu de dessus en trois quarts.
function drawAlleyObject(kind, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#05080ea0';
  ctx.fillRect(6, 8, w, h);
  if (kind === 'benne') {
    ctx.fillStyle = '#2c4452';
    roundedRectPath(0, 0, w, h, 5);
    ctx.fill();
    ctx.fillStyle = '#3b5868';
    roundedRectPath(3, 3, w - 6, h * .45, 4);
    ctx.fill();
    ctx.strokeStyle = '#1b2c37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 1; i < 4; i++) { ctx.moveTo(w * i / 4, 4); ctx.lineTo(w * i / 4, h - 4); }
    ctx.stroke();
    ctx.fillStyle = '#10161b';
    ctx.fillRect(4, h - 7, 10, 7); ctx.fillRect(w - 14, h - 7, 10, 7);
  } else if (kind === 'caisses') {
    ctx.fillStyle = '#6b4a2e';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#85603c';
    ctx.fillRect(2, 2, w - 4, h * .4);
    ctx.strokeStyle = '#3c2a1a';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
    ctx.beginPath();
    ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h * .55); ctx.lineTo(w, h * .55);
    ctx.stroke();
  } else if (kind === 'poubelles') {
    for (let i = 0; i < 2; i++) {
      const cy = h * (i ? .72 : .28);
      ctx.fillStyle = '#3a3f47';
      ctx.beginPath(); ctx.ellipse(w / 2, cy, w / 2 - 2, h * .24, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4d535c';
      ctx.beginPath(); ctx.ellipse(w / 2, cy - 3, w / 2 - 7, h * .17, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#20242a';
      ctx.fillRect(w / 2 - 5, cy - 4, 10, 3);
    }
  } else {
    // Scooter garé de profil.
    ctx.fillStyle = '#9097a3';
    roundedRectPath(2, h * .22, w - 4, h * .56, 8);
    ctx.fill();
    ctx.fillStyle = '#20242a';
    ctx.fillRect(w * .32, h * .22, w * .26, h * .56);
    ctx.fillRect(w - 12, 3, 5, h - 6);
    ctx.fillStyle = '#12151a';
    ctx.fillRect(0, h * .3, 9, h * .4); ctx.fillRect(w - 10, h * .3, 9, h * .4);
  }
  ctx.restore();
}

// Décor sans collision de la ruelle : fissures, papiers, flaques, mégots et pools de lumière des lampadaires.
function drawProps(offsetX, offsetY) {
  for (const prop of currentZone.props || []) {
    const x = prop.x + offsetX, y = prop.y + offsetY;
    if (prop.kind === 'lampe-eteinte') {
      // Lampadaire éteint : le coin reste sombre.
      if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;
      ctx.fillStyle = '#0b0e14';
      ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#242a36';
      ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
      continue;
    }
    if (prop.kind === 'grille') {
      // Grille fermée contre le mur de droite.
      if (x < -60 || x > width + 60 || y < -80 || y > height + 80) continue;
      ctx.fillStyle = '#10141c';
      ctx.fillRect(x - 12, y - 40, 24, 80);
      ctx.strokeStyle = '#4b5666';
      ctx.lineWidth = 2;
      for (let bar = -34; bar <= 34; bar += 12) { ctx.beginPath(); ctx.moveTo(x - 10, y + bar); ctx.lineTo(x + 10, y + bar); ctx.stroke(); }
      ctx.strokeRect(x - 11, y - 39, 22, 78);
      continue;
    }
    if (prop.kind === 'lampe') {
      if (x < -170 || x > width + 170 || y < -170 || y > height + 170) continue;
      const pool = ctx.createRadialGradient(x, y, 6, x, y, 160);
      pool.addColorStop(0, '#ffd9923c');
      pool.addColorStop(1, '#ffd99200');
      ctx.fillStyle = pool;
      ctx.fillRect(x - 160, y - 160, 320, 320);
      ctx.fillStyle = '#0b0e14';
      ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffe3a8';
      ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
      continue;
    }
    if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;
    if (prop.kind === 'fissure') {
      ctx.strokeStyle = '#0d1014';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x - 9, y + 2); ctx.lineTo(x - 2, y - 3); ctx.lineTo(x + 3, y + 2); ctx.lineTo(x + 10, y - 2);
      ctx.stroke();
    } else if (prop.kind === 'papier') {
      ctx.fillStyle = '#b9b7ae';
      ctx.fillRect(x - 3, y - 2, 6, 4);
      ctx.fillStyle = '#8d8b84';
      ctx.fillRect(x - 3, y + 1, 6, 1);
    } else if (prop.kind === 'flaque') {
      ctx.fillStyle = '#2c3a52';
      ctx.beginPath(); ctx.ellipse(x, y, 13, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4a5f84';
      ctx.beginPath(); ctx.ellipse(x - 3, y - 1, 6, 1.8, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#d6cfc0';
      ctx.fillRect(x - 1, y - 3, 2, 5);
      ctx.fillStyle = '#c9803c';
      ctx.fillRect(x - 1, y + 2, 2, 1);
    }
  }
}

// Façades de briques qui montent de chaque côté de la ruelle, avec quelques fenêtres allumées.
function drawFacades(offsetX, offsetY) {
  const depth = 320, top = room.y + offsetY - 500, tall = room.height + 1000;
  for (const side of [-1, 1]) {
    const x = side < 0 ? room.x - wallThickness - depth + offsetX : room.x + room.width + wallThickness + offsetX;
    if (x + depth < 0 || x > width) continue;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, top, depth, tall);
    ctx.clip();
    ctx.translate(x, top);
    ctx.fillStyle = roomArt.brick || '#4b2824';
    ctx.fillRect(0, 0, depth, tall);
    for (let row = 0; row * 96 < tall; row++) {
      for (let col = 0; col < 3; col++) {
        const lit = (row * 5 + col * 3 + (side < 0 ? 0 : 2)) % 7 < 3;
        // Moitié sud de la façade de gauche : aucune fenêtre, la scène s'y déroule à l'abri des regards.
        if (side < 0 && room.y - 500 + 26 + row * 96 > 0 && room.y - 500 + 26 + row * 96 < room.y + room.height) continue;
        ctx.fillStyle = lit ? '#ffd28ab0' : '#0b0e14c8';
        ctx.fillRect(34 + col * 90, 26 + row * 96, 26, 36);
      }
    }
    const dark = ctx.createLinearGradient(side < 0 ? 0 : depth, 0, side < 0 ? depth : 0, 0);
    dark.addColorStop(0, '#03050aee');
    dark.addColorStop(1, '#03050a77');
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, depth, tall);
    ctx.restore();
  }
}

function drawRoom(offsetX, offsetY) {
  const outdoors = currentZone.theme === 'ruelle';
  const crystal = currentZone.theme === 'cristal';
  const floorArt = crystal ? null : outdoors ? roomArt.asphalt : roomArt.floor;
  const wallArt = crystal ? null : outdoors ? roomArt.brick : roomArt.wall;
  if (outdoors) drawFacades(offsetX, offsetY);
  ctx.save();
  ctx.beginPath();
  ctx.rect(room.x + offsetX, room.y + offsetY, room.width, room.height);
  ctx.clip();
  if (crystal) {
    ctx.fillStyle = '#121822';
    ctx.fillRect(room.x + offsetX, room.y + offsetY, room.width, room.height);
    ctx.strokeStyle = '#29384a'; ctx.lineWidth = 1;
    for (let i = -6; i < 8; i++) {
      ctx.beginPath(); ctx.moveTo(offsetX - 480 + i * 100, offsetY - 400);
      ctx.lineTo(offsetX + i * 100, offsetY + 400); ctx.stroke();
    }
  } else if (floorArt) {
    ctx.save();
    ctx.translate(room.x + offsetX, room.y + offsetY);
    ctx.fillStyle = floorArt;
    ctx.fillRect(0, 0, room.width, room.height);
    ctx.restore();
  } else if (outdoors) {
    // Bitume uni de secours : aucun chargement d’image n’est nécessaire pour jouer.
    ctx.fillStyle = '#1b1e25';
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
      drawAlleyObject(wall.kind, x, y, wall.width, wall.height);
      return;
    }
    ctx.fillStyle = '#080d16aa';
    ctx.fillRect(x + 6, y + 8, wall.width, wall.height);
    ctx.translate(x, y);
    ctx.fillStyle = wallArt || (outdoors ? '#4b2824' : '#4c5762');
    ctx.fillRect(0, 0, wall.width, wall.height);
    ctx.strokeStyle = outdoors ? '#7a463e' : '#8c969b';
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
  const tint = currentZone.theme === 'ruelle' ? ['#050a1800', '#050a1838', '#050a18b4'] : ['#07101b00', '#07101b28', '#07101ba8'];
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

// La faille : une déchirure verticale en forme de bouche, aux bords d'un bleu profond, qui ramène dans l'Abysse.
function drawFaille(x, y, label) {
  ctx.save();
  const glow = ctx.createRadialGradient(x, y - 20, 8, x, y - 20, 120);
  glow.addColorStop(0, '#2f6bff55');
  glow.addColorStop(1, '#2f6bff00');
  ctx.fillStyle = glow;
  ctx.fillRect(x - 120, y - 140, 240, 240);
  ctx.beginPath();
  ctx.moveTo(x, y - 62);
  ctx.bezierCurveTo(x + 30, y - 40, x + 30, y + 6, x, y + 34);
  ctx.bezierCurveTo(x - 30, y + 6, x - 30, y - 40, x, y - 62);
  ctx.closePath();
  ctx.fillStyle = '#02040b';
  ctx.fill();
  ctx.strokeStyle = '#3a86ff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = '#a8ccff';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#111924e6';
  ctx.fillRect(x - 40, y + 36, 80, 17);
  ctx.fillStyle = '#cfe1ff';
  ctx.font = 'bold 11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(label + ' ↓', x, y + 49);
  ctx.restore();
}

// Bout de la ruelle : la lumière de la rue et de la fête, plus loin.
function drawStreetGate(x, y, label) {
  ctx.save();
  const light = ctx.createLinearGradient(0, y - 10, 0, y + 190);
  light.addColorStop(0, '#ffcf8a88');
  light.addColorStop(1, '#ffcf8a00');
  ctx.fillStyle = light;
  ctx.fillRect(x - 130, y - 10, 260, 200);
  ctx.fillStyle = '#111924e6';
  ctx.fillRect(x - 40, y + 8, 80, 17);
  ctx.fillStyle = '#ffe9c4';
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
  drawEncounter(offsetX, offsetY);
  drawSceneActors(offsetX, offsetY, false);
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
  drawSceneActors(offsetX, offsetY, true);
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
