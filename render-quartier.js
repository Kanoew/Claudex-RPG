'use strict';

// Rue devant l'immeuble (quartier étudiant) : façade claire de pierre fatiguée avec fenêtres éclairées, porte au centre, trottoir et chaussée.
// Les objets restent dans leurs rectangles de collision. Plan et couleurs inventés à minima.
const quartierDoor = { x: 0, y: -62 };

function drawQuartierFloor(offsetX, offsetY) {
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x + offsetX, y + offsetY, w, h); };
  rect(-260, -200, 520, 420, '#232126');
  rect(-260, -80, 520, 60, '#6a6258');
  ctx.strokeStyle = '#00000030'; ctx.lineWidth = 1;
  for (let x = -260; x < 260; x += 40) { ctx.beginPath(); ctx.moveTo(x + offsetX, -80 + offsetY); ctx.lineTo(x + offsetX, -20 + offsetY); ctx.stroke(); }
  rect(-260, -22, 520, 6, '#8a8174');
  // Marquage de la chaussée.
  ctx.fillStyle = '#d9cfa8aa';
  for (let x = -240; x < 240; x += 80) ctx.fillRect(x + offsetX, 150 + offsetY, 40, 4);
  // Lampadaire chaud près de la porte.
  const lamp = ctx.createRadialGradient(100 + offsetX, -30 + offsetY, 6, 100 + offsetX, -30 + offsetY, 170);
  lamp.addColorStop(0, '#ffd99244'); lamp.addColorStop(1, '#ffd99200');
  ctx.fillStyle = lamp; ctx.fillRect(100 - 170 + offsetX, -200 + offsetY, 340, 340);
  ctx.fillStyle = '#0b0e14'; ctx.beginPath(); ctx.arc(100 + offsetX, -30 + offsetY, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffe3a8'; ctx.beginPath(); ctx.arc(100 + offsetX, -30 + offsetY, 3, 0, Math.PI * 2); ctx.fill();
}

function drawQuartierSolid(wall, x, y, index) {
  ctx.save();
  ctx.translate(x, y);
  const w = wall.width, h = wall.height;
  const fill = (color, ox, oy, fw, fh) => { ctx.fillStyle = color; ctx.fillRect(ox, oy, fw, fh); };
  if (index < 4) {
    fill('#15131a', 0, 0, w, h);
  } else if (wall.kind === 'facade') {
    // Immeuble haussmannien un peu fatigué : pierre claire, fenêtres hautes à balcons, porte cochère au centre.
    fill('#b9a98c', 0, 0, w, h);
    fill('#d1c3a6', 0, 0, w, 10);
    fill('#9c8d72', 0, h - 12, w, 12);
    for (let i = 0; i < 6; i++) {
      const wx = 24 + i * 84;
      if (wx > 224 && wx < 296) continue;
      const lit = (i * 5 + 1) % 4 !== 0;
      fill('#6f5f48', wx - 3, 18, 44, 66);
      fill(lit ? '#ffcf85' : '#2a2430', wx, 22, 38, 58);
      fill('#6f5f48', wx + 18, 22, 2, 58);
      fill('#5d5040', wx - 6, 86, 50, 5);
    }
    fill('#4a3a2c', 236, 36, 48, 84);
    fill('#2b2118', 240, 40, 40, 80);
    fill('#d9b24a', 272, 84, 4, 4);
    fill('#ffcf8544', 232, 120, 56, 8);
  } else if (wall.kind === 'velos') {
    fill('#00000030', 4, 4, w, h);
    ctx.strokeStyle = '#8a8a90'; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(14 + i * 22, 14, 9, 0, Math.PI * 2); ctx.stroke(); }
  } else if (wall.kind === 'poubelle') {
    fill('#00000030', 3, 3, w, h);
    fill('#4a5a48', 0, 0, w, h); fill('#5e7059', 2, 2, w - 4, 6);
  } else if (wall.kind === 'arbre') {
    // Petit arbre en bac : tronc et feuillage vus en trois quarts.
    fill('#00000030', 3, 3, w, h);
    fill('#4a3a2c', w / 2 - 3, h - 12, 6, 12);
    ctx.fillStyle = '#3f6b3a'; ctx.beginPath(); ctx.arc(w / 2, h / 2 - 3, w * .46, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5d9150'; ctx.beginPath(); ctx.arc(w / 2 - 4, h / 2 - 7, w * .24, 0, Math.PI * 2); ctx.fill();
  } else if (wall.kind === 'fleurs') {
    fill('#00000030', 2, 3, w, h);
    fill('#7a5a3a', 0, h - 7, w, 7);
    const colors = ['#e58fb0', '#f2d36b', '#cbb8ff', '#ffffff'];
    for (let i = 0; i < 6; i++) { fill('#3f6b3a', 3 + i * 5, 2, 3, h - 8); fill(colors[i % 4], 2 + i * 5, 0, 5, 5); }
  } else if (wall.kind === 'voiture') {
    // Voiture garée, vue de dessus en trois quarts : carrosserie, vitres, roues.
    fill('#00000038', 4, 6, w, h);
    ctx.fillStyle = wall.tint || '#555';
    roundedRectPath(0, 4, w, h - 8, 10); ctx.fill();
    fill('#00000022', 0, h / 2, w, h / 2 - 4);
    fill('#1c2330', 18, 10, w - 36, h - 22);
    fill('#8aa0b5', 22, 13, 20, h - 28); fill('#8aa0b5', w - 42, 13, 20, h - 28);
    fill('#101010', 10, 0, 16, 7); fill('#101010', w - 26, 0, 16, 7); fill('#101010', 10, h - 7, 16, 7); fill('#101010', w - 26, h - 7, 16, 7);
    fill('#f4e6b8', w - 4, 12, 4, 6); fill('#f4e6b8', w - 4, h - 18, 4, 6);
  }
  ctx.restore();
}
