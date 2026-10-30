'use strict';

// Sprites de Yarden : bandes PNG de assets/yarden/. Chaque bande est une ligne de cases égales ;
// `anchor` est le point au sol dans la case (centre des pieds). Les bandes de gauche et de droite
// sont des dessins distincts (gant, tatouages et marque du flanc sont asymétriques) : on ne les
// retourne jamais. Les durées de course et de repos reprennent assets/yarden/animations.json ;
// les actions (faux, esquive, dégâts, défaite) sont calées sur la durée réelle de l'action de jeu.
const yardenCell = { scale: .62, stand: 101 };
const yardenSmall = { cell: [96, 104], anchor: [48, 101] };
const yardenLarge = { cell: [211, 148], anchor: [105.6, 132] };
const yardenEven = count => Array(count).fill(1);
const yardenClips = {
  idle: { ...yardenSmall, durations: [280, 110, 110, 140, 140, 320] },
  'running-right': { ...yardenSmall, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  'running-left': { ...yardenSmall, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  'walk-down': { ...yardenLarge, durations: Array(8).fill(110) },
  'walk-up': { ...yardenLarge, durations: Array(8).fill(110) },
  // Impact du coup sur les images 4 et 5 : elles restent plus longtemps à l'écran.
  'scythe-right': { ...yardenLarge, anchor: [84.5, 132], weights: [1, 1, 1.2, 1.4, 1.4, 1] },
  'scythe-left': { ...yardenLarge, anchor: [126.7, 132], weights: [1, 1, 1.2, 1.4, 1.4, 1] },
  'dash-right': { ...yardenLarge, weights: yardenEven(6) },
  'dash-left': { ...yardenLarge, weights: yardenEven(6) },
  // Petit saut de joie de la montée de niveau : lecture unique, durées de assets/yarden/celebration (820 ms).
  celebration: { cell: [61, 162], anchor: [30.4, 141], weights: [100, 90, 80, 90, 130, 90, 100, 140] },
  hurt: { ...yardenLarge, weights: yardenEven(6) },
  defeat: { ...yardenLarge, weights: [1, 1, 1, 1, 1.4, 1.8] }
};
const yardenHurtSeconds = .3;
const yardenDefeatSeconds = .8;
const yardenArt = { strips: {}, tinted: {} };
const yardenSprite = { time: 0, side: 'right', axis: 'h', vertical: 'down', moving: false, hurt: 0, defeated: false, defeatTime: 0 };

function loadYardenArt() {
  if (typeof Image === 'undefined') return;
  for (const name of Object.keys(yardenClips)) {
    const image = new Image();
    image.onload = () => { yardenArt.strips[name] = image; };
    image.onerror = () => { yardenArt.strips[name] = null; };
    image.src = `assets/yarden/${name}.png?v=37`;
  }
  // Tenues d'intérieur : un repos de six cases, utilisé pour toutes les poses tant que la tenue est portée.
  for (const name of ['serviette', 'tshirt-short']) {
    const image = new Image();
    image.onload = () => { yardenArt.strips['outfit:' + name] = image; };
    image.onerror = () => { yardenArt.strips['outfit:' + name] = null; };
    image.src = `assets/yarden/${name}-idle.png?v=68`;
    for (const direction of ['left', 'right', 'up', 'down']) {
      const walk = new Image();
      walk.onload = () => { yardenArt.strips[`outfit:${name}:${direction}`] = walk; };
      walk.onerror = () => { yardenArt.strips[`outfit:${name}:${direction}`] = null; };
      walk.src = `assets/yarden/${name}-walk-${direction}.png?v=68`;
    }
  }
}

// Image d'une bande en boucle, d'après le temps écoulé.
function yardenFrame(clip, seconds) {
  const durations = yardenClips[clip].durations;
  let left = (seconds * 1000) % durations.reduce((sum, value) => sum + value, 0);
  for (let i = 0; i < durations.length; i++) {
    if (left < durations[i]) return i;
    left -= durations[i];
  }
  return durations.length - 1;
}

// Image d'une action, d'après son avancement de 0 à 1 ; la dernière image reste affichée à la fin.
function yardenProgressFrame(clip, progress) {
  const weights = yardenClips[clip].weights;
  const target = Math.max(0, Math.min(1, progress)) * weights.reduce((sum, value) => sum + value, 0);
  let passed = 0;
  for (let i = 0; i < weights.length; i++) {
    passed += weights[i];
    if (target < passed) return i;
  }
  return weights.length - 1;
}

// Course latérale ou marche verticale : un petit écart évite de changer d'axe à chaque image
// quand le joystick est proche de la diagonale.
function updateYardenSprite(seconds, moveX, moveY, moving) {
  const ax = Math.abs(moveX), ay = Math.abs(moveY);
  if (ay > ax * 1.25) yardenSprite.axis = 'v';
  else if (ax > ay * 1.25) yardenSprite.axis = 'h';
  if (moveX > .2) yardenSprite.side = 'right';
  else if (moveX < -.2) yardenSprite.side = 'left';
  yardenSprite.vertical = moveY < 0 ? 'up' : moveY > 0 ? 'down' : yardenSprite.vertical;
  yardenSprite.moving = moving;
  tickYardenSprite(seconds);
}

// Seul le temps avance : sert aussi pendant la défaite, quand le reste du jeu est arrêté.
function tickYardenSprite(seconds) {
  yardenSprite.time += seconds;
  yardenSprite.hurt = Math.max(0, yardenSprite.hurt - seconds);
  if (yardenSprite.defeated) yardenSprite.defeatTime += seconds;
}

function playYardenReaction(kind) {
  if (kind === 'defeat') { yardenSprite.defeated = true; yardenSprite.defeatTime = 0; }
  else yardenSprite.hurt = yardenHurtSeconds;
}

function resetYardenSprite() {
  Object.assign(yardenSprite, { time: 0, hurt: 0, defeated: false, defeatTime: 0, moving: false });
}

// Pose à dessiner : la bande, l'image, et le repli choisi si une bande n'a pas pu être chargée.
function yardenPose() {
  const side = direction => direction > .2 ? 'right' : direction < -.2 ? 'left' : yardenSprite.side;
  let wanted, progress = null, fallbacks = [];
  if (yardenSprite.defeated) {
    wanted = 'defeat'; progress = yardenSprite.defeatTime / yardenDefeatSeconds;
  } else if (levelUp.active) {
    wanted = 'celebration'; progress = levelUp.time / .82; fallbacks = ['idle'];
  } else if (dodge.remaining > 0) {
    const s = side(dodge.x);
    wanted = `dash-${s}`; progress = 1 - dodge.remaining / dodge.duration; fallbacks = [`running-${s}`];
  } else if (attack.remaining > 0) {
    wanted = `scythe-${side(Math.cos(attack.angle))}`; progress = 1 - attack.remaining / attack.duration;
  } else if (yardenSprite.hurt > 0) {
    wanted = 'hurt'; progress = 1 - yardenSprite.hurt / yardenHurtSeconds;
  } else if (yardenSprite.moving) {
    wanted = yardenSprite.axis === 'v' && yardenSprite.vertical ? `walk-${yardenSprite.vertical}` : `running-${yardenSprite.side}`;
    fallbacks = [`running-${yardenSprite.side}`];
  } else wanted = 'idle';
  for (const clip of [wanted, ...fallbacks, 'idle']) {
    if (!yardenArt.strips[clip]) continue;
    if (clip === 'defeat' && clip !== wanted) continue;
    const frame = yardenClips[clip].weights && clip === wanted ? yardenProgressFrame(clip, progress) : yardenFrame(clip, yardenSprite.time);
    return { clip, frame };
  }
  return null;
}

function yardenSpriteActive() {
  return yardenPose() !== null;
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

// Yarden en serviette ou en t-shirt gris : repos clignant, sans cycle de marche (aucune bande de marche n'existe pour ces tenues).
function drawYardenOutfit(screenX, screenY, idleStrip) {
  const { cell: [width, height], anchor: [anchorX, anchorY], durations: idleDurations } = yardenClips.idle;
  // En marche : la bande de la direction (quatre cases, 150 ms) ; sinon le repos qui cligne.
  const direction = yardenSprite.axis === 'v' ? (yardenSprite.vertical === 'up' ? 'up' : 'down') : (yardenSprite.side === 'left' ? 'left' : 'right');
  const walk = yardenSprite.moving && yardenArt.strips[`outfit:${yardenOutfit}:${direction}`];
  const strip = walk || idleStrip, durations = walk ? [150, 150, 150, 150] : idleDurations;
  const { scale, stand } = yardenCell;
  const groundY = screenY + player.radius;
  ctx.fillStyle = '#00000066';
  ctx.beginPath();
  ctx.ellipse(screenX, groundY - 1, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  let left = (mirrorNow() * 1000) % durations.reduce((sum, value) => sum + value, 0), frame = durations.length - 1;
  for (let i = 0; i < durations.length; i++) { if (left < durations[i]) { frame = i; break; } left -= durations[i]; }
  ctx.drawImage(strip, frame * width, 0, width, height, screenX - anchorX * scale, groundY - anchorY * scale, width * scale, height * scale);
  return groundY - stand * scale;
}

// Dessine Yarden et renvoie le haut de sa tête à l'écran ; null si les images manquent (disque de secours).
function drawYardenSprite(screenX, screenY) {
  const outfit = yardenOutfit && yardenArt.strips['outfit:' + yardenOutfit];
  if (outfit) return drawYardenOutfit(screenX, screenY, outfit);
  const pose = yardenPose();
  if (!pose) return null;
  const { cell: [width, height], anchor: [anchorX, anchorY] } = yardenClips[pose.clip];
  const { scale, stand } = yardenCell;
  // Les pieds touchent le bas du disque de collision, qui ne change pas.
  const groundY = screenY + player.radius;
  ctx.fillStyle = '#00000066';
  ctx.beginPath();
  ctx.ellipse(screenX, groundY - 1, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  const strip = yardenArt.strips[pose.clip];
  let source = strip;
  let blink = false;
  const tint = dodge.remaining > 0 ? { color: '#8affc1', alpha: .4 } : player.flash > 0 ? { color: '#ffffff', alpha: .6 } : null;
  if (tint) {
    source = tintedYardenStrip(pose.clip, strip, tint.color, tint.alpha);
    // Sans copie teintée possible, le flash devient un clignotement.
    if (!source) { source = strip; blink = tint.color === '#ffffff'; }
  }
  if (blink) ctx.globalAlpha = .45;
  ctx.drawImage(source, pose.frame * width, 0, width, height, screenX - anchorX * scale, groundY - anchorY * scale, width * scale, height * scale);
  ctx.globalAlpha = 1;
  return groundY - stand * scale;
}
