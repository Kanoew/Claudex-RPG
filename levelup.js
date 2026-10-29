'use strict';

// Montée de niveau à l'arrivée dans la ruelle, à la fin de l'antre : l'Abysse a fait grandir Yarden.
// Gain modeste (jamais abusif) : 5 → 7 PV et 30 → 40 mana, tout remonté. Yarden passe du niveau 1 au niveau 24 (canon de Jordan).
// L'effet est dessiné en formes simples (anneau, colonne de lumière, confettis violets et dorés) ;
// les images de célébration de Jordan pourront le remplacer quand elles seront livrées dans le style de Yarden.
const baseStats = { maxHp: 5, maxMana: 30 };
const levelStats = { maxHp: 7, maxMana: 40 };
// Niveau 24 à l'arrivée dans la ruelle : les monstres de l'antre donnent beaucoup d'expérience (canon de Jordan).
const levelUp = { time: 0, duration: 2.4, active: false, level: 24 };
const levelUpConfetti = [];
(function buildConfetti() {
  let state = 2026;
  const next = () => (state = (state * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const colors = ['#a98cff', '#ffd36b', '#ffffff', '#c5afff'];
  for (let i = 0; i < 34; i++) levelUpConfetti.push({ angle: next() * Math.PI * 2, speed: 50 + next() * 90, rise: 60 + next() * 80, color: colors[i % colors.length], size: 3 + next() * 3 });
})();

function startLevelUp() {
  Object.assign(player, levelStats);
  player.hp = player.maxHp;
  player.mana = player.maxMana;
  Object.assign(levelUp, { time: 0, active: true });
  resetInput();
  updateStatus();
  updateAttackButton();
}

function resetLevelUp() {
  resetStats();
  Object.assign(player, baseStats);
  levelUp.active = false;
  levelUp.time = 0;
}

function updateLevelUp(seconds) {
  if (!levelUp.active) return;
  levelUp.time += seconds;
  if (levelUp.time < levelUp.duration) return;
  levelUp.active = false;
  // Elle ouvre son interface : les points que Tiamat lui a donnés (canon, chapitre 2).
  stats.unlocked = true;
  showStory(['Yarden ouvre son interface. Tiamat y a ajouté des points.'], () => openStats());
}

function drawLevelUp(screenX, screenY) {
  if (!levelUp.active) return;
  const t = levelUp.time, progress = Math.min(1, t / levelUp.duration);
  const fade = progress < .75 ? 1 : (1 - progress) / .25;
  const groundY = screenY + player.radius;
  ctx.save();
  // Colonne de lumière qui monte, puis anneau qui s'élargit au sol.
  const side = ctx.createLinearGradient(screenX - 26, 0, screenX + 26, 0);
  side.addColorStop(0, '#c5afff00');
  side.addColorStop(.5, '#c5afffaa');
  side.addColorStop(1, '#c5afff00');
  ctx.fillStyle = side;
  for (let band = 0; band < 8; band++) {
    ctx.globalAlpha = fade * Math.min(1, t * 3) * (1 - band / 8) * .8;
    ctx.fillRect(screenX - 26, groundY - 22 * (band + 1), 52, 22);
  }
  ctx.strokeStyle = '#e7dcff';
  ctx.lineWidth = 3;
  ctx.globalAlpha = fade * (1 - Math.min(1, t / 1.2));
  ctx.beginPath();
  ctx.ellipse(screenX, groundY - 2, 18 + t * 70, 6 + t * 22, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Confettis qui jaillissent puis retombent.
  ctx.globalAlpha = fade;
  for (const piece of levelUpConfetti) {
    const x = screenX + Math.cos(piece.angle) * piece.speed * t;
    const y = groundY - 30 - piece.rise * t + 120 * t * t + Math.sin(piece.angle) * 10;
    ctx.fillStyle = piece.color;
    ctx.fillRect(x, y, piece.size, piece.size * .7);
  }
  // Message au-dessus de Yarden.
  ctx.globalAlpha = fade * Math.min(1, t * 2.5);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#10141ad9';
  ctx.fillRect(screenX - 96, groundY - 118 - t * 10, 192, 40);
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 14px system-ui';
  ctx.fillText(`NIVEAU ${levelUp.level}`, screenX, groundY - 100 - t * 10);
  ctx.fillStyle = '#e7dcff';
  ctx.font = '11px system-ui';
  ctx.fillText(`+${levelStats.maxHp - baseStats.maxHp} VIE · +${levelStats.maxMana - baseStats.maxMana} MANA`, screenX, groundY - 85 - t * 10);
  ctx.restore();
}
