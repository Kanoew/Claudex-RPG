'use strict';

// Décor du chapitre 4 : le square de la rupture. Dessiné en code, plan inventé à minima.
themeDrawers.square = {
  tint: ['#1a244000', '#1a244018', '#0a0a1c70'],
  floor(offsetX, offsetY) {
    const rect = ch2bRect(offsetX, offsetY);
    rect(-300, -230, 600, 450, '#4d5148');
    rect(-300, -130, 600, 40, '#9d978a');                  // trottoir devant l'immeuble
    rect(-300, -90, 600, 310, '#5d6a52');                  // pelouse du square
    rect(-20, -90, 40, 310, '#a9a394');                    // allée centrale
    rect(-300, 130, 600, 90, '#a9a394');                   // allée du bas
    ctx.strokeStyle = '#00000022'; ctx.lineWidth = 1;
    for (let x = -300; x < 300; x += 40) { ctx.beginPath(); ctx.moveTo(x + offsetX, 130 + offsetY); ctx.lineTo(x + offsetX, 220 + offsetY); ctx.stroke(); }
    // La rupture : une déchirure bleu-noir qui claque d'un coup, puis reste ouverte.
    if (ch4.tearAt) {
      const t = mirrorNow() - ch4.tearAt, x = offsetX, y = -110 + offsetY;
      const flash = Math.max(0, 1 - t / .5);
      if (flash > 0) { ctx.fillStyle = `rgba(150, 190, 255, ${.55 * flash})`; ctx.fillRect(-300 + offsetX, -230 + offsetY, 600, 450); }
      const open = Math.min(1, t / .25);
      ctx.save();
      const glow = ctx.createRadialGradient(x, y - 4, 6, x, y - 4, 130 * open);
      glow.addColorStop(0, 'rgba(60, 130, 255, .5)'); glow.addColorStop(1, 'rgba(60, 130, 255, 0)');
      ctx.fillStyle = glow; ctx.fillRect(x - 130, y - 130, 260, 260);
      // Déchirure irrégulière, large en son milieu, qui s'ouvre d'un coup.
      const pts = [[-6, -78], [14, -52], [-18, -34], [30, -14], [-34, 6], [24, 26], [-12, 46], [10, 70], [-4, 84], [-26, 40], [-8, 18], [-42, -8], [-14, -30], [-30, -56]];
      ctx.fillStyle = '#02040b'; ctx.strokeStyle = '#3a86ff'; ctx.lineWidth = 3;
      ctx.beginPath();
      pts.forEach(([px, py], i) => { const wob = Math.sin(mirrorNow() * 6 + i) * 1.5; if (i === 0) ctx.moveTo(x + px * open + wob, y + py * open); else ctx.lineTo(x + px * open + wob, y + py * open); });
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#a8ccff'; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }
  },
  solid(wall, x, y, index) {
    const fill = ch2bFill(x, y), w = wall.width, h = wall.height;
    ctx.save();
    if (index < 4) fill('#15161c', 0, 0, w, h);
    else if (wall.kind === 'immeuble-sq') {
      fill('#bfb49a', 0, 0, w, h); fill('#a39a82', 0, h - 10, w, 10);
      for (let i = 0; i < 9; i++) {
        const wx = 24 + i * 64;
        fill('#4a4a52', wx - 3, 12, 40, 34); fill(i === 3 ? '#f3e2a8' : '#3a3f4e', wx, 16, 34, 26);   // la fenêtre allumée du 2e étage
        fill('#4a4a52', wx - 3, 58, 40, 34); fill('#3a3f4e', wx, 62, 34, 26);
      }
    } else if (wall.kind === 'lampadaire') {
      fill('#00000033', 3, 4, w, h); fill('#2f3138', 4, 0, 6, h);
      if (ch4.broken) { ctx.fillStyle = '#dfe8ff'; for (let i = 0; i < 8; i++) ctx.fillRect(x - 10 + (i * 11) % 36, y + 12 + (i * 7) % 18, 2, 2); }
      else fill('#ffe9a8', 2, -4, 10, 6);
    } else if (wall.kind === 'banc') {
      fill('#00000033', 3, 5, w, h); fill('#6b4a2e', 0, 0, w, 10); fill('#8a6440', 0, 0, w, 3); fill('#2f3138', 4, 10, 6, 12); fill('#2f3138', w - 10, 10, 6, 12);
    } else if (wall.kind === 'arbre') {
      fill('#00000033', 3, 5, w, h); fill('#5a3d28', 13, 14, 8, 20); fill('#3f6b3a', -8, -10, 50, 38); fill('#4f7f45', 0, -6, 34, 26);
    }
    ctx.restore();
  }
};
