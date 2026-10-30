'use strict';

// Chapitre 2, le lendemain matin : l'impasse, le premier run en Abysse (sept gobelins de niveau 15 à 19), le comptoir de Rémi (280 crédits),
// le métro, le 4B et son escalier. Canon : PROJECT.md, sections 27 à 29. Les répliques sont des propositions courtes à relire dans
// docs/TEXTES.md ; seules celles qui viennent du canon sont exactes (« Le type qui coupe. », « Je vous attendais. »...).
// Entorses assumées : gobelins pour les « créatures », crédits au lieu de francs, Yarden au lieu de Jordan, Ishara garde sa tenue de soirée
// (la tenue de combat d'Ishara n'est pas encore dessinée), pas de collier ni de ear cuff.
const chapter2b = { runDone: false };
const impasseRift = { x: 41, y: -150 };
const runTotal = () => zoneEnemies.run.length;
const runDeadCount = () => zoneEnemies.run.filter(enemy => enemy.hp <= 0).length;

function resetChapter2b() {
  chapter2b.runDone = false;
  ch2b.shutterAt = 0; ch2b.slate = ''; ch2b.buff = false;
  for (const enemy of zoneEnemies.run) { resetEnemy(enemy); enemy.looted = false; }
  bag.length = 0; credits = 0; scytheFreed = false; isharaOutfit = 'soiree';
}

// Butin du run : quatre fragments et deux bourses (canon), un par gobelin sauf le dernier, qui s'enfuit. Le niveau 19 est le plus gros, coupe propre.
const runDrops = [
  { name: 'Fragment cristallin', level: 15 }, { name: 'Bourse de fibres', level: 16 }, { name: 'Fragment cristallin', level: 17 },
  { name: 'Bourse de fibres', level: 18 }, { name: 'Fragment cristallin', level: 19, note: 'coupe propre' }, { name: 'Fragment cristallin', level: 16 }, null
];

function lootToast(text) {
  const node = document.getElementById('loot-toast');
  if (!node) return;
  node.textContent = text;
  node.hidden = false;
  node.classList.remove('show');
  void node.offsetWidth;
  node.classList.add('show');
}

function collectRunLoot() {
  zoneEnemies.run.forEach((enemy, index) => {
    if (enemy.hp > 0 || enemy.looted) return;
    enemy.looted = true;
    const drop = runDrops[index];
    if (!drop) return;
    bag.push({ ...drop });
    lootToast(`+ ${drop.name} · niv. ${drop.level}`);
  });
}

zones.impasse.goal = () => 'Rejoins la faille ↑';
zones.run.goal = () => `Vaincs les gobelins (${runDeadCount()}/${runTotal()})`;
zones.run.label = () => `Gobelins Niv. 15 à 19 · ${runDeadCount()}/${runTotal()}`;
zones.marterey.goal = () => 'Suis Ishara';
zones.comptoir.goal = () => 'Rémi évalue le butin';
zones.sousgare.goal = () => 'Suis Ishara';
zones.cour.goal = () => 'Suis Ishara';
zones.escalier.goal = () => 'Monte ↑';
zones.impasse.label = () => 'Impasse du pressing';
zones.marterey.label = () => 'Rue Marterey';
zones.comptoir.label = () => 'Le comptoir de Rémi';
zones.sousgare.label = () => 'Quartier Sous-gare';
zones.cour.label = () => 'La cour';
zones.escalier.label = () => '4e étage';

const moveOf = (id, path, speed, extra = {}) => ({ id, path: path.map(([x, y]) => ({ x, y })), speed, ...extra });

function clearActors() {
  for (const id of Object.keys(sceneActors)) delete sceneActors[id];
}

function enterImpasse() {
  enterZone('impasse', 'start');
  clearActors();
  sceneActor('ishara', 'ishara', -130, 125, { face: 1 });
  saveCheckpoint('impasse');
}

function enterRun() {
  enterZone('run', 'start');
  chapter2b.runDone = false;
  for (const enemy of zoneEnemies.run) resetEnemy(enemy);
  clearActors();
  sceneActor('ishara', 'ishara', 0, 415, { face: -1 });
}

function enterMarterey() {
  enterZone('marterey', 'start');
  clearActors();
  ch2b.shutterAt = 0;
  sceneActor('ishara', 'ishara', -90, 118, { face: 1 });
  saveCheckpoint('marterey');
}

function enterComptoir() {
  enterZone('comptoir', 'start');
  clearActors();
  ch2b.slate = '';
  sceneActor('ishara', 'ishara', -30, 200, { face: 1 });
  sceneActor('remi', 'remi', 0, -105);
}

function enterSousgare() {
  enterZone('sousgare', 'start');
  clearActors();
  sceneActor('ishara', 'ishara', -160, 150, { face: 1 });
  saveCheckpoint('sousgare');
}

function enterCour() {
  enterZone('cour', 'start');
  clearActors();
  sceneActor('ishara', 'ishara', -30, 160, { face: 1 });
}

function enterEscalier() {
  enterZone('escalier', 'start');
  clearActors();
  sceneActor('ishara', 'ishara', -30, 240, { face: 1 });
}

const nearPlayer = (x, y, radius) => () => Math.hypot(player.x - x, player.y - y) < radius;
const above = y => () => player.y < y;

// L'impasse, derrière un pressing fermé : la faille est un rectangle d'air distordu.
function impasseScript() {
  return [
    { run: () => { isharaOutfit = 'course'; enterImpasse(); } },
    { say: ['Une impasse derrière un pressing fermé : c’est dimanche.', 'Dans l’air, un rectangle légèrement distordu, presque invisible en plein jour.'] },
    { say: ['Yarden : « Niveau estimé : 16, 17. Espace restreint. Probablement du territorial. »', 'Ishara : « Je reste derrière toi. »'] },
    { until: nearPlayer(impasseRift.x, impasseRift.y, 70) },
    { run: enterRun },
    { finish: true }
  ];
}

