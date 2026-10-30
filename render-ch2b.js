'use strict';

// Décors du chapitre 2 (le lendemain matin) : l'impasse, le run en Abysse, la rue Marterey, le comptoir de Rémi, le 4B et son escalier.
// Tout est dessiné en code, dans des rectangles qui suivent les collisions. Plans, couleurs et détails sont inventés à minima ;
// les éléments canon sont dans PROJECT.md (sections 27 à 29).
const ch2b = { shutterAt: 0, slate: '', buff: false, paperStillAt: 0, riftAt: 0, goalText: '' };

function ch2bRect(offsetX, offsetY) {
  return (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x + offsetX, y + offsetY, w, h); };
}

function ch2bFill(x, y) {
  return (color, ox, oy, w, h) => { ctx.fillStyle = color; ctx.fillRect(x + ox, y + oy, w, h); };
}

// ---------- Impasse ----------
themeDrawers.impasse = {
  tint: ['#00000000', '#00000010', '#0a0a1430'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-170, -200, 340, 360, '#55535a');
    ctx.strokeStyle = '#00000030'; ctx.lineWidth = 1;
    for (let x = -170; x < 170; x += 34) { ctx.beginPath(); ctx.moveTo(x + offsetX, -200 + offsetY); ctx.lineTo(x + offsetX, 160 + offsetY); ctx.stroke(); }
    rect(-170, -90, 340, 8, '#6b6a72');
    // Le rectangle d'air distordu : presque invisible en plein jour, juste un léger tremblement.
    const t = mirrorNow(), x0 = 18 + offsetX, y0 = -190 + offsetY;
    // Avant la révélation, le tremblement est à peine visible ; ensuite la faille s'ouvre, violette, en un peu plus d'une seconde.
    const open = ch2b.riftAt ? Math.min(1, (t - ch2b.riftAt) / 1.2) : 0;
    if (open > 0) {
      const gx = x0 + 23, gy = y0 + 48, glow = ctx.createRadialGradient(gx, gy, 4, gx, gy, 20 + 70 * open);
      glow.addColorStop(0, `rgba(190, 150, 255, ${.55 * open})`); glow.addColorStop(1, 'rgba(190, 150, 255, 0)');
      ctx.fillStyle = glow; ctx.fillRect(gx - 100, gy - 100, 200, 200);
      ctx.fillStyle = `rgba(60, 30, 120, ${.5 * open})`; ctx.fillRect(x0 - 2, y0, 50, 96 * open);
    }
    ctx.save();
    ctx.globalAlpha = .08 + .04 * Math.sin(t * 2.4) + .7 * open;
    ctx.strokeStyle = open ? '#d8c2ff' : '#dfe8ff'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) { const yy = y0 + i * 12, wob = Math.sin(t * 3 + i) * 2; ctx.lineTo(x0 + wob, yy); }
    for (let i = 8; i >= 0; i--) { const yy = y0 + i * 12, wob = Math.sin(t * 3 + i + 2) * 2; ctx.lineTo(x0 + 46 + wob, yy); }
    ctx.closePath(); ctx.stroke();
    ctx.restore();
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4 || wall.kind === 'mur') { fill('#7a4a3a', 0, 0, w, h); fill('#5e3a2e', 0, h - 6, w, 6); }
    else if (wall.kind === 'pressing') {
      fill('#8f8a80', 0, 0, w, h); fill('#6e6a62', 0, h - 8, w, 8);
      fill('#a8a49a', 14, 40, w - 28, h - 48);
      for (let i = 0; i < 9; i++) fill('#8d897f', 14, 44 + i * 7, w - 28, 2);
      fill('#3a3a44', 14, 10, w - 28, 22); ctx.fillStyle = '#d9d4c4'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText('PRESSING · FERMÉ', x + w / 2, y + 26);
    } else if (wall.kind === 'poubelles') { fill('#00000030', 4, 4, w, h); fill('#3f5a45', 0, 0, 24, h); fill('#4a6a52', 28, 8, 24, h - 8); }
    else if (wall.kind === 'velo') { fill('#00000030', 3, 3, w, h); ctx.strokeStyle = '#8a8a90'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + 14, y + 16, 11, 0, Math.PI * 2); ctx.arc(x + 14, y + 52, 11, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }
};

