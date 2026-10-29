'use strict';

// Le métro : un wagon vu de côté, les lumières du tunnel qui défilent derrière les vitres, et Yarden et Ishara debout qui se balancent
// un peu avec la rame (Ishara regarde son téléphone). Le texte du canon passe pendant ce temps.
function metroStep(value) {
  scene.metro = value === 'show' ? { start: mirrorNow() } : null;
  document.getElementById('story-panel').classList.toggle('over-mirror', value === 'show');
}

function drawSceneMetro() {
  const m = scene.metro;
  if (!m) return;
  const t = mirrorNow() - m.start, fade = Math.min(1, t / .5);
  const top = Math.max(10, height * .05), bandH = Math.min(height * .52, 330);
  const sway = Math.sin(t * 1.8) * 2.2;
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.fillStyle = '#120f14';
  ctx.fillRect(0, 0, width, height);
  ctx.translate(sway, Math.sin(t * 3.1) * 1);
  // Paroi du wagon, vitres et tunnel.
  const wallY = top, floorY = top + bandH;
  ctx.fillStyle = '#4a4a52'; ctx.fillRect(-10, wallY, width + 20, bandH);
  ctx.fillStyle = '#1b1a22';
  const windowW = Math.max(110, width * .36);
  for (let x = 12; x < width; x += windowW + 24) ctx.fillRect(x, wallY + 22, windowW, bandH * .42);
  ctx.save();
  ctx.beginPath();
  for (let x = 12; x < width; x += windowW + 24) ctx.rect(x, wallY + 22, windowW, bandH * .42);
  ctx.clip();
  for (let i = 0; i < 14; i++) {
    const x = ((i * 90 - t * 260) % (width + 90) + width + 90) % (width + 90) - 45;
    ctx.fillStyle = i % 3 ? '#ffcf8590' : '#ffe8c0cc';
    ctx.fillRect(x, wallY + 40 + (i % 3) * 22, 36, 3);
  }
  ctx.restore();
  ctx.fillStyle = '#6b6b74'; ctx.fillRect(-10, floorY - 14, width + 20, 14);
  ctx.fillStyle = '#2a2a30'; ctx.fillRect(-10, floorY, width + 20, 26);
  // Barre verticale près de la porte et banquette.
  ctx.fillStyle = '#b9b9c2'; ctx.fillRect(width * .5 - 3, wallY + 8, 6, bandH - 8);
  ctx.fillStyle = '#7a4a3a'; ctx.fillRect(width - 90, floorY - 70, 90, 56);
  ctx.fillStyle = '#5c372b'; ctx.fillRect(width - 90, floorY - 82, 90, 14);
  // Les deux personnages, un peu penchés par le mouvement.
  const scale = yardenCell.scale * 2.3, lean = Math.sin(t * 1.8) * .025;
  const yarden = yardenArt.strips.idle, ishara = sceneArt.strips['ishara/idle'];
  const place = (strip, cell, anchor, frame, x, flip) => {
    if (!strip) return;
    ctx.save();
    ctx.translate(x, floorY + 18);
    ctx.rotate(lean);
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(strip, frame * cell[0], 0, cell[0], cell[1], -anchor[0] * scale, -anchor[1] * scale, cell[0] * scale, cell[1] * scale);
    ctx.restore();
  };
  place(yarden, [96, 104], [48, 101], Math.floor(t * 1.3) % 6, width * .5 - 70, false);
  place(ishara, [86, 115], [43, 111], Math.floor(t * 1.1) % 4, width * .5 + 50, false);
  // Lueur du téléphone d'Ishara.
  ctx.fillStyle = '#dfe9ff';
  ctx.fillRect(width * .5 + 50 - 26, floorY + 18 - 78 * scale / 1.4, 8, 12);
  ctx.restore();
}
