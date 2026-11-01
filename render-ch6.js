'use strict';

// Décors du chapitre 6 : préau désaffecté, esplanade et terrasse du Flon, hall d'Ouchy, seizième étage d'Izzy.
// Dessinés en code, plans inventés à minima ; seuls les éléments cités dans le roman sont canon (baie de trente mètres, pierre pâle, terrasse, piscine,
// chambre de bonne au bout du couloir). `ch6` porte les états qui changent le dessin.

themeDrawers.preau = {
  tint: ['#00000000', '#00000012', '#0a0a1440'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-170, -140, 340, 280, '#8f8a7e');
    ctx.strokeStyle = '#00000024'; for (let x = -170; x < 170; x += 34) { ctx.beginPath(); ctx.moveTo(x + offsetX, -80 + offsetY); ctx.lineTo(x + offsetX, 140 + offsetY); ctx.stroke(); }
    rect(-170, -80, 340, 6, '#6f6a60');
    // Marelle effacée au sol : un préau d'école à l'abandon.
    ctx.strokeStyle = '#d8d2c0'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) ctx.strokeRect(-12 + offsetX, 30 + i * 22 + offsetY, 24, 22);
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4) fill('#15131a', 0, 0, w, h);
    else if (wall.kind === 'mur-ecole') { fill('#a79f8c', 0, 0, w, h); for (let i = 0; i < 6; i++) { fill('#3a3f4e', 20 + i * 54, 10, 34, 34); fill('#00000040', 20 + i * 54, 10, 34, 3); } }
    else if (wall.kind === 'banc-pierre') { fill('#00000033', 3, 5, w, h); fill('#b4ad9c', 0, 0, w, h); fill('#d3ccba', 0, 0, w, 6); }
    else if (wall.kind === 'colonne') { fill('#00000033', 3, 4, w, h); fill('#bdb6a4', 0, 0, w, h); fill('#d6cfbd', 0, 0, w, 5); }
    ctx.restore();
  }
};

themeDrawers.flon = {
  tint: ['#3a200a00', '#3a200a14', '#1a0e0866'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-300, -200, 600, 420, '#8a8478');
    rect(-300, -160, 600, 130, '#6a5a48');                        // le plancher de la terrasse
    ctx.strokeStyle = '#00000026'; for (let y = -160; y < -30; y += 14) { ctx.beginPath(); ctx.moveTo(-300 + offsetX, y + offsetY); ctx.lineTo(300 + offsetX, y + offsetY); ctx.stroke(); }
    rect(-300, -30, 600, 6, '#b3ad9d');                           // la balustrade
    // La table vide d'Izzy et le vide propre autour d'elle (l'anneau), visibles quand les hommes sont là.
    if (ch6.ringMen) {
      ctx.save(); ctx.globalAlpha = .35; ctx.strokeStyle = '#ffe3a8'; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.arc(170 + offsetX, -60 + offsetY, 62, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4) fill('#15131a', 0, 0, w, h);
    else if (wall.kind === 'facade-flon') { fill('#7d6f66', 0, 0, w, h); fill('#5e5149', 0, h - 8, w, 8); }
    else if (wall.kind === 'bar') { fill('#00000040', 4, 6, w, h); fill('#3b2a1c', 0, 0, w, h); fill('#6b4a2e', 0, 0, w, 6); for (let i = 0; i < 6; i++) fill('#d8c8a8', 14 + i * 34, 8, 8, 10); }
    else if (wall.kind === 'table') { fill('#00000033', 3, 4, w, h); fill('#d9d2c2', 0, 0, w, h); fill('#a39c8a', 0, h - 4, w, 4); }
    ctx.restore();
  }
};