// ---------- Run en Abysse : roche sèche, lumière ocre, poussière en suspension ----------
themeDrawers.ocre = {
  tint: ['#1c3a1000', '#1c3a1024', '#12220aa0'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-470, -300, 940, 720, '#56522e');
    ctx.strokeStyle = '#00000026'; ctx.lineWidth = 1;
    for (let x = -470; x < 470; x += 64) { ctx.beginPath(); ctx.moveTo(x + offsetX, -300 + offsetY); ctx.lineTo(x + offsetX + 20, 420 + offsetY); ctx.stroke(); }
    for (let y = -300; y < 420; y += 72) { ctx.beginPath(); ctx.moveTo(-470 + offsetX, y + offsetY); ctx.lineTo(470 + offsetX, y + offsetY + 12); ctx.stroke(); }
    // Poussière chaude qui flotte : l'élément d'ambiance.
    const t = mirrorNow();
    ctx.fillStyle = '#e4efa8';
    for (let i = 0; i < 46; i++) {
      const px = -470 + ((i * 97 + t * (6 + i % 5)) % 940), py = -300 + ((i * 53 + Math.sin(t * .5 + i) * 18 + 720) % 720);
      ctx.globalAlpha = .12 + .1 * Math.sin(t + i);
      ctx.fillRect(px + offsetX, py + offsetY, 2, 2);
    }
    ctx.globalAlpha = 1;
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (wall.kind === 'pilier') {
      fill('#00000040', 5, 7, w, h);
      fill('#6b6a3c', 0, 0, w, h); fill('#8a8a4e', 4, 4, w - 8, 10); fill('#3f3f22', 0, h - 8, w, 8);
      ctx.strokeStyle = '#3f3f22'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 14, y + 16); ctx.lineTo(x + 22, y + h - 14); ctx.stroke();
    } else {
      fill('#2f3220', 0, 0, w, h); fill('#3c4128', 0, 0, w, Math.min(10, h)); fill('#1d200f', 0, h - 6, w, 6);
      ctx.strokeStyle = '#2a190d'; ctx.lineWidth = 2;
      for (let i = 0; i < Math.min(5, w / 50); i++) { ctx.beginPath(); ctx.moveTo(x + 14 + i * 56, y + 14); ctx.lineTo(x + 30 + i * 56, y + Math.min(h - 10, 60)); ctx.stroke(); }
    }
    ctx.restore();
  }
};

