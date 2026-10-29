'use strict';

// Scène du chapitre 2 (la rue) : Yarden sort de la faille, Ishara court, deux hommes la suivent.
// Elle suit le canon fourni par Jordan : on n'ajoute aucune réplique. Les moments sans texte dans le canon
// (Ishara se présente, le lit en trop) sont racontés par une ligne de narration, pas par une réplique.
// La scène se joue dans la moitié sud de la ruelle (côté faille, à l'opposé de la fête) : lampadaire éteint,
// façade sans fenêtre à gauche, grille fermée à droite. Aucune faux, aucun mana, aucune autre violence que le poignet.
// `free` : une étape « until » rend la main à Yarden jusqu'à ce que sa condition soit vraie.
const scene = { active: false, free: false, card: null, mirror: null, metro: null, done: false, steps: [], index: 0, current: null, timer: 0, motions: {}, log: [] };
const sceneActors = {};
// Caméra de scène : elle peut aller regarder ailleurs (la faille, la fête) puis revenir vers Yarden, en glissant.
const sceneCam = { on: false, x: 0, y: 0, tx: 0, ty: 0, follow: false, last: 0 };
function setSceneCamera(value) {
  if (value) {
    if (!sceneCam.on) Object.assign(sceneCam, { on: true, x: player.x, y: player.y, last: mirrorNow() });
    Object.assign(sceneCam, { tx: value.x, ty: value.y, follow: false });
  } else if (sceneCam.on) sceneCam.follow = true;
}

// Point que regarde la caméra : Yarden, sauf pendant un plan de scène.
function cameraFocus() {
  if (!sceneCam.on) return player;
  const now = mirrorNow(), dt = Math.min(.05, Math.max(0, now - sceneCam.last));
  sceneCam.last = now;
  if (sceneCam.follow) { sceneCam.tx = player.x; sceneCam.ty = player.y; }
  const k = 1 - Math.exp(-dt * 3.2);
  sceneCam.x += (sceneCam.tx - sceneCam.x) * k;
  sceneCam.y += (sceneCam.ty - sceneCam.y) * k;
  if (sceneCam.follow && Math.hypot(sceneCam.x - player.x, sceneCam.y - player.y) < 2) sceneCam.on = false;
  return sceneCam;
}
const sceneArt = { strips: {} };
const sceneCells = { ishara: { cell: [86, 115], anchor: [43, 111] }, hommes: { cell: [134, 151], anchor: [67, 147] } };
// Durées en millisecondes, reprises de assets/npcs/ishara/chibi/animations.json.
const isharaClips = {
  idle: [1000, 350, 110, 1200], 'walk-left': [150, 150, 150, 150], 'walk-right': [150, 150, 150, 150],
  'walk-up': [150, 150, 150, 150], 'walk-down': [150, 150, 150, 150], 'run-left': [100, 90, 100, 90], 'run-right': [100, 90, 100, 90]
};
const sceneFiles = [...Object.keys(isharaClips).map(name => `ishara/${name}`), 'hommes/grand', 'hommes/compact'];

function loadSceneArt() {
  if (typeof Image === 'undefined') return;
  for (const key of sceneFiles) {
    const image = new Image();
    image.onload = () => { sceneArt.strips[key] = image; };
    image.onerror = () => { sceneArt.strips[key] = null; };
    image.src = `assets/npcs/${key.startsWith('ishara') ? 'ishara/chibi/' + key.slice(7) : key}.png?v=31`;
  }
}

function sceneFrame(durations, seconds) {
  let left = (seconds * 1000) % durations.reduce((sum, value) => sum + value, 0);
  for (let i = 0; i < durations.length; i++) {
    if (left < durations[i]) return i;
    left -= durations[i];
  }
  return durations.length - 1;
}

function sceneActor(id, kind, x, y, extra = {}) {
  sceneActors[id] = { id, kind, x, y, dirX: 0, dirY: 1, face: -1, moving: false, run: false, mode: 'idle', time: 0, visible: true, ...extra };
}

