'use strict';

// Scène du chapitre 2 (la rue) : Yarden sort de la faille, Ishara court, deux hommes la suivent.
// Elle suit le canon fourni par Jordan : on n'ajoute aucune réplique. Les moments sans texte dans le canon
// (Ishara se présente, le lit en trop) sont racontés par une ligne de narration, pas par une réplique.
// La scène se joue dans la moitié sud de la ruelle (côté faille, à l'opposé de la fête) : lampadaire éteint,
// façade sans fenêtre à gauche, grille fermée à droite. Aucune faux, aucun mana, aucune autre violence que le poignet.
// `free` : une étape « until » rend la main à Yarden jusqu'à ce que sa condition soit vraie.
const scene = { active: false, free: false, card: null, mirror: null, metro: null, dark: null, tattoo: null, done: false, steps: [], index: 0, current: null, timer: 0, motions: {}, log: [] };
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
const sceneCells = { ishara: { cell: [86, 115], anchor: [43, 111] }, course: { cell: [140, 115], anchor: [70, 111] }, celeste: { cell: [211, 148], anchor: [105, 132] }, creature: { cell: [211, 148], anchor: [105, 132] }, remi: { cell: [120, 124], anchor: [60, 120] }, felix: { cell: [120, 124], anchor: [60, 120] }, inconnus: { cell: [211, 148], anchor: [105, 132] }, fete: { cell: [128, 148], anchor: [64, 132] } };
// Inconnu 1 (grand) et Inconnu 2 (compact) : chibi, regardent à gauche ; on les retourne pour la droite (figurants anonymes).
const inconnuClips = {
  'repos': { frames: 2, durations: [900, 900] }, 'marche-gauche': { frames: 4, durations: [170, 170, 170, 170] },
  'poignet': { frames: 1, durations: [900] }, 'recul': { frames: 2, durations: [220, 220] }
};
const danceDurations = [180, 180, 220, 180, 180, 220];
// Durées en millisecondes, reprises de assets/npcs/ishara/chibi/animations.json.
const isharaClips = {
  idle: [1000, 350, 110, 1200], 'walk-left': [150, 150, 150, 150], 'walk-right': [150, 150, 150, 150],
  'walk-up': [150, 150, 150, 150], 'walk-down': [150, 150, 150, 150], 'run-left': [100, 90, 100, 90], 'run-right': [100, 90, 100, 90]
};
const sceneFiles = [...Object.keys(isharaClips).map(name => `ishara/${name}`),
  ...['1', '2'].flatMap(n => ['repos', 'marche-gauche'].map(clip => `inconnus/inconnu-${n}-${clip}`)), 'inconnus/inconnu-2-poignet', 'inconnus/inconnu-2-recul', 'fete/danseur', 'fete/danseuse', 'remi/remi-comptoir', 'felix/felix-bureau', 'celeste/repos', 'celeste/marche-gauche', 'celeste/marche-droite', 'celeste/marche-haut', 'celeste/marche-bas',
  ...Object.keys(isharaClips).map(name => `course/${name}`)];