// ---------- Rue Marterey ----------
function marterey(solid, x, y, wall) {
  const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
  if (wall.kind === 'kebab') {
    fill('#a8553a', 0, 0, w, h); fill('#7a3a28', 0, h - 8, w, 8);
    fill('#2a2020', 14, 12, w - 28, 22); ctx.fillStyle = '#ffd36b'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText('KEBAB', x + w / 2, y + 28);
    // Le rideau métallique se relève quand le kebab ouvre.
    const open = Math.min(1, (mirrorNow() - ch2b.shutterAt) / 1.6), closed = ch2b.shutterAt === 0 ? 1 : 1 - open;
    fill('#1a1612', 14, 42, w - 28, h - 52);
    fill('#9a9aa2', 14, 42, w - 28, (h - 52) * closed);
    ctx.strokeStyle = '#7d7d86'; ctx.lineWidth = 1;
    for (let i = 0; i < 8 * closed; i++) { ctx.beginPath(); ctx.moveTo(x + 14, y + 46 + i * 7); ctx.lineTo(x + w - 14, y + 46 + i * 7); ctx.stroke(); }
  } else if (wall.kind === 'porte-marron') {
    fill('#b9a68a', 0, 0, w, h); fill('#8f7e66', 0, h - 8, w, 8);
    fill('#4a2f1c', 36, 16, 48, h - 16); fill('#6a4429', 40, 20, 40, h - 22); fill('#d9b24a', 74, 70, 4, 4);
    fill('#2a2a30', 92, 56, 14, 22); fill('#8a8a90', 95, 60, 8, 6); fill('#8a8a90', 95, 69, 8, 6);
  } else if (wall.kind === 'laverie') {
    fill('#c9d3d6', 0, 0, w, h); fill('#8fa2a8', 0, h - 8, w, 8);
    fill('#2a3a42', 14, 12, w - 28, 22); ctx.fillStyle = '#9fe0ff'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText('LAVERIE', x + w / 2, y + 28);
    fill('#1b262c', 14, 42, w - 28, h - 52); for (let i = 0; i < 3; i++) { ctx.fillStyle = '#4a6a78'; ctx.beginPath(); ctx.arc(x + 44 + i * 48, y + 76, 16, 0, Math.PI * 2); ctx.fill(); }
  }
}
themeDrawers.marterey = {
  tint: ['#00000000', '#00000012', '#0a0a1430'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-260, -180, 520, 340, '#4a4a52');
    rect(-260, -70, 520, 52, '#8a8478');
    ctx.strokeStyle = '#00000028'; for (let x = -260; x < 260; x += 40) { ctx.beginPath(); ctx.moveTo(x + offsetX, -70 + offsetY); ctx.lineTo(x + offsetX, -18 + offsetY); ctx.stroke(); }
    rect(-260, -20, 520, 5, '#a9a397');
    ctx.fillStyle = '#e8dfb8aa'; for (let x = -240; x < 240; x += 80) ctx.fillRect(x + offsetX, 100 + offsetY, 40, 4);
  },
  solid(wall, x, y, index) { ctx.save(); if (index < 4) { ctx.fillStyle = '#2a2a30'; ctx.fillRect(x, y, wall.width, wall.height); } else marterey(null, x, y, wall); ctx.restore(); }
};

// ---------- Comptoir de Rémi ----------
themeDrawers.comptoir = {
  tint: ['#2a160a00', '#2a160a1c', '#1a0e0888'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-160, -200, 320, 420, '#3a2c24');
    ctx.strokeStyle = '#00000030'; for (let y = -200; y < 220; y += 24) { ctx.beginPath(); ctx.moveTo(-160 + offsetX, y + offsetY); ctx.lineTo(160 + offsetX, y + offsetY); ctx.stroke(); }
    // L'ardoise à la craie, accrochée au mur du fond.
    rect(-60, -196, 120, 54, '#1f2a26'); rect(-62, -198, 124, 4, '#7a5a38'); rect(-62, -146, 124, 4, '#7a5a38');
    if (ch2b.slate) { ctx.fillStyle = '#f2efe4'; ctx.font = 'bold 22px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText(ch2b.slate, offsetX, -160 + offsetY); }
    // Une lampe à spectre particulier au-dessus du comptoir.
    const t = mirrorNow(), glow = ctx.createRadialGradient(offsetX, -85 + offsetY, 6, offsetX, -85 + offsetY, 120);
    glow.addColorStop(0, `rgba(190, 255, 214, ${.3 + .05 * Math.sin(t * 2)})`); glow.addColorStop(1, 'rgba(190, 255, 214, 0)');
    ctx.fillStyle = glow; ctx.fillRect(-140 + offsetX, -200 + offsetY, 280, 260);
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4) fill('#15100c', 0, 0, w, h);
    else if (wall.kind === 'mur-int') { fill('#5a4636', 0, 0, w, h); fill('#6e5744', 0, 0, w, 8); }
    else if (wall.kind === 'comptoir-remi') {
      fill('#00000040', 4, 6, w, h); fill('#6b4a2e', 0, 0, w, h); fill('#8a6440', 0, 0, w, 10);
      fill('#c9d4cc', 20, 12, 14, 14); fill('#9fe3b8', 96, 8, 12, 18); fill('#cfcfd6', 160, 10, 30, 8); fill('#8a8a90', 170, 18, 10, 8);
    }
    ctx.restore();
  }
};