// Étapes de la scène. Coordonnées de la ruelle : le nord (y négatif) est côté fête, le sud côté faille.
// Tous les trajets suivent la voie centrale (x entre -70 et 70), libre de tout obstacle.
function sceneScript() {
  const move = (id, path, speed, extra = {}) => ({ id, path: path.map(([x, y]) => ({ x, y })), speed, ...extra });
  return [
    { moves: [move('yarden', [[0, -60]], 140)] },
    { run: () => { facing = { x: 0, y: -1 }; } },
    { say: ['Yarden regarde la fête depuis la ruelle. Elle allait faire demi-tour.'] },
    { camera: { x: 0, y: -440 } },
    { music: 'fete' },
    { wait: 1.8 },
    { spawn: ['ishara', 'ishara', 18, -470, { run: true }] },
    { camera: null },
    { moves: [move('ishara', [[14, -96]], 230)] },
    { set: ['ishara', { run: false }] },
    { wait: 2 },
    { music: null },
    { say: ['Une fille lui fonce dedans et s’accroche à sa veste une seconde ou deux.', 'Inconnue : « Pardon, désolée, vraiment, je... »'] },
    { set: ['ishara', { run: true }] },
    { moves: [move('ishara', [[30, -30], [36, 430]], 230)] },
    { set: ['ishara', { run: false, mode: 'idle' }] },
    { spawn: ['grand', 'grand', -25, -330] },
    { spawn: ['compact', 'compact', 45, -350] },
    { moves: [move('grand', [[-24, -170]], 85), move('compact', [[30, -150]], 85)] },
    { say: ['Deux hommes arrivent à mi-ruelle. Ils ne regardent qu’elle.', 'Yarden les jauge.', 'Tiamat (voix intérieure) : « Ce n’est pas ton problème. »', 'Yarden ne répond pas. Elle suit, sans courir.'] },
    { moves: [move('grand', [[-5, 335]], 85), move('compact', [[50, 350]], 85), move('yarden', [[22, 205]], 95, { delay: 2.5 })] },
    { say: ['Yarden les rattrape au coin sans lampadaire.', 'La fille s’est arrêtée, le dos droit, son sac serré contre elle. Elle cherche une sortie.', 'Inconnu 1 : « On te veut pas de mal. »', 'L’autre ricane.'] },
    { say: ['Yarden : « Hé. »'] },
    { moves: [move('yarden', [[22, 255]], 70)] },
    { say: ['Mains dans les poches, Yarden s’arrête à deux mètres.', 'Inconnu 1 : « T’as pas d’affaires ici, poupée. »', 'Yarden : « C’est vous qui comprenez pas à qui vous parlez. »'] },
    { moves: [move('compact', [[32, 288]], 90)] },
    { say: ['Le deuxième tend la main vers son épaule. Pour la pousser, pas pour la frapper.'] },
    { set: ['compact', { mode: 'stumble' }] },
    { say: ['Yarden lui attrape le poignet, sans vitesse ni rage. Un quart de tour, une pression vers le bas, et le voilà plié, la main retournée contre lui-même. Il ne crie pas.', 'Inconnu 2 : « Aïe, lâche. »', 'Yarden : « Ouais. »', 'Elle lâche.'] },
    { set: ['compact', { mode: 'idle' }] },
    { moves: [move('compact', [[50, 330]], 60)] },
    { say: ['Il recule en secouant le poignet. Surpris, furieux, puis prudent.', 'Yarden : « Elle est pas intéressée. Bonne soirée. »'] },
    { moves: [move('grand', [[-60, 300], [-60, 10]], 85), move('compact', [[70, 300], [70, 10]], 85, { delay: 0.7 })] },
    { remove: ['grand', 'compact'] },
    { say: ['Le premier part sans courir. L’autre le suit en marmonnant.', 'Pour Yarden, ce ne sont plus une menace.'] },
    { moves: [move('ishara', [[180, 420]], 70), move('yarden', [[105, 395]], 70)] },
    { say: ['Adossée à la grille, bras croisés, la fille desserre les doigts autour de son sac et souffle.', 'Inconnue : « T’as fait quoi, exactement ? »', 'Yarden : « Self-défense. »', 'Elle se présente : Ishara. Yarden donne son nom.', 'Ishara lui propose un lit en trop. Yarden accepte.'] },
    { moves: [move('ishara', [[70, 400], [30, 330], [30, 120]], 80), move('yarden', [[70, 400], [30, 340], [0, 150]], 80, { delay: .6 })] },
    { say: ['Ishara : « Un niveau, tout le monde en a un. Mais nous, on peut le voir. »', 'Yarden : « D’accord. »', 'Ishara : « Ceux qui voient, on les appelle les Éveillés. »', 'Yarden : « Je vois. »'] },
    { moves: [move('ishara', [[30, -90]], 80), move('yarden', [[0, -60]], 80, { delay: .6 })] },
    { say: ['Ishara : « Une faille, c’est une porte. Les gens normaux passent à côté sans la voir. »', 'Yarden : « Continue. »', 'Ishara : « Dedans, c’est un autre endroit. Le temps y va un peu de travers. »', 'Ishara : « T’as fui quelque chose ? »', 'Yarden : « On pourrait dire ça. »', 'Ishara : « Tu veux en parler ? »', 'Yarden : « Non. »'] },
    { moves: [move('ishara', [[30, -290]], 80), move('yarden', [[0, -260]], 80, { delay: .6 })] },
    { say: ['Ishara : « Ce qu’on ramène, ça se revend. C’est comme ça que je paye mon loyer. »', 'Yarden : « D’accord. »'] },
    { moves: [move('ishara', [[30, -430]], 80), move('yarden', [[0, -420]], 80, { delay: .5 })] },
    { say: ['Au bout de la ruelle, la fête : de la musique, des rires, de la chaleur. Yarden s’arrête.', 'Tiamat (voix intérieure) : « Tu aurais pu entrer. »', 'Tiamat : « La chaleur humaine… »', 'Tiamat : « Bien. »', 'Ishara attend un peu plus loin et ne demande rien.'] },
    { metro: 'show' },
    { say: ['Yarden découvre le métro. Ce fut une expérience.', 'Debout près de la porte, le dos contre la paroi. Ishara regarde son téléphone. Elles ne parlent pas, et c’est confortable.'] },
    { metro: 'hide' },
    { run: () => { enterQuartier(); scene.done = true; } },
    { say: ['Devant l’immeuble d’Ishara. Haussmannien, un peu fatigué, la façade encore belle.', 'Ishara marche vers la porte. Yarden la suit.'] },
    { moves: [move('ishara', [[0, -40]], 70)] },
    { until: () => Math.hypot(player.x - quartierDoor.x, player.y - quartierDoor.y) < 70 },
    { say: ['Ishara sort ses clés. La porte s’ouvre.'] },
    { run: () => { enterApartment('arrive'); } },
    ...apartmentArrivalSteps()
  ];
}