function loadSceneArt() {
  if (typeof Image === 'undefined') return;
  for (const key of sceneFiles) {
    const image = new Image();
    image.onload = () => { sceneArt.strips[key] = image; };
    image.onerror = () => { sceneArt.strips[key] = null; };
    image.src = `assets/npcs/${key.startsWith('ishara') ? 'ishara/chibi/' + key.slice(7) : key.startsWith('course') ? 'ishara/' + key : key}.png?v=56`;
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
    { spawn: ['danseuse', 'danseuse', 52, -462] },
    { spawn: ['danseur', 'danseur', 118, -458] },
    { camera: { x: 70, y: -440 } },
    { music: 'fete' },
    { wait: 1.8 },
    { spawn: ['ishara', 'ishara', 96, -498, { run: true }] },
    { camera: null },
    { moves: [move('ishara', [[14, -96]], 230)] },
    { set: ['ishara', { run: false }] },
    { wait: 2 },
    { music: null },
    { say: ['Inconnue[inquiete] : « Pardon, désolée, je... »'] },
    { set: ['ishara', { run: true }] },
    { moves: [move('ishara', [[30, -30], [36, 430]], 230)] },
    { set: ['ishara', { run: false, mode: 'idle' }] },
    { spawn: ['grand', 'grand', -25, -330] },
    { spawn: ['compact', 'compact', 45, -350] },
    { moves: [move('grand', [[-24, -170]], 85), move('compact', [[30, -150]], 85)] },
    { say: ['Tiamat (voix intérieure) : « Ce n’est pas ton problème. »'] },
    { moves: [move('grand', [[-5, 335]], 85), move('compact', [[50, 350]], 85), move('yarden', [[22, 205]], 95, { delay: 2.5 })] },
    { say: ['Inconnu 1 : « On te veut pas de mal. »'] },
    { say: ['Yarden : « Hé. »'] },
    { moves: [move('yarden', [[22, 255]], 70)] },
    { say: ['Inconnu 1[menacant] : « T’as rien à faire ici, poupée. »', 'Yarden[agacee] : « C’est vous qui comprenez pas à qui vous parlez. »'] },
    { moves: [move('compact', [[32, 288]], 90)] },
    { set: ['compact', { mode: 'stumble' }] },
    { say: ['Inconnu 2 : « Aïe, lâche. »'] },
    { set: ['compact', { mode: 'idle' }] },
    { set: ['compact', { variant: 'recul' }] },
    { moves: [move('compact', [[50, 330]], 60)] },
    { set: ['compact', { variant: null }] },
    { say: ['Yarden[agacee] : « Elle dit non. Bonne soirée. »'] },
    { moves: [move('grand', [[-60, 300], [-60, 10]], 85), move('compact', [[70, 300], [70, 10]], 85, { delay: 0.7 })] },
    { remove: ['grand', 'compact'] },
    { moves: [move('ishara', [[180, 420]], 70), move('yarden', [[105, 395]], 70)] },
    { say: ['Inconnue : « Hein ?! C’était quoi ça ?! »', 'Yarden : « Self-défense. »', 'Ishara[sourire] : « Moi, c’est Ishara. »', 'Yarden : « Yarden. »'] },
    // La marche vers la fête : elles bavardent, puis Ishara propose un lit.
    { moves: [move('ishara', [[70, 400], [30, 330], [30, 120]], 80), move('yarden', [[70, 400], [30, 340], [0, 150]], 80, { delay: .6 })] },
    { say: ['Ishara : « T’as aussi fui quelque chose ? »', 'Yarden : « On pourrait dire ça. »', 'Ishara : « Tu veux en parler ? »', 'Yarden : « Non. »'] },
    { moves: [move('ishara', [[30, -290]], 80), move('yarden', [[0, -260]], 80, { delay: .6 })] },
    { moves: [move('ishara', [[60, -410]], 80), move('yarden', [[20, -400]], 80, { delay: .5 })] },
    { say: ['Tiamat (voix intérieure) : « Tu aurais pu entrer. »', 'Tiamat : « La chaleur humaine a l’air agréable. »', 'Tiamat : « Tu as préféré ça. »'] },
    { say: ['Ishara[sourire] : « T’as l’air nouvelle ici. J’ai un lit, ma coloc est pas là. Si tu veux. »', 'Yarden : « D’accord. »'] },
    // On quitte la fête par le côté de la ruelle, pas tout droit.
    { moves: [move('ishara', [[-60, -450], [-176, -468]], 90), move('yarden', [[-40, -430], [-150, -450]], 90, { delay: .4 })] },
    // Le métro : Ishara explique le système, pour que le joueur le comprenne en même temps que Yarden.
    { metro: 'show' },
    { say: ['Ishara : « Tu es une Éveillée ? N’est-ce pas ? »', 'Yarden : « Je suis un— »', 'Tiamat : « Assez. »', 'Yarden : « Pas vraiment. »', 'Ishara : « Ici, tout le monde a un niveau. Les humains, les monstres — les gens ordinaires plafonnent autour de 8. »', 'Ishara : « Mais seuls les Éveillés le voient. »', 'Yarden : « Tu en es une alors ? Une éveillée ? »', 'Ishara : « Oui. Ceux qui ont reçu une bénédiction, ou qui ont été exposés à l’énergie des Abysses. Ils ont une interface, et ils voient ce que les autres ratent. »', 'Yarden : « Hmm. »'] },
    { say: ['Ishara : « Une faille, c’est une porte qui s’ouvre au hasard. Les gens normaux ne la voient pas, et ne peuvent pas entrer. »', 'J’en ai traversé une.', 'Ishara : « Dedans, c’est l’Abysse : un autre endroit, avec ses créatures, et un temps un peu de travers. »', 'Ishara[sourire] : « Ce qu’on en ramène, ça se revend. C’est comme ça que tout se paie pour nous. »', 'Yarden : « Hmm. »'] },
    { metro: 'hide' },
    { run: () => { enterQuartier(); scene.done = true; } },
    { say: ['Devant l’immeuble d’Ishara : vieille pierre, hautes fenêtres, façade un peu fatiguée. Mais encore belle.'] },
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

// Pendant la nuit et les tatouages, le texte ne grise pas l'image derrière lui.
function seeThrough() {
  document.getElementById('story-panel').classList.toggle('see-through', !!(scene.dark || scene.tattoo));
}

function resetScene() {
  sceneCam.on = false;
  audio.override = null;
  Object.assign(scene, { active: false, free: false, card: null, mirror: null, metro: null, dark: null, tattoo: null, done: false, steps: [], index: 0, current: null, timer: 0, motions: {}, log: [] });
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
    if ('dark' in step) { scene.dark = step.dark ? { start: mirrorNow() } : null; seeThrough(); continue; }
    if ('tattoo' in step) { scene.tattoo = step.tattoo ? { start: mirrorNow() } : null; seeThrough(); continue; }
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
      // Hystérésis : elle ne change d'axe que si l'autre direction domine nettement (évite le clignotement des sprites en suivant).
      const ax = Math.abs(actor.dirX), ay = Math.abs(actor.dirY), wasHorizontal = actor.axis === 'h';
      const horizontal = actor.axis ? (wasHorizontal ? ax > ay * .7 : ax > ay * 1.5) : ax > ay;
      actor.axis = horizontal ? 'h' : 'v';
      const direction = horizontal ? (actor.dirX < 0 ? 'left' : 'right') : (actor.dirY < 0 ? 'up' : 'down');
      // Il n'existe pas de course de face ni de dos : elle court alors avec la marche accélérée.
      if (actor.run && horizontal) name = `run-${direction}`;
      else { name = `walk-${direction}`; if (actor.run) speed = 1.8; }
    }
    const course = isharaOutfit === 'course';
    const key = `${course ? 'course' : 'ishara'}/${name}`;
    if (!sceneArt.strips[key]) return null;
    return { strip: sceneArt.strips[key], frame: sceneFrame(isharaClips[name], actor.time * speed), flip: false, ...(course ? sceneCells.course : sceneCells.ishara) };
  }
  if (actor.kind === 'celeste') {
    let name = 'repos', durations = [1000, 500, 140, 1000];
    if (actor.moving) {
      const ax = Math.abs(actor.dirX), ay = Math.abs(actor.dirY), wasH = actor.axis === 'h';
      const horizontal = actor.axis ? (wasH ? ax > ay * .7 : ax > ay * 1.5) : ax > ay;
      actor.axis = horizontal ? 'h' : 'v';
      name = 'marche-' + (horizontal ? (actor.dirX < 0 ? 'gauche' : 'droite') : (actor.dirY < 0 ? 'haut' : 'bas'));
      durations = [150, 150, 150, 150];
    }
    const key = `celeste/${name}`;
    if (!sceneArt.strips[key]) return null;
    return { strip: sceneArt.strips[key], frame: sceneFrame(durations, actor.time), flip: false, ...sceneCells.celeste };
  }
  if (actor.kind === 'creature') {
    // Créature de la rupture (chapitre 4) : le rampant gris en attendant son propre dessin ; frames 0 à 3 marche, 4 annonce, 5 coup.
    const strip = monsterArt.strips.rampant;
    if (!strip) return null;
    const frame = actor.pose === 'strike' ? 5 : actor.pose === 'windup' ? 4 : actor.moving ? Math.floor(actor.time / .1) % 4 : 0;
    return { strip, frame, flip: actor.face > 0, ...sceneCells.creature };
  }
  if (actor.kind === 'remi' || actor.kind === 'felix') {
    const key = actor.kind === 'remi' ? 'remi/remi-comptoir' : 'felix/felix-bureau';
    if (!sceneArt.strips[key]) return null;
    return { strip: sceneArt.strips[key], frame: sceneFrame(actor.kind === 'remi' ? [260, 260, 260, 900] : [400, 300, 400, 900], actor.time), flip: false, ...sceneCells[actor.kind] };
  }
  if (actor.kind === 'danseur' || actor.kind === 'danseuse') {
    const key = `fete/${actor.kind}`;
    if (!sceneArt.strips[key]) return null;
    return { strip: sceneArt.strips[key], frame: sceneFrame(danceDurations, actor.time), flip: false, ...sceneCells.fete };
  }
  // Inconnu 1 = « grand », Inconnu 2 = « compact ».
  const who = actor.kind === 'grand' || actor.kind === 'operateur' ? 1 : 2;
  let clip = actor.moving ? (actor.variant === 'recul' && who === 2 ? 'recul' : 'marche-gauche') : 'repos';
  if (who === 2 && actor.mode === 'stumble') clip = 'poignet';
  const key = `inconnus/inconnu-${who}-${clip}`;
  if (!sceneArt.strips[key]) return null;
  const frame = sceneFrame(inconnuClips[clip].durations, actor.time);
  return { strip: sceneArt.strips[key], frame, flip: actor.face > 0, ...sceneCells.inconnus };
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
      // Silhouette si l'image manque (ou pour Rémi, dont le dessin n'existe pas encore).
      const body = actor.kind === 'operateur' ? '#2c2e38' : actor.kind === 'passant' ? '#7b7f8f' : actor.kind === 'remi' ? '#3c3a46' : actor.kind === 'ishara' ? '#6b4a3a' : actor.kind === 'grand' ? '#52677f' : actor.kind === 'compact' ? '#84565e' : '#c4525a';
      ctx.fillStyle = body;
      ctx.fillRect(x - 10, actor.y + offsetY - 4, 20, 22);
      ctx.beginPath();
      ctx.arc(x, actor.y + offsetY - 12, 9, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    if (ch2b.buff && actor.kind === 'ishara') {
      // Le buff d'Ishara : un léger scintillement doré autour d'elle.
      const tt = mirrorNow(), halo = ctx.createRadialGradient(x, actor.y + offsetY - 20, 6, x, actor.y + offsetY - 20, 90);
      halo.addColorStop(0, `rgba(255, 215, 120, ${.28 + .08 * Math.sin(tt * 3)})`); halo.addColorStop(1, 'rgba(255, 215, 120, 0)');
      ctx.fillStyle = halo; ctx.fillRect(x - 90, actor.y + offsetY - 110, 180, 180);
    }
    if (actor.prop === 'serviette') { ctx.fillStyle = '#f2efe6'; ctx.fillRect(x + (actor.face > 0 ? 8 : -22), groundY - 40, 14, 18); ctx.fillStyle = '#d6d0c2'; ctx.fillRect(x + (actor.face > 0 ? 8 : -22), groundY - 40, 14, 4); }
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