// ---------- Sous-gare : l'immeuble « trop normal » ----------
themeDrawers.sousgare = {
  tint: ['#00000000', '#00000012', '#0a0a1438'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-260, -330, 520, 510, '#4d4d55');
    rect(-260, -70, 520, 60, '#a8a296');
    ctx.strokeStyle = '#00000022'; for (let x = -260; x < 260; x += 52) { ctx.beginPath(); ctx.moveTo(x + offsetX, -70 + offsetY); ctx.lineTo(x + offsetX, -10 + offsetY); ctx.stroke(); }
    rect(-260, -10, 520, 6, '#c2bcae');
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4) fill('#15131a', 0, 0, w, h);
    else {
      // Façade impeccable de quatre étages : pierre crème, fenêtres alignées, géraniums rouges au deuxième étage, porte et digicode.
      fill('#e3d9c0', 0, 0, w, h); fill('#c9bea2', 0, h - 12, w, 12); fill('#f1e9d4', 0, 0, w, 8);
      const floorH = 62;
      for (let f = 0; f < 4; f++) {
        const fy = h - 12 - (f + 1) * floorH + 8 + (f === 0 ? 0 : 0);   // f = 0 : rez ; 1 : premier ; 2 : deuxième ; 3 : troisième
        fill('#d2c7aa', 0, fy + floorH - 8, w, 4);                         // corniche entre les étages
        for (let i = 0; i < 6; i++) {
          const wx = 26 + i * 84; if (f === 0 && wx > 220 && wx < 300) continue;
          if (f === 0) { fill('#4a4a52', wx - 3, fy + 8, 44, 38); fill('#6c6f78', wx, fy + 12, 38, 30); continue; }
          fill('#4a4a52', wx - 3, fy + 6, 44, 46); fill('#f3e2a8', wx, fy + 10, 38, 38); fill('#4a4a52', wx + 18, fy + 10, 2, 38);
          if (f === 2) { fill('#3f6b3a', wx - 5, fy + 44, 48, 9); for (let j = 0; j < 6; j++) fill('#d9304a', wx - 3 + j * 8, fy + 39, 5, 6); }
        }
      }
      const doorY = h - 12 - 88;
      fill('#3a3a42', 238, doorY, 44, 88); fill('#55555f', 242, doorY + 4, 36, 84); fill('#d9b24a', 270, doorY + 46, 4, 4);
      fill('#22222a', 296, doorY + 30, 14, 24); fill('#8a8a95', 299, doorY + 34, 8, 4); fill('#8a8a95', 299, doorY + 41, 8, 4); fill('#8a8a95', 299, doorY + 48, 8, 4);
    }
    ctx.restore();
  }
};

// ---------- La cour : pavés, lierre taillé, deux arbustes symétriques ----------
themeDrawers.cour = {
  tint: ['#00000000', '#00000018', '#0a0a1458'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-140, -200, 280, 380, '#6a6a70');
    ctx.strokeStyle = '#00000030'; ctx.lineWidth = 1;
    for (let y = -200; y < 180; y += 20) { ctx.beginPath(); ctx.moveTo(-140 + offsetX, y + offsetY); ctx.lineTo(140 + offsetX, y + offsetY); ctx.stroke(); }
    for (let x = -140; x < 140; x += 20) { ctx.beginPath(); ctx.moveTo(x + offsetX, -200 + offsetY); ctx.lineTo(x + offsetX, 180 + offsetY); ctx.stroke(); }
    // La porte de l'escalier, au fond.
    rect(-24, -200, 48, 12, '#2a2118'); rect(-20, -198, 40, 10, '#ffcf8a');
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4) fill('#15131a', 0, 0, w, h);
    else if (wall.kind === 'lierre') { fill('#2f4f2a', 0, 0, w, h); ctx.strokeStyle = '#3f6b3a'; ctx.lineWidth = 2; for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.moveTo(x, y + i * 21); ctx.lineTo(x + w, y + i * 21 + 4); ctx.stroke(); } }
    else if (wall.kind === 'arbuste') { fill('#00000030', 3, 5, w, h); ctx.fillStyle = '#3f6b3a'; ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, w * .5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#4f8248'; ctx.beginPath(); ctx.arc(x + w / 2 - 4, y + h / 2 - 4, w * .28, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
};