// Après le dernier gobelin : le butin, les deux heures dehors, puis la suite du chapitre.
function runEndScript() {
  return [
    { say: ['Les sept créatures sont tombées. Ishara prélève les matériaux.', 'Quatre fragments cristallins de tailles variables, deux petites bourses de fibres : des griffes, de la chair dense de haut niveau.', 'Le plus gros fragment est de niveau 19, et sa coupe est propre.', 'Aucune expérience gagnée.'] },
    { card: 'Quarante minutes dedans, deux heures dehors.', seconds: 2.6 },
    ...marteryScript()
  ];
}

function marteryScript() {
  return [
    { run: enterMarterey },
    { say: ['Rue Marterey, Lausanne. Dix heures.'] },
    { moves: [moveOf('ishara', [[18, -52]], 90), moveOf('yarden', [[-26, -42]], 90, { delay: .5 })] },
    { run: () => { ch2b.shutterAt = mirrorNow(); } },
    { wait: 1.8 },
    { say: ['Le kebab ouvre ses rideaux. Ishara appuie sur l’interphone, puis une seconde fois : il a l’air cassé, mais il marche.'] },
    ...comptoirScript()
  ];
}

function comptoirScript() {
  return [
    { run: enterComptoir },
    { say: ['Un couloir étroit. De l’encens bon marché, et quelque chose de plus minéral dessous.'] },
    { moves: [moveOf('ishara', [[-34, -10]], 95), moveOf('yarden', [[30, -10]], 95, { delay: .3 })] },
    { say: ['Rémi examine les fragments, un par un, sans un mot. Il s’arrête sur celui de niveau 19.', 'Rémi : « Avec quelle lame ? Quel type ? »', 'Yarden : « Le type qui coupe. »'] },
    { run: () => { ch2b.slate = '280'; } },
    { say: ['Rémi écrit 280 sur l’ardoise.', 'Ishara : « La dernière fois, un run équivalent valait 220. »', 'Rémi : « Le 19 est propre. Coupe franche, ni brûlure ni impact contondant. C’est rare à ce niveau : supplément. »'] },
    { run: () => { credits += 280; bag.length = 0; } },
    { say: ['Rémi pose les billets : 560 en tout. Ishara en glisse la moitié à Yarden.', 'Ishara : « On partage. 280 chacun. »', 'Rémi : « Dites-moi quel type de lame fait des coupes comme ça. »', 'Tiamat (voix intérieure) : « Tu viens de laisser une trace. Les receleurs parlent. »', 'Premier argent gagné dans ce monde : 280 crédits.'] },
    { run: () => { ch2b.slate = ''; } },
    { metro: 'show' },
    { say: ['Le M2, direction Sous-gare.'] },
    { metro: 'hide' },
    ...sousgareScript()
  ];
}

function sousgareScript() {
  return [
    { run: enterSousgare },
    { say: ['Quartier Sous-gare. Un immeuble Belle Époque, impeccable. Trop normal.', 'Des géraniums au deuxième étage.'] },
    { moves: [moveOf('ishara', [[84, -50]], 80), moveOf('yarden', [[40, -40]], 80, { delay: .4 })] },
    { say: ['Ishara compose le digicode.'] },
    { run: enterCour },
    { say: ['La cour : des pavés sans une herbe, du lierre taillé au millimètre, deux arbustes en symétrie parfaite.'] },
    { moves: [moveOf('ishara', [[-20, -170]], 85), moveOf('yarden', [[10, -150]], 85, { delay: .4 })] },
    { run: enterEscalier },
    { until: above(-60) },
    { say: ['Des marches de pierre, creusées au centre. L’air est déjà plus lourd.'] },
    { until: above(-300) },
    { say: ['Plus haut, plus chargé.'] },
    { until: above(-530) },
    { say: ['Quatrième étage. La porte du 4B est entrouverte, avec une lumière chaude à l’intérieur.'] },
    { run: () => { ch2b.buff = true; } },
    { say: ['Le buff d’Ishara se déclenche : un léger scintillement doré.', 'Félix : « Je vous attendais. »'] },
    { end: 'Le chapitre 3 arrive à la prochaine étape. Fin du prototype !' }
  ];
}

// Ishara reste derrière Yarden, à trois mètres au plus (canon). Elle ne se bat jamais.
function followIshara(seconds) {
  const actor = sceneActors.ishara;
  if (!actor || !['run', 'escalier'].includes(currentZone.id)) return;
  const dx = player.x - actor.x, dy = player.y - actor.y, distance = Math.hypot(dx, dy);
  actor.time += seconds;
  if (distance > 85) {
    const step = Math.min(distance - 70, 175 * seconds);
    actor.x += dx / distance * step;
    actor.y += dy / distance * step;
    Object.assign(actor, { dirX: dx / distance, dirY: dy / distance, moving: true, mode: 'move' });
    if (Math.abs(dx) > 8) actor.face = dx > 0 ? 1 : -1;
  } else Object.assign(actor, { moving: false, mode: 'idle' });
}

function updateChapter2b(seconds) {
  if (currentZone.id === 'run') collectRunLoot();
  if (!scene.active || scene.free) followIshara(seconds);
  if (currentZone.id === 'run' && !chapter2b.runDone && !scene.active && !story.active && zoneEnemies.run.every(enemy => enemy.hp <= 0)) {
    chapter2b.runDone = true;
    startScene(runEndScript());
  }
}
