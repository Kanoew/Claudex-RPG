'use strict';

// Sprites de Yarden : bandes PNG de assets/yarden/, cases de 96 × 104, point au sol en (48, 101).
// Les durées reprennent assets/yarden/animations.json. Les bandes de gauche et de droite sont deux
// dessins distincts (gant, tatouages et marque du flanc sont asymétriques) : on ne les retourne jamais.
const yardenCell = { width: 96, height: 104, anchorX: 48, anchorY: 101, scale: .62 };
const yardenClips = {
  idle: [280, 110, 110, 140, 140, 320],
  'running-right': [120, 120, 120, 120, 120, 120, 120, 220],
  'running-left': [120, 120, 120, 120, 120, 120, 120, 220]
};
const yardenArt = { strips: {}, tinted: {} };
const yardenSprite = { clip: 'idle', time: 0, side: 'right' };

function loadYardenArt() {
  if (typeof Image === 'undefined') return;
  for (const name of Object.keys(yardenClips)) {
    const image = new Image();
    image.onload = () => { yardenArt.strips[name] = image; };
    image.onerror = () => { yardenArt.strips[name] = null; };
    image.src = `assets/yarden/${name}.png?v=23`;
  }
}

function yardenFrame(clip, seconds) {
  const durations = yardenClips[clip];
  let left = (seconds * 1000) % durations.reduce((sum, value) => sum + value, 0);
  for (let i = 0; i < durations.length; i++) {
    if (left < durations[i]) return i;
    left -= durations[i];
  }
  return durations.length - 1;
}

// Seule la course latérale existe : en montant ou en descendant, Yarden garde le dernier côté.
function updateYardenSprite(seconds, moveX, moving) {
  if (moveX > .2) yardenSprite.side = 'right';
  else if (moveX < -.2) yardenSprite.side = 'left';
  const clip = moving ? `running-${yardenSprite.side}` : 'idle';
  if (clip !== yardenSprite.clip) {
    // D'un côté de course à l'autre on garde la cadence ; depuis le repos on repart de la première image.
    if (!(clip !== 'idle' && yardenSprite.clip !== 'idle')) yardenSprite.time = 0;
    yardenSprite.clip = clip;
  }
  yardenSprite.time += seconds;
}

// Copie teintée (flash blanc, esquive verte), calculée une seule fois par bande.
function tintedYardenStrip(clip, strip, color, alpha) {
  const key = clip + color;
  if (key in yardenArt.tinted) return yardenArt.tinted[key];
  let copy = null;
  try {
    copy = document.createElement('canvas');
    copy.width = strip.width;
    copy.height = strip.height;
    const copyCtx = copy.getContext('2d');
    copyCtx.drawImage(strip, 0, 0);
    copyCtx.globalCompositeOperation = 'source-atop';
    copyCtx.globalAlpha = alpha;
    copyCtx.fillStyle = color;
    copyCtx.fillRect(0, 0, copy.width, copy.height);
  } catch (error) {
    copy = null;
  }
  yardenArt.tinted[key] = copy;
  return copy;
}

// Dessine Yarden et renvoie le haut du sprite à l'écran ; null si les images manquent (disque de secours).
function drawYardenSprite(screenX, screenY) {
  const clip = yardenSprite.clip;
  const strip = yardenArt.strips[clip];
  if (!strip) return null;
  const { width, height, anchorX, anchorY, scale } = yardenCell;
  // Les pieds touchent le bas du disque de collision, qui ne change pas.
  const groundY = screenY + player.radius;
  const left = screenX - anchorX * scale;
  const top = groundY - anchorY * scale;
  ctx.fillStyle = '#00000066';
  ctx.beginPath();
  ctx.ellipse(screenX, groundY - 1, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  let source = strip;
  let blink = false;
  const tint = dodge.remaining > 0 ? { color: '#8affc1', alpha: .55 } : player.flash > 0 ? { color: '#ffffff', alpha: .85 } : null;
  if (tint) {
    source = tintedYardenStrip(clip, strip, tint.color, tint.alpha);
    // Sans copie teintée possible, le flash devient un clignotement.
    if (!source) { source = strip; blink = tint.color === '#ffffff'; }
  }
  if (blink) ctx.globalAlpha = .45;
  ctx.drawImage(source, yardenFrame(clip, yardenSprite.time) * width, 0, width, height, left, top, width * scale, height * scale);
  ctx.globalAlpha = 1;
  return top;
}
