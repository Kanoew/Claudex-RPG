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
  bag.length = 0; credits = 0; debt = 0; identityName = ''; scytheFreed = false; isharaOutfit = 'soiree';
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

function enterImpasse(save = true) {
  enterZone('impasse', 'start');
  clearActors();
  sceneActor('ishara', 'ishara', -130, 125, { face: 1 });
  if (save) saveCheckpoint('impasse');
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

// Le comptoir se visite : tout ce qui est décrit au canon peut être examiné (Examiner), avant de parler à Rémi.
const comptoirSpots = [
  { id: 'encens', x: -125, y: 0, r: 52, label: 'Encens', lines: () => ['De l’encens bon marché, et quelque chose de plus minéral dessous.'] },
  { id: 'balance', x: -70, y: -8, r: 44, label: 'Balance', lines: () => ['Une balance de précision, posée sur le comptoir.'] },
  { id: 'ardoise', x: 0, y: 6, r: 44, label: 'Ardoise', lines: () => ['Une ardoise à la craie, accrochée au mur. Aucune trace électronique.'] },
  { id: 'lampe', x: 75, y: -8, r: 48, label: 'Lampe', lines: () => ['Une lampe à spectre particulier : la lumière a une teinte verte, presque froide.'] },
  { id: 'porte', x: 0, y: 70, r: 40, label: 'Porte', lines: () => ['La porte marron, derrière elles. L’interphone ne fonctionne qu’à moitié.'] }
];

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

zones.quartier.goal = () => ch2b.goalText || 'Rejoins Ishara devant la porte ↑';

// Dimanche matin : Yarden suit Ishara dans la rue jusqu'à l'impasse (à pied), puis la faille s'ouvre devant elles.
function impasseScript() {
  return [
    { run: () => { isharaOutfit = 'course'; enterQuartier(); ch2b.goalText = 'Suis Ishara ←'; } },
    { say: ['Dimanche matin. Les rues sont presque vides.'] },
    { moves: [moveOf('ishara', [[-150, 168], [-236, 170]], 85)] },
    { until: () => player.x < -215 },
    { run: () => { ch2b.goalText = ''; ch2b.riftAt = 0; enterImpasse(); } },
    { say: ['Une impasse derrière un pressing fermé : c’est dimanche.', 'Dans l’air, un rectangle légèrement distordu, presque invisible en plein jour.'] },
    { say: ['Yarden : « Niveau estimé 16-17, il s’agit d’un espace restreint. »'] },
    { say: ['Ishara[inquiete] : « Hein, quoi ?! »'] },
    { run: () => { ch2b.riftAt = mirrorNow(); } },
    { wait: 1.5 },
    { say: ['Ishara[inquiete] : « Comment ?! »', 'Ishara : « Je t’accompagne, ou je reste derrière toi ? »', 'Yarden : « Derrière. »', 'Ishara : « Tu es de quel niveau, au juste ? »', 'Yarden : « Vingt-quatre. »', 'Ishara[inquiete] : « ...D’accord. Derrière toi, alors. »'] },
    { until: nearPlayer(impasseRift.x, impasseRift.y, 70) },
    { run: enterRun },
    { finish: true }
  ];
}

// Après le dernier gobelin : le butin, les deux heures dehors, puis la suite du chapitre.
function runEndScript() {
  return [
    { say: ['Les sept créatures sont tombées. Ishara prélève les matériaux.', 'Quatre fragments, deux bourses. Le plus gros : niveau 19, coupe propre.', 'Aucune expérience gagnée.'] },
    { card: 'Quarante minutes dedans, deux heures dehors.', seconds: 2.6 },
    { run: () => { enterImpasse(false); sceneActors.ishara.x = 20; sceneActors.ishara.y = -90; Object.assign(player, { x: 40, y: -120 }); ch2b.goalText = 'Suis Ishara ↓'; } },
    { moves: [moveOf('ishara', [[-60, 40], [-110, 150]], 85)] },
    { until: () => player.y > 135 },
    { run: () => { ch2b.goalText = ''; } },
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
    { run: () => { enterComptoir(); ch2b.goalText = 'Regarde autour de toi, puis rejoins le comptoir'; } },
    { say: ['Un couloir étroit. De l’encens bon marché, et quelque chose de plus minéral dessous.'] },
    { until: () => player.y < -18 && Math.abs(player.x) < 100 },
    { run: () => { ch2b.goalText = ''; } },
    { moves: [moveOf('ishara', [[-60, -12]], 95), moveOf('yarden', [[20, -12]], 95)] },
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
    { say: ['Quartier Sous-gare. Un immeuble Belle Époque, impeccable. Trop normal.'] },
    { camera: { x: 0, y: -230 } },
    { say: ['Quatre étages, des fenêtres alignées. Des géraniums au deuxième.'] },
    { camera: null },
    { moves: [moveOf('ishara', [[46, -38]], 80), moveOf('yarden', [[2, -38]], 80, { delay: .4 })] },
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
    { say: ['Le buff d’Ishara se déclenche tout seul : un léger scintillement doré.'] },
    ...quatrebScript()
  ];
}

// Ishara reste derrière Yarden, à trois mètres au plus (canon). Elle ne se bat jamais.
function followIshara(seconds) {
  const actor = sceneActors.ishara;
  if (!actor || !['run', 'escalier'].includes(currentZone.id)) return;
  const dx = player.x - actor.x, dy = player.y - actor.y, distance = Math.hypot(dx, dy);
  actor.time += seconds;
  // Départ au-delà de 95 px, arrêt en deçà de 75 px : pas de va-et-vient d'animation autour d'un seuil unique.
  if (distance > 95 || (actor.following && distance > 75)) {
    actor.following = true;
    const step = Math.min(distance - 70, 175 * seconds);
    actor.x += dx / distance * step;
    actor.y += dy / distance * step;
    Object.assign(actor, { dirX: dx / distance, dirY: dy / distance, moving: true, mode: 'move' });
    if (Math.abs(dx) > 8) actor.face = dx > 0 ? 1 : -1;
  } else { actor.following = false; Object.assign(actor, { moving: false, mode: 'idle' }); }
}

function updateChapter2b(seconds) {
  if (currentZone.id === 'run') collectRunLoot();
  if (!scene.active || scene.free) followIshara(seconds);
  if (currentZone.id === 'run' && !chapter2b.runDone && !scene.active && !story.active && zoneEnemies.run.every(enemy => enemy.hp <= 0)) {
    chapter2b.runDone = true;
    startScene(runEndScript());
  }
}
