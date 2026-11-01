'use strict';

// Décor de l'appartement d'Ishara : bois, terre cuite et plâtre dans une palette chaude. Jamais de bleu (réservé à la faille
// et à l'Abysse). Les meubles restent dans leurs rectangles de collision. Les couleurs et formes sont inventées à minima.
function drawAppartFloor(offsetX, offsetY) {
  const x0 = room.x + offsetX, y0 = room.y + offsetY;
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x + offsetX, y + offsetY, w, h); };
  rect(-320, -300, 640, 600, '#2b2118');
  // Salon : bois clair ; cuisine : terre cuite.
  rect(-320, -300, 360, 270, '#8a6446');
  rect(40, -300, 280, 270, '#8b5a3f');
  // Couloir, chambre d'appoint (parquet), salle de bain (petits carreaux beiges).
  rect(-60, -10, 120, 310, '#7a5438');
  rect(-320, -10, 240, 310, '#7d5a3c');
  rect(80, -10, 240, 160, '#b8a085');
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#00000026';
  for (let y = -300; y < -30; y += 28) { ctx.beginPath(); ctx.moveTo(x0, y + offsetY); ctx.lineTo(40 + offsetX, y + offsetY); ctx.stroke(); }
  for (let y = -10; y < 300; y += 26) { ctx.beginPath(); ctx.moveTo(-320 + offsetX, y + offsetY); ctx.lineTo(-80 + offsetX, y + offsetY); ctx.stroke(); }
  for (let y = -10; y < 300; y += 30) { ctx.beginPath(); ctx.moveTo(-60 + offsetX, y + offsetY); ctx.lineTo(60 + offsetX, y + offsetY); ctx.stroke(); }
  for (let x = 40; x < 320; x += 40) { ctx.beginPath(); ctx.moveTo(x + offsetX, -300 + offsetY); ctx.lineTo(x + offsetX, -30 + offsetY); ctx.stroke(); }
  for (let x = 80; x < 320; x += 24) { ctx.beginPath(); ctx.moveTo(x + offsetX, -10 + offsetY); ctx.lineTo(x + offsetX, 150 + offsetY); ctx.stroke(); }
  for (let y = -10; y < 150; y += 24) { ctx.beginPath(); ctx.moveTo(80 + offsetX, y + offsetY); ctx.lineTo(320 + offsetX, y + offsetY); ctx.stroke(); }
  // Tapis fin de la chambre d'appoint, et tapis du salon.
  rect(-250, 40, 160, 100, '#a8654a');
  rect(-244, 46, 148, 88, '#c98d62');
  rect(-290, -200, 190, 110, '#9c5a43');
  rect(-284, -194, 178, 98, '#b9805a');
  // La lumière de juillet tombe en oblique depuis la fenêtre sur le mur et le sol du salon.
  ctx.save();
  ctx.fillStyle = '#ffd08a22';
  ctx.beginPath();
  ctx.moveTo(-290 + offsetX, -300 + offsetY); ctx.lineTo(-110 + offsetX, -300 + offsetY);
  ctx.lineTo(10 + offsetX, -90 + offsetY); ctx.lineTo(-170 + offsetX, -90 + offsetY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Murs de plâtre, fenêtres, porte d'entrée, porte fermée d'Ishara, miroir.
function drawAppartSolid(wall, x, y, index) {
  ctx.save();
  ctx.translate(x, y);
  const w = wall.width, h = wall.height;
  const fill = (color, ox, oy, fw, fh) => { ctx.fillStyle = color; ctx.fillRect(ox, oy, fw, fh); };
  const kind = wall.kind;
  if (index < 4 || kind === 'cloison') {
    fill('#00000040', 5, 7, w, h);
    fill('#cdb591', 0, 0, w, h);
    fill('#e3d0ae', 0, 0, w, Math.min(5, h));
    fill('#a98b66', 0, h - 4, w, 4);
    if (index === 0) {
      // Fenêtre du salon : ciel orange de fin de journée ; plantes sur le rebord.
      fill('#8a5a35', 30, 6, 190, 20);
      fill('#ffb867', 34, 9, 182, 14);
      for (let i = 0; i < 6; i++) { fill('#4f7a3a', 40 + i * 30, 1, 12, 9); fill('#6b9a4c', 44 + i * 30, 0, 6, 6); }
    }
    if (index === 3) fill('#6b4a30', 6, 180, 14, 60);
    if (index === 2) { fill('#8a5a35', 4, 360, 12, 60); fill('#ffe3b0', 6, 362, 8, 56); }
    if (wall.door === 'ishara') { fill('#7a5638', 0, 90, 16, 60); fill('#d6b88a', 11, 118, 3, 5); }
    if (kind === 'cloison' && x > 0 && Math.abs(wall.y + 30) < 1 && wall.x === 60) {
      // Miroir au-dessus du lavabo.
      fill('#8a6a44', 200, 2, 56, 16); fill('#efe6d2', 203, 4, 50, 12);
    }
  } else if (kind === 'canape') {
    fill('#00000038', 5, 6, w, h);
    fill('#9a5b45', 0, 6, w, h - 6); fill('#b36f55', 0, 0, w, 14);
    fill('#8a4f3b', 0, 14, 12, h - 14); fill('#8a4f3b', w - 12, 14, 12, h - 14);
    fill('#c98d62', 18, 18, 36, 14); fill('#c98d62', 62, 18, 36, 14);
  } else if (kind === 'tablebasse') {
    fill('#00000038', 4, 5, w, h);
    fill('#6b4a30', 0, 0, w, h); fill('#80593a', 3, 3, w - 6, h - 6);
    ctx.fillStyle = '#efe6d4'; ctx.beginPath(); ctx.arc(26, 22, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#efe6d4'; ctx.beginPath(); ctx.arc(70, 22, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6b3b22'; ctx.beginPath(); ctx.arc(70, 22, 4, 0, Math.PI * 2); ctx.fill();
  } else if (kind === 'livres') {
    fill('#00000038', 3, 4, w, h);
    fill('#7a3f2c', 0, 26, w, 14); fill('#c1944f', 3, 14, w - 8, 12); fill('#5d6b3a', 0, 4, w - 4, 10);
  } else if (kind === 'table') {
    fill('#00000038', 4, 5, w, h);
    fill('#7a5a3a', 0, 0, w, h); fill('#8f6c48', 3, 3, w - 6, h - 6);
  } else if (kind === 'comptoir') {
    fill('#00000038', 4, 6, w, h);
    fill('#a98760', 0, 0, w, h); fill('#d3b184', 0, 0, w, 24);
    // Bouilloire et clés jetées.
    fill('#c4c0b6', 26, 3, 14, 16); fill('#8a8678', 38, 8, 6, 3);
    fill('#d9b24a', 140, 8, 8, 4); fill('#d9b24a', 150, 12, 6, 4);
  } else if (kind === 'cuisine') {
    fill('#00000038', 4, 5, w, h);
    fill('#a98760', 0, 0, w, h); fill('#c29a6a', 0, 0, w, 10);
    fill('#4a3a2c', 20, 14, 46, 20); fill('#efe6d4', 110, 8, 44, 30);
  } else if (kind === 'lit') {
    fill('#00000038', 5, 6, w, h);
    fill('#6b4a30', 0, 0, w, h); fill('#efe0c4', 4, 4, w - 8, h - 8);
    fill('#f7efd8', 8, 8, w - 16, 28); fill('#a56a4f', 4, 56, w - 8, h - 60);
  } else if (kind === 'placard') {
    fill('#00000038', 4, 5, w, h);
    fill('#7a5638', 0, 0, w, h); fill('#8f6944', 4, 4, 54, h - 8); fill('#8f6944', 62, 4, 54, h - 8);
  } else if (kind === 'radiateur') {
    fill('#00000030', 3, 4, w, h);
    fill('#e9e0cc', 0, 0, w, h); fill('#d9a46a', 12, 2, 36, h - 4); fill('#c47a5a', 54, 2, 30, h - 4);
  } else if (kind === 'douche') {
    fill('#00000030', 4, 5, w, h);
    fill('#e3d6bd', 0, 0, w, h); fill('#c9b896', 4, 4, w - 8, h - 8);
    fill('#8a5aa8', 10, 8, 8, 14); fill('#b3453a', 24, 8, 8, 14);
  } else if (kind === 'lavabo') {
    fill('#00000030', 3, 4, w, h);
    fill('#efe6d4', 0, 0, w, h); fill('#d9cdb4', 8, 8, w - 16, h - 14);
  }
  ctx.restore();
}

// Petit losange et nom au-dessus de ce que Yarden peut examiner de près.
function drawSpotMarkers(offsetX, offsetY) {
  if (spotsOfZone() === null || !interactFree()) return;
  const near = nearSpot();
  if (!near) return;
  const x = near.x + offsetX, y = near.y + offsetY - 22 + Math.sin(elapsed * 4) * 2;
  ctx.save();
  ctx.fillStyle = '#ffe3a8';
  ctx.beginPath(); ctx.moveTo(x, y - 7); ctx.lineTo(x + 6, y); ctx.lineTo(x, y + 7); ctx.lineTo(x - 6, y); ctx.closePath(); ctx.fill();
  ctx.font = '11px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff2d6';
  ctx.fillText(near.label, x, y - 12);
  ctx.restore();
}
