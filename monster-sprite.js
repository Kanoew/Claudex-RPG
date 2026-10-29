'use strict';

// Sprites des monstres : une bande par monstre dans assets/monsters/, en cases égales alignées sur
// leur centre de masse (anchor x) et sur le sol (anchor y). Ils sont dessinés tournés vers la gauche :
// on retourne l'image pour la droite, car aucun détail asymétrique n'est canon pour eux (contrairement
// à Yarden). `stand` est leur hauteur debout et `reach` la hauteur poings levés, au même grossissement que les sprites de Yarden.
const monsterClips = {
  // Cases : 0 à 3 marche, 4 annonce de l'attaque (poings levés), 5 coup (poings au sol).
  troll: { cell: [208, 262], anchor: [104, 258], stand: 194, reach: 252, walk: [0, 1, 2, 3], walkSeconds: .13, windup: 4, strike: 5, strikeSeconds: .3 },
  // Gobelin : 4 marche, 5 dague en arrière, 6 coup de dague. Ogre : 4 marche, 5 accroupi poings en arrière, 6 charge.
  goblin: { cell: [130, 94], anchor: [65, 90], stand: 89, reach: 89, walk: [0, 1, 2, 3], walkSeconds: .1, windup: 4, strike: 5, strikeSeconds: .2 },
  ogre: { cell: [170, 127], anchor: [85, 123], stand: 124, reach: 124, walk: [0, 1, 2, 3], walkSeconds: .12, windup: 4, strike: 5, strikeSeconds: .2 },
  spider: { cell: [224, 168], anchor: [112, 158], stand: 125, reach: 125, walk: [0, 1, 2, 3], walkSeconds: .1, windup: 4, strike: 5, hurt: 6, blinded: 7, incapacitated: 8, strikeSeconds: .22 }
};
const monsterArt = { strips: {} };

function loadMonsterArt() {
  if (typeof Image === 'undefined') return;
  for (const name of Object.keys(monsterClips)) {
    const image = new Image();
    image.onload = () => { monsterArt.strips[name] = image; };
    image.onerror = () => { monsterArt.strips[name] = null; };
    image.src = `assets/monsters/${name}.png?v=31`;
  }
}

// Appelée après chaque déplacement d'un monstre : marche, côté regardé et durée du coup.
function updateMonsterSprite(enemy, seconds, moved) {
  const sprite = enemy.sprite;
  sprite.time += seconds;
  sprite.moving = moved > .05;
  sprite.strike = Math.max(0, sprite.strike - seconds);
  // Pendant une charge il regarde sa direction ; sinon il regarde Yarden, avec une marge contre le clignotement.
  const toward = enemy.charge > 0 ? enemy.dirX : player.x - enemy.x;
  if (Math.abs(toward) > 8 || (enemy.charge > 0 && toward !== 0)) sprite.face = toward > 0 ? 1 : -1;
}

function monsterPose(enemy) {
  const clip = monsterClips[enemy.art];
  const strip = monsterArt.strips[enemy.art];
  if (!clip || !strip) return null;
  const sprite = enemy.sprite;
  let frame = clip.walk[0];
  if (enemy.incapacitated) frame = clip.incapacitated;
  else if (enemy.ranged && encounter.phase === 'blinded') frame = clip.blinded;
  else if (enemy.ranged && enemy.flash > 0) frame = clip.hurt;
  else if (enemy.charge > 0 || sprite.strike > 0) frame = clip.strike;
  else if (enemy.windup > 0) frame = clip.windup;
  else if (sprite.moving) frame = clip.walk[Math.floor(sprite.time / clip.walkSeconds) % clip.walk.length];
  return { clip, strip, frame };
}

// Dessine le monstre et renvoie le haut de sa tête à l'écran (pour la barre de vie) ; null si l'image manque.
function drawMonsterSprite(enemy, screenX, screenY) {
  const pose = monsterPose(enemy);
  if (!pose) return null;
  const { clip, strip, frame } = pose;
  const [width, height] = clip.cell;
  const [anchorX, anchorY] = clip.anchor;
  const scale = yardenCell.scale;
  // Les pieds touchent le bas du disque de collision, qui ne change pas.
  const groundY = screenY + enemy.radius;
  ctx.fillStyle = '#00000066';
  ctx.beginPath();
  ctx.ellipse(screenX, groundY - 1, enemy.radius + 6, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Flash blanc quand il est touché ; sans copie teintée possible, l'image reste telle quelle.
  const source = enemy.flash > 0 ? tintedYardenStrip('monster:' + enemy.art, strip, '#ffffff', .75) || strip : strip;
  ctx.save();
  ctx.translate(screenX, 0);
  if (enemy.sprite.face > 0) ctx.scale(-1, 1);
  ctx.drawImage(source, frame * width, 0, width, height, -anchorX * scale, groundY - anchorY * scale, width * scale, height * scale);
  ctx.restore();
  // La barre de vie reste au-dessus des poings levés pendant l'annonce.
  return groundY - (frame === clip.windup ? clip.reach : clip.stand) * scale;
}
