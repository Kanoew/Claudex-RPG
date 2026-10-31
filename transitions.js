'use strict';

// Une seule image de la vue quittée, réutilisée pour le fondu : jamais de remise à zéro du Canvas de jeu.
// Les commandes restent actives : les passages rapides n'exigent ni de relâcher le pouce, ni de réappuyer.
const zoneTransition = { image: null, duration: .4, title: '', remaining: 0, visited: new Set() };

function beginZoneTransition(id) {
  const repeated = zoneTransition.visited.has(id);
  zoneTransition.visited.add(id);
  zoneTransition.duration = repeated ? .18 : .4;
  zoneFade = zoneTransition.duration;
  zoneTransition.title = zones[id].title;
  zoneTransition.remaining = 1.25;
  if (typeof document.createElement !== 'function' || !canvas.width || !canvas.height) return;
  if (!zoneTransition.image) zoneTransition.image = document.createElement('canvas');
  const image = zoneTransition.image;
  if (image.width !== canvas.width) image.width = canvas.width;
  if (image.height !== canvas.height) image.height = canvas.height;
  const context = image.getContext('2d');
  context.clearRect(0, 0, image.width, image.height);
  context.drawImage(canvas, 0, 0);
}

function tickZoneTransition(seconds) {
  zoneFade = Math.max(0, zoneFade - seconds);
  zoneTransition.remaining = Math.max(0, zoneTransition.remaining - seconds);
}

function resetZoneTransition() {
  zoneFade = 0;
  zoneTransition.remaining = 0;
  zoneTransition.image = null;
  zoneTransition.visited.clear();
}

function drawZoneTransition() {
  // Les plans narratifs ont leur propre mise en scène et leur propre texte.
  if (scene.mirror || scene.metro || scene.card || scene.dark) return;
  ctx.save();
  if (zoneFade > 0) {
    const alpha = Math.min(1, zoneFade / zoneTransition.duration);
    if (zoneTransition.image) {
      ctx.globalAlpha = alpha;
      ctx.drawImage(zoneTransition.image, 0, 0, width, height);
      ctx.globalAlpha = 1;
    } else {
      // Secours sans capture : la scène dessinée reste toujours visible.
      ctx.fillStyle = `rgba(14, 15, 25, ${alpha * .35})`;
      ctx.fillRect(0, 0, width, height);
    }
  }
  if (zoneTransition.remaining > 0 && !story.active && !scene.active && !menu.open && !stats.open) {
    ctx.globalAlpha = Math.min(1, zoneTransition.remaining / .25, (1.25 - zoneTransition.remaining) / .1);
    ctx.font = '600 14px system-ui';
    ctx.textAlign = 'center';
    const labelWidth = Math.min(width - 24, 370);
    ctx.fillStyle = '#171020e8';
    ctx.fillRect((width - labelWidth) / 2, height - 44, labelWidth, 32);
    ctx.fillStyle = '#e6d4fa';
    ctx.fillText(zoneTransition.title, width / 2, height - 23, labelWidth - 16);
  }
  ctx.restore();
}