// ---------- Le 4B : papier punaisé en couches, étagères, bocaux, crânes alignés ----------
themeDrawers.quatreb = {
  tint: ['#2a160a00', '#2a160a22', '#1a0e0899'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-190, -250, 380, 420, '#4a3426');
    ctx.strokeStyle = '#00000030';
    for (let y = -250; y < 170; y += 22) { ctx.beginPath(); ctx.moveTo(-190 + offsetX, y + offsetY); ctx.lineTo(190 + offsetX, y + offsetY); ctx.stroke(); }
    // Un tapis usé devant la table de travail.
    rect(-70, -90, 140, 130, '#5a3a30'); rect(-64, -84, 128, 118, '#6a4638');
    // Chaleur d'une lampe : l'appartement est domestique, jamais sinistre en lumière.
    const t = mirrorNow(), glow = ctx.createRadialGradient(offsetX, -110 + offsetY, 10, offsetX, -110 + offsetY, 230);
    glow.addColorStop(0, `rgba(255, 207, 138, ${.34 + .04 * Math.sin(t * 1.4)})`); glow.addColorStop(1, 'rgba(255, 207, 138, 0)');
    ctx.fillStyle = glow; ctx.fillRect(-190 + offsetX, -250 + offsetY, 380, 420);
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4) fill('#1a120c', 0, 0, w, h);
    else if (wall.kind === 'papier') {
      fill('#6a5a44', 0, 0, w, h);
      // Le papier bruisse dans les murs ; quand Tiamat parle, il s'immobilise d'un coup, comme un cœur qui saute un battement.
      const now = mirrorNow(), age = ch2b.paperStillAt ? now - ch2b.paperStillAt : -1;
      const amp = age < 0 ? 1 : Math.max(0, 1 - age / .35);
      // Documents punaisés en couches : feuilles jaunies, tampons rouges, lignes d'écritures inconnues.
      for (let i = 0; i < 34; i++) {
        const px = (i * 53) % (w - 30) + Math.sin(now * 3.1 + i * 1.3) * 1.6 * amp, py = ((i * 29) % (h - 18)) + Math.cos(now * 2.4 + i * 1.9) * 1.1 * amp, pw = 22 + (i * 7) % 18, ph = 16 + (i * 11) % 14;
        fill(i % 3 === 0 ? '#d9c79a' : i % 3 === 1 ? '#c8b585' : '#e3d6ae', px, py, pw, ph);
        ctx.strokeStyle = '#5a4a30'; ctx.lineWidth = 1;
        for (let l = 0; l < 3; l++) { ctx.beginPath(); ctx.moveTo(x + px + 3, y + py + 4 + l * 4); ctx.lineTo(x + px + pw - 3 - (l * i) % 6, y + py + 4 + l * 4); ctx.stroke(); }
        if (i % 5 === 0) fill('#a8483c', px + pw - 8, py + ph - 8, 6, 6);
      }
      if (age >= 0 && age < .9) fill(`rgba(170, 140, 255, ${.42 * (1 - age / .9)})`, 0, 0, w, h);
    } else if (wall.kind === 'etagere') {
      fill('#3b2a1c', 0, 0, w, h);
      const left = x < 0;
      for (let row = 0; row < 6; row++) {
        const ry = 10 + row * 54;
        fill('#2a1c12', 0, ry + 40, w, 6);
        for (let k = 0; k < 2; k++) {
          const cx = x + (left ? 28 : 14) + k * 0, cy = y + ry + 22;
          if (row % 2 === 0) {
            // Crâne propre, tourné vers la pièce comme un public patient.
            ctx.fillStyle = '#e8e1d0'; ctx.beginPath(); ctx.ellipse(cx, cy - k * 0, 11, 12, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#2a1c12'; ctx.fillRect(cx - 6, cy - 3, 4, 5); ctx.fillRect(cx + 2, cy - 3, 4, 5); ctx.fillRect(cx - 3, cy + 5, 6, 4);
            break;
          }
          // Bocaux : des choses qui ont été vivantes.
          ctx.fillStyle = k ? '#7a8f5a99' : '#b98a4a99'; ctx.fillRect(x + 8 + k * 18, y + ry + 10, 14, 28);
          ctx.fillStyle = '#d8d0b0'; ctx.fillRect(x + 8 + k * 18, y + ry + 8, 14, 4);
        }
      }
    } else if (wall.kind === 'bureau') {
      fill('#00000033', 4, 6, w, h); fill('#4a3020', 0, 0, w, h); fill('#6b4a2e', 0, 0, w, 8);
      fill('#101014', 10, 12, 8, 12); fill('#101014', w - 22, 14, 8, 10);
    }
    ctx.restore();
  }
};

