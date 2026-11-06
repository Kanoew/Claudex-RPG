'use strict';

// Petits textes qui montent au-dessus d'un personnage (« +0 XP », « +1 objet ») : ils remplacent la narration des gains.
// Ils vivent 1,4 s, montent et s'effacent ; la cible est Yarden (player) ou un acteur de scène (lu à chaque image).
const popups = [];
const popupColors = { xp: '#cdb8ff', loot: '#e8b98a' };

function popText(target, text, kind = 'xp') {
  if (!target) return;
  popups.push({ target, text, color: popupColors[kind] || '#ffffff', start: mirrorNow() });
}

function drawPopups(offsetX, offsetY) {
  const now = mirrorNow();
  for (let i = popups.length - 1; i >= 0; i--) {
    const pop = popups[i], age = now - pop.start;
    if (age > 1.4) { popups.splice(i, 1); continue; }
    const x = pop.target.x + offsetX, y = pop.target.y + offsetY - 70 - age * 26;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, (1.4 - age) / .4));
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 3; ctx.strokeStyle = '#0b0816cc';
    ctx.strokeText(pop.text, x, y);
    ctx.fillStyle = pop.color;
    ctx.fillText(pop.text, x, y);
    ctx.restore();
  }
}

function resetPopups() { popups.length = 0; }