function startScene(steps = sceneScript()) {
  resetInput();
  attack.remaining = 0;
  dodge.remaining = 0;
  Object.assign(scene, { active: true, free: false, steps, index: -1, current: null, timer: 0, motions: {}, log: [] });
  nextSceneStep();
}

function resetScene() {
  sceneCam.on = false;
  audio.override = null;
  Object.assign(scene, { active: false, free: false, card: null, mirror: null, metro: null, done: false, steps: [], index: 0, current: null, timer: 0, motions: {}, log: [] });
  for (const id of Object.keys(sceneActors)) delete sceneActors[id];
}

const sceneActorOf = id => id === 'yarden' ? player : sceneActors[id];

function nextSceneStep() {
  // Les étapes instantanées s'enchaînent ; une étape qui attend rend la main.
  while (scene.active) {
    scene.index++;
    const step = scene.steps[scene.index];
    scene.current = step;
    scene.timer = 0;
    if (!step) return;
    if (step.say) {
      scene.log.push(...step.say);
      showStory(step.say, nextSceneStep);
      return;
    }
    if (step.moves) {
      for (const motion of step.moves) scene.motions[motion.id] = { path: [...motion.path], speed: motion.speed, delay: motion.delay || 0 };
      return;
    }
    if (step.wait !== undefined) return;
    if (step.until) { scene.free = true; return; }
    if (step.card) { scene.card = { text: step.card, time: 0 }; return; }
    if (step.mirror) { mirrorStep(step.mirror); continue; }
    if (step.metro) { metroStep(step.metro); continue; }
    if ('camera' in step) { setSceneCamera(step.camera); continue; }
    if ('music' in step) { audio.override = step.music; syncMusic(); continue; }
    if (step.spawn) {
      const [id, kind, x, y, extra] = step.spawn;
      sceneActor(id, kind, x, y, extra);
    } else if (step.set) {
      Object.assign(sceneActors[step.set[0]], step.set[1]);
    } else if (step.remove) {
      for (const id of step.remove) delete sceneActors[id];
    } else if (step.run) {
      step.run();
    } else if (step.finish) {
      scene.active = false;
      updateStatus();
      updateAttackButton();
      return;
    } else if (step.end) {
      scene.active = false;
      scene.done = true;
      stage = 'escaped';
      finishCombat(step.end);
      updateStatus();
      return;
    }
  }
}