// ---------- L'escalier : marches de pierre creusées au centre ; l'air s'alourdit à chaque étage ----------
themeDrawers.escalier = {
  tint: ['#00000000', '#0a081410', '#0a0814a0'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-90, -640, 180, 900, '#3a3733');
    // Chaque marche : le dessus (clair), son arête qui accroche la lumière, puis la contremarche dans l'ombre.
    for (let y = -640; y < 260; y += 22) {
      rect(-70, y, 140, 13, '#8c8782');           // dessus
      rect(-70, y, 140, 2, '#b3aea8');            // arête éclairée
      rect(-70, y + 13, 140, 9, '#4d4945');       // contremarche
      rect(-70, y + 19, 140, 3, '#2f2c29');       // ombre portée
      rect(-34, y + 3, 68, 8, '#767170');         // creux au centre, usé par les pas
    }
    // Paliers : un par étage, une dalle plus large avec une porte sur le côté.
    for (let f = 0; f < 4; f++) {
      const ly = 200 - f * 225;
      rect(-70, ly - 24, 140, 26, '#a39e98'); rect(-70, ly - 24, 140, 3, '#c4bfb9'); rect(-70, ly + 2, 140, 3, '#2f2c29');
      if (f > 0) { rect(-68, ly - 22, 14, 20, '#52412f'); rect(-66, ly - 20, 10, 16, '#6b543b'); }
    }
    // Murs de pierre à gauche, mur et rampe de bois à droite.
    for (let y = -640; y < 260; y += 18) {
      rect(-90, y, 20, 18, y % 36 === 0 ? '#57534e' : '#4a4642'); rect(-90, y, 20, 1, '#2f2c29');
      rect(70, y, 20, 18, y % 36 === 0 ? '#4a4642' : '#57534e'); rect(70, y, 20, 1, '#2f2c29');
    }
    rect(60, -640, 4, 900, '#6b4a2e');
    for (let y = -640; y < 260; y += 22) rect(59, y + 4, 6, 6, '#4f3520');
    // Plus on monte, plus l'air est lourd : voile sombre et violacé qui s'épaissit.
    const progress = Math.max(0, Math.min(1, (200 - player.y) / 820));
    ctx.fillStyle = `rgba(30, 14, 60, ${progress * .5})`;
    ctx.fillRect(-90 + offsetX, -640 + offsetY, 180, 900);
    // La porte du 4B, en haut : lumière chaude.
    rect(-30, -640, 60, 20, '#2a2118');
    const spill = ctx.createLinearGradient(0, -640 + offsetY, 0, -520 + offsetY);
    spill.addColorStop(0, 'rgba(255, 207, 138, .7)'); spill.addColorStop(1, 'rgba(255, 207, 138, 0)');
    ctx.fillStyle = spill; ctx.fillRect(-60 + offsetX, -640 + offsetY, 120, 120);
    rect(-20, -638, 40, 14, '#ffcf8a');
  },
  solid(wall, x, y, index) { ctx.save(); ctx.fillStyle = '#15131a'; ctx.fillRect(x, y, wall.width, wall.height); ctx.restore(); }
};
