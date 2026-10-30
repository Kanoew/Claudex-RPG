'use strict';

// La nuit : écran sombre pendant que Yarden et Tiamat parlent dans le noir, puis la lueur violette des tatouages (vecteur de la faux).
// Dessins en code : une lueur qui pulse et l'image de la faux, sans nouvelle image.
function drawSceneNight() {
  const now = mirrorNow();
  if (scene.dark) {
    ctx.save();
    ctx.globalAlpha = Math.min(.92, (now - scene.dark.start) / .8);
    ctx.fillStyle = '#05040c';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
  if (!scene.tattoo) return;
  const t = now - scene.tattoo.start, fade = Math.min(1, t / .8), pulse = .6 + .4 * Math.sin(t * 3.2);
  const cx = width / 2, cy = height * .58;
  ctx.save();
  const glow = ctx.createRadialGradient(cx, cy, 6, cx, cy, Math.min(width, height) * .42);
  glow.addColorStop(0, `rgba(185, 150, 255, ${.85 * pulse * fade})`);
  glow.addColorStop(1, 'rgba(120, 80, 220, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  // Plumes : de fins traits courbes qui s'allument autour de la faux.
  ctx.strokeStyle = `rgba(222, 205, 255, ${.8 * fade * pulse})`;
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i++) {
    const angle = -1.1 + i * .36, r = 70 + (i % 2) * 14;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r * .55, cy + 40 + Math.sin(angle) * r * .3);
    ctx.quadraticCurveTo(cx + Math.cos(angle) * r, cy + 20 - 24, cx + Math.cos(angle) * r * 1.15, cy - 40 + Math.sin(angle) * 20);
    ctx.stroke();
  }
  ctx.globalAlpha = fade;
  if (weaponArt.glow) ctx.drawImage(weaponArt.glow, (Math.floor(t * 1000 / 180) % 4) * 128, 0, 128, 128, cx - 96, cy - 120, 192, 192);
  ctx.restore();
}