function moveSceneActors(seconds) {
  const moving = new Set();
  for (const [id, motion] of Object.entries(scene.motions)) {
    const actor = sceneActorOf(id);
    if (motion.delay > 0) { motion.delay = Math.max(0, motion.delay - seconds); continue; }
    const target = motion.path[0];
    const dx = target.x - actor.x, dy = target.y - actor.y, distance = Math.hypot(dx, dy), step = motion.speed * seconds;
    const dirX = distance ? dx / distance : 0, dirY = distance ? dy / distance : 0;
    if (distance <= step) {
      actor.x = target.x;
      actor.y = target.y;
      motion.path.shift();
    } else {
      actor.x += dirX * step;
      actor.y += dirY * step;
    }
    moving.add(id);
    if (id === 'yarden') {
      facing = { x: dirX, y: dirY };
      updateYardenSprite(seconds, dirX, dirY, true);
    } else {
      Object.assign(actor, { dirX, dirY, moving: true, mode: 'move' });
      if (Math.abs(dirX) > .3) actor.face = dirX > 0 ? 1 : -1;
    }
    if (!motion.path.length) delete scene.motions[id];
  }
  if (!moving.has('yarden') && !scene.free) updateYardenSprite(seconds, 0, 0, false);
  for (const actor of Object.values(sceneActors)) {
    actor.time += seconds;
    if (!moving.has(actor.id)) { actor.moving = false; if (actor.mode === 'move') actor.mode = 'idle'; }
  }
}

function updateScene(seconds) {
  if (!scene.active) {
    if (scene.done || currentZone.id !== 'exterieur' || !encounter.complete || player.y > -40) return;
    startScene();
    return;
  }
  if (!scene.free) moveSceneActors(seconds);
  const step = scene.current;
  if (!step) return;
  if (step.moves && !Object.keys(scene.motions).length) nextSceneStep();
  else if (step.card) {
    scene.card.time += seconds;
    if (scene.card.time >= step.seconds) { scene.card = null; nextSceneStep(); }
  } else if (step.until) {
    if (step.until()) { scene.free = false; nextSceneStep(); }
  } else if (step.wait !== undefined) {
    scene.timer += seconds;
    if (scene.timer >= step.wait) nextSceneStep();
  }
}

function sceneActorPose(actor) {
  if (actor.kind === 'ishara') {
    let name = 'idle', speed = 1;
    if (actor.moving) {
      const horizontal = Math.abs(actor.dirX) > Math.abs(actor.dirY);
      const direction = horizontal ? (actor.dirX < 0 ? 'left' : 'right') : (actor.dirY < 0 ? 'up' : 'down');
      // Il n'existe pas de course de face ni de dos : elle court alors avec la marche accélérée.
      if (actor.run && horizontal) name = `run-${direction}`;
      else { name = `walk-${direction}`; if (actor.run) speed = 1.8; }
    }
    const key = `ishara/${name}`;
    if (!sceneArt.strips[key]) return null;
    return { strip: sceneArt.strips[key], frame: sceneFrame(isharaClips[name], actor.time * speed), flip: false, ...sceneCells.ishara };
  }
  const key = `hommes/${actor.kind}`;
  if (!sceneArt.strips[key]) return null;
  const frame = actor.mode === 'stumble' ? 4 : actor.moving ? sceneFrame([170, 170, 170, 170], actor.time) : 0;
  return { strip: sceneArt.strips[key], frame, flip: actor.face > 0, ...sceneCells.hommes };
}

// Dessine les acteurs de la scène ; `front` sélectionne ceux qui sont au sud de Yarden et passent donc devant elle.
function drawSceneActors(offsetX, offsetY, front) {
  const scale = yardenCell.scale;
  for (const actor of Object.values(sceneActors)) {
    if (!actor.visible || (actor.y > player.y) !== front) continue;
    const x = actor.x + offsetX, groundY = actor.y + offsetY + player.radius;
    ctx.fillStyle = '#00000066';
    ctx.beginPath();
    ctx.ellipse(x, groundY - 1, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    const pose = sceneActorPose(actor);
    if (!pose) {
      // Disque de secours si les images ne sont pas chargées.
      ctx.fillStyle = actor.kind === 'ishara' ? '#6b4a3a' : actor.kind === 'grand' ? '#52677f' : '#84565e';
      ctx.beginPath();
      ctx.arc(x, actor.y + offsetY, player.radius, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    const [width, height] = pose.cell, [anchorX, anchorY] = pose.anchor;
    ctx.save();
    ctx.translate(x, 0);
    if (pose.flip) ctx.scale(-1, 1);
    ctx.drawImage(pose.strip, pose.frame * width, 0, width, height, -anchorX * scale, groundY - anchorY * scale, width * scale, height * scale);
    ctx.restore();
  }
}

// Carte de transition plein écran (« Dans le métro ») : fondu d'entrée et de sortie.
function drawSceneCard() {
  const card = scene.card, step = scene.current;
  if (!card || !step) return;
  const edge = .4, alpha = Math.max(0, Math.min(1, card.time / edge, (step.seconds - card.time) / edge));
  ctx.save();
  ctx.fillStyle = `rgba(8, 10, 16, ${Math.min(1, alpha * 1.4)})`;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#e7dcff';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.text, width / 2, height / 2);
  ctx.restore();
}
