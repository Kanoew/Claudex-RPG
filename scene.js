'use strict';

// Scène du chapitre 2 (la rue) : Yarden sort de la faille, Ishara court, deux hommes la suivent.
// Elle suit le canon fourni par Jordan : on n'ajoute aucune réplique. Les moments sans texte dans le canon
// (Ishara se présente, le lit en trop) sont racontés par une ligne de narration, pas par une réplique.
// La scène se joue dans la moitié sud de la ruelle (côté faille, à l'opposé de la fête) : lampadaire éteint,
// façade sans fenêtre à gauche, grille fermée à droite. Aucune faux, aucun mana, aucune autre violence que le poignet.
// `free` : une étape « until » rend la main à Yarden jusqu'à ce que sa condition soit vraie.
const scene = { active: false, free: false, done: false, steps: [], index: 0, current: null, timer: 0, motions: {}, log: [] };
const sceneActors = {};
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
    { spawn: ['ishara', 'ishara', 50, -330, { run: true }] },
    { moves: [move('ishara', [[14, -96]], 230)] },
    { set: ['ishara', { run: false }] },
    { wait: 2 },
    { say: ['Ishara lui rentre dedans et s’accroche deux secondes à sa veste.', 'Ishara : « Pardon, désolée, vraiment, je... »'] },
    { set: ['ishara', { run: true }] },
    { moves: [move('ishara', [[30, -30], [36, 430]], 230)] },
    { set: ['ishara', { run: false, mode: 'idle' }] },
    { spawn: ['grand', 'grand', -25, -330] },
    { spawn: ['compact', 'compact', 45, -350] },
    { moves: [move('grand', [[-24, -170]], 85), move('compact', [[30, -150]], 85)] },
    { say: ['Les deux hommes arrivent à mi-ruelle, les yeux fixés sur Ishara.', 'Yarden les évalue.', 'Tiamat (voix intérieure) : « Ce n’est pas ton problème. »', 'Yarden ne répond pas. Elle suit, sans courir ni intercepter.'] },
    { moves: [move('grand', [[-5, 335]], 85), move('compact', [[50, 350]], 85), move('yarden', [[22, 205]], 95, { delay: 2.5 })] },
    { say: ['Yarden les retrouve au coin sans lampadaire.', 'Ishara s’est arrêtée : droite, le sac serré contre le flanc, elle cherche une sortie.', 'Le grand : « On te veut pas de mal »', 'L’autre ricane.'] },
    { say: ['Yarden : « Hé. »'] },
    { moves: [move('yarden', [[22, 255]], 70)] },
    { say: ['Les mains dans les poches, sans se presser, Yarden s’arrête à deux mètres.', 'Un des hommes : « T’as pas d’affaires ici, poupée »', 'Yarden : « C’est vous qui comprenez pas à qui vous parlez »'] },
    { moves: [move('compact', [[32, 288]], 90)] },
    { say: ['Le compact tend la main vers l’épaule de Yarden, pour la pousser, pas pour la frapper.'] },
    { set: ['compact', { mode: 'stumble' }] },
    { say: ['Yarden saisit le poignet. Ni vite ni avec rage : avec précision.', 'Une rotation suit l’articulation jusqu’au point inconfortable, et une légère pression vers le bas plie le genou du type. Il se retrouve debout, la main retournée contre lui-même. Il ne crie pas.', 'Le compact : « Aïe, lâche. »', 'Yarden : « Ouais. »', 'Yarden lâche.'] },
    { set: ['compact', { mode: 'idle' }] },
    { moves: [move('compact', [[50, 330]], 60)] },
    { say: ['Le type recule, secoue le poignet : confusion, colère, puis prudence.', 'Yarden : « Elle est pas intéressée. Bonne soirée. »'] },
    { moves: [move('grand', [[-60, 300], [-60, 10]], 85), move('compact', [[70, 300], [70, 10]], 85, { delay: 0.7 })] },
    { remove: ['grand', 'compact'] },
    { say: ['Le grand est parti en premier, sans courir. Le compact l’a suivi en marmonnant.', 'Yarden les reclasse en non-menace.'] },
    { moves: [move('ishara', [[180, 420]], 70), move('yarden', [[105, 395]], 70)] },
    { say: ['Ishara, adossée à la grille, bras croisés, desserre les mains du sac et souffle.', 'Ishara : « T’as fait quoi exactement ? »', 'Yarden : « Géométrie articulaire. »', 'Ishara se présente. Yarden donne son nom.', 'Ishara lui propose un lit en trop. Yarden accepte.'] },
    { end: 'Ishara propose un lit en trop. Yarden accepte. Fin du prototype !' }
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
  Object.assign(scene, { active: false, free: false, done: false, steps: [], index: 0, current: null, timer: 0, motions: {}, log: [] });
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
  else if (step.until) {
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