themeDrawers.hall = {
  tint: ['#2a160a00', '#2a160a10', '#1a0e0866'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-220, -160, 440, 320, '#c8c3b6');
    ctx.strokeStyle = '#00000020'; for (let x = -220; x < 220; x += 55) for (let y = -160; y < 160; y += 55) ctx.strokeRect(x + offsetX, y + offsetY, 55, 55);
    // Trois lustres : la fausse chaleur d'un lieu qui ne ferme jamais.
    for (const cx of [-130, 0, 130]) { const g = ctx.createRadialGradient(cx + offsetX, -20 + offsetY, 4, cx + offsetX, -20 + offsetY, 80); g.addColorStop(0, 'rgba(255, 240, 200, .35)'); g.addColorStop(1, 'rgba(255, 240, 200, 0)'); ctx.fillStyle = g; ctx.fillRect(cx - 80 + offsetX, -100 + offsetY, 160, 160); }
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4) fill('#1a1a20', 0, 0, w, h);
    else if (wall.kind === 'comptoir-hall') { fill('#00000033', 3, 5, w, h); fill('#d9c9a8', 0, 0, w, h); fill('#efe2c4', 0, 0, w, 8); fill('#b09b72', 0, h - 6, w, 6); }
    else if (wall.kind === 'ascenseur-hall') { fill('#9a9aa2', 0, 0, w, h); fill('#c9c9d2', 8, 6, w - 16, h - 12); fill('#7a7a84', w / 2 - 1, 6, 2, h - 12); }
    ctx.restore();
  }
};

themeDrawers.penthouse = {
  tint: ['#1a0a2000', '#1a0a2014', '#0a081c66'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-330, -230, 660, 470, '#cdc6b8');                         // pierre pâle
    rect(-330, 50, 660, 190, '#c0b9ab');                           // le couloir
    ctx.strokeStyle = '#00000018'; for (let x = -330; x < 330; x += 66) { ctx.beginPath(); ctx.moveTo(x + offsetX, -204 + offsetY); ctx.lineTo(x + offsetX, 240 + offsetY); ctx.stroke(); }
    // Portes des chambres d'amis (en bas), chambre principale à l'est, petite chambre au bout à l'ouest.
    for (const dx of [-210, -90, 30]) { rect(dx, 232, 44, 8, '#8a7a62'); }
    rect(250, 232, 60, 8, '#6a5a48');
    rect(-318, 232, 44, 8, ch6.doorAjar ? '#e8dcc0' : '#8a7a62');
    if (ch6.doorAjar) rect(-318, 226, 12, 14, '#2a2118');          // la porte entrouverte d'un travers de main
    if (ch6.boxPlaced) { rect(34, 200, 34, 22, '#8c7556'); rect(34, 200, 34, 5, '#a8906c'); }   // la boîte posée sur la commode
    const t = mirrorNow(), g = ctx.createLinearGradient(0, -230 + offsetY, 0, -100 + offsetY);
    g.addColorStop(0, `rgba(255, 170, 90, ${.28 + .04 * Math.sin(t)})`); g.addColorStop(1, 'rgba(255, 170, 90, 0)');
    ctx.fillStyle = g; ctx.fillRect(-330 + offsetX, -230 + offsetY, 660, 130);
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4) fill('#14121a', 0, 0, w, h);
    else if (wall.kind === 'baie') { fill('#26304a', 0, 0, w, h); for (let i = 0; i < 12; i++) fill('#e8a96a', 20 + i * 52, 8, 30, 3); }          // le lac et le ciel qui tourne à l'orange
    else if (wall.kind === 'cuisine-i') { fill('#00000030', 3, 4, w, h); fill('#ece7dc', 0, 0, w, h); fill('#bdb6a6', 0, h - 8, w, 8); }
    else if (wall.kind === 'canape-i') { fill('#00000033', 3, 5, w, h); fill('#a9a190', 0, 0, w, h); fill('#bdb5a3', 0, 0, w, 8); }
    else if (wall.kind === 'marbre') { fill('#00000033', 3, 4, w, h); fill('#e6e2da', 0, 0, w, h); fill('#c9c4b8', 6, 6, w - 12, 4); }
    else if (wall.kind === 'cloison-i') { fill('#e3ddcf', 0, 0, w, h); fill('#bdb6a6', 0, h - 4, w, 4); }
    ctx.restore();
  }
};
