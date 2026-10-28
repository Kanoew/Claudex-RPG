'use strict';

// Deux silhouettes humaines provisoires. Les identités et dialogues restent des
// données à fournir ; elles ne donnent aucune quête et ne voient pas la faille.
function drawNpcs(offsetX, offsetY) {
  for (const npc of currentZone.npcs || []) {
    const x = npc.x + offsetX, y = npc.y + offsetY;
    ctx.save();
    ctx.fillStyle = '#00000055';
    ctx.beginPath(); ctx.ellipse(x, y + 12, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#242632';
    ctx.fillRect(x - 9, y - 3, 7, 17); ctx.fillRect(x + 2, y - 3, 7, 17);
    ctx.fillStyle = npc.coat;
    roundedRectPath(x - 12, y - 25, 24, 25, 5); ctx.fill();
    ctx.fillStyle = npc.hair;
    ctx.beginPath(); ctx.arc(x, y - 35, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d0a991';
    ctx.beginPath(); ctx.ellipse(x + 1, y - 32, 8, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = npc.hair;
    ctx.fillRect(x - 9, y - 43, 18, 8);
    ctx.fillStyle = '#e3dece';
    ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(npc.name, x, y - 52);
    ctx.restore();
  }
}
