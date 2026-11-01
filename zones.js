'use strict';

// Les zones du jeu sont des données : une salle rectangulaire, ses blocs solides, ses portes et ses
// monstres. `room` et `walls` (déclarés dans game.js) sont remplis à partir de la zone courante par
// loadZone() ; les quatre premiers murs entourent toujours la salle, les blocs viennent ensuite.
const wallThickness = 24;
const zones = {
  donjon: {
    id: 'donjon',
    title: 'ABYSSE · SALLE 1',
    theme: 'pierre',
    room: { x: -480, y: -336, width: 960, height: 672 },
    // Deux blocs neutres pour tester les collisions à l’intérieur de la salle.
    blocks: [{ x: -192, y: -96, width: 72, height: 144 }, { x: 120, y: 48, width: 96, height: 72 }],
    start: { x: 0, y: 240 },
    doors: [
      { side: 'north', x: 0, half: 44, label: 'ANTRE', sealed: 'SCELLÉE', needs: 'exitOpen', to: 'antre', arrive: 'south' },
      { side: 'south', x: 0, half: 44, label: 'ENTRÉE', decorative: true }
    ],
    enemies: [{ kind: 'goblin', x: 0, y: -200 }, { kind: 'ogre', x: 220, y: -160 }, { kind: 'troll', x: 0, y: -220 }]
  },
  antre: {
    id: 'antre', title: 'ABYSSE · ANTRE DE CRISTAL', theme: 'cristal',
    room: { x: -480, y: -400, width: 960, height: 800 },
    blocks: [{ x: -330, y: -180, width: 80, height: 100 }, { x: 230, y: -120, width: 90, height: 110 }],
    start: { x: 0, y: 310 },
    doors: [{ side: 'south', x: 0, half: 44, label: 'RETOUR', sealed: 'FILS', needs: 'antreOpen', to: 'donjon', arrive: 'north' }],
    enemies: [{ kind: 'spider', x: 0, y: -160 }],
    crystal: { x: -220, y: 80 },
    territory: { x: -200, y: -280, width: 400, height: 420 }
  },
  // Dehors : la ruelle d'Helvara où s'ouvre la faille (canon du chapitre 1). Une ruelle étroite, du bitume,
  // des murs de briques, une nuit d'été sous le ciel étouffé de la ville ; la fête d'une résidence
  // universitaire bat son plein à une trentaine de mètres. Les humains ne voient pas la faille : aucun
  // monstre ici. Deux passants provisoires ne réagissent pas à la faille. Elle est au fond (sud), la rue au nord.
  exterieur: {
    id: 'exterieur',
    title: 'HELVARA · RUELLE',
    theme: 'ruelle',
    room: { x: -200, y: -520, width: 400, height: 1040 },
    // Bennes, caisses, poubelles et scooter : obstacles en slalom, un côté puis l'autre.
    blocks: [
      { x: -200, y: 330, width: 110, height: 62, kind: 'benne' }, { x: 110, y: 230, width: 90, height: 84, kind: 'caisses' },
      { x: -200, y: 90, width: 56, height: 80, kind: 'poubelles' }, { x: 90, y: -50, width: 110, height: 46, kind: 'scooter' },
      { x: -200, y: -190, width: 100, height: 70, kind: 'caisses' }, { x: 120, y: -330, width: 80, height: 100, kind: 'benne' },
      { x: -200, y: -420, width: 90, height: 60, kind: 'poubelles' }
    ],
    doors: [
      { side: 'south', x: 0, half: 44, label: 'ABYSSE', needs: 'riftOpen', to: 'donjon', arrive: 'start' },
      { side: 'north', x: 0, half: 44, label: 'RUE', needs: 'streetOpen', sealed: 'PLUS TARD' }
    ],
    // Réveil de Yarden au chapitre 1, adossée au mur de gauche.
    start: { x: -180, y: 235 },
    enemies: [],
    props: []
  },
  // Petite rue devant un immeuble du quartier étudiant (Lausanne) : sert à arriver chez Ishara et se réutilisera pour d'autres immeubles.
  // Le nord est la façade et sa porte, puis un trottoir, puis la chaussée. Aucun canon précis n'est fourni sur cette rue : plan inventé à minima.
  quartier: {
    id: 'quartier', title: 'LAUSANNE · QUARTIER ÉTUDIANT', theme: 'quartier',
    room: { x: -260, y: -200, width: 520, height: 420 },
    start: { x: -150, y: 170 },
    blocks: [
      { x: -260, y: -200, width: 520, height: 120, kind: 'facade' },
      // Sur le trottoir : vélos, poubelle, arbres en bac et jardinières. Deux voitures garées à moitié sur le trottoir, à moitié sur la route.
      { x: -240, y: -76, width: 70, height: 26, kind: 'velos' }, { x: 160, y: -76, width: 70, height: 26, kind: 'velos' }, { x: 80, y: -70, width: 22, height: 22, kind: 'poubelle' },
      { x: -142, y: -76, width: 28, height: 28, kind: 'arbre' }, { x: 112, y: -76, width: 28, height: 28, kind: 'arbre' },
      { x: -78, y: -62, width: 30, height: 16, kind: 'fleurs' }, { x: 48, y: -62, width: 30, height: 16, kind: 'fleurs' },
      { x: -226, y: -36, width: 96, height: 50, kind: 'voiture', tint: '#7a2f3a' }, { x: 134, y: -36, width: 96, height: 50, kind: 'voiture', tint: '#3d5568' }
    ],
    doors: [],
    enemies: [],
    props: []
  },
  // Chapitre 2, le lendemain matin. Plans inventés à minima ; les canons sont dans PROJECT.md, sections 27 à 29.
  // Impasse derrière un pressing fermé : la faille est un rectangle d'air légèrement distordu, presque invisible en plein jour.
  impasse: {
    id: 'impasse', title: 'LAUSANNE · IMPASSE', theme: 'impasse',
    room: { x: -170, y: -200, width: 340, height: 360 },
    start: { x: -100, y: 110 },
    blocks: [
      { x: -170, y: -200, width: 150, height: 110, kind: 'pressing' }, { x: 90, y: -200, width: 80, height: 100, kind: 'mur' },
      { x: 100, y: -20, width: 56, height: 62, kind: 'poubelles' }, { x: -160, y: 20, width: 30, height: 70, kind: 'velo' }
    ],
    doors: [], enemies: [], props: []
  },
  // Premier run en Abysse sous le niveau 20 : tunnel d'entrée, salle plate, obstacles neutres (piliers de roche), couloir sans issue à l'est.
  // Sept gobelins de niveau 15 à 19 ; la lumière est ocre (prose du chapitre 2). Pas d'expérience gagnée.
  run: {
    id: 'run', title: 'ABYSSE · NIVEAUX 15 À 19', theme: 'ocre',
    room: { x: -470, y: -300, width: 940, height: 720 },
    start: { x: 0, y: 380 },
    blocks: [
      { x: -470, y: 250, width: 430, height: 170, kind: 'roc' }, { x: 40, y: 250, width: 430, height: 170, kind: 'roc' },
      { x: 330, y: -300, width: 140, height: 160, kind: 'roc' }, { x: 330, y: -60, width: 140, height: 310, kind: 'roc' },
      { x: -300, y: -110, width: 56, height: 56, kind: 'pilier' }, { x: -140, y: 50, width: 56, height: 56, kind: 'pilier' },
      { x: 120, y: -150, width: 56, height: 56, kind: 'pilier' }, { x: 250, y: 60, width: 56, height: 56, kind: 'pilier' },
      { x: -350, y: 120, width: 56, height: 56, kind: 'pilier' }, { x: 0, y: -40, width: 56, height: 56, kind: 'pilier' }
    ],
    doors: [],
    enemies: [
      { kind: 'goblin', x: -330, y: -200, aggro: 260, level: 15 }, { kind: 'goblin', x: -180, y: -170, aggro: 260, level: 16 },
      { kind: 'sauteur', x: 60, y: -230, aggro: 280, level: 17 }, { kind: 'goblin', x: -250, y: 20, aggro: 260, level: 18 },
      { kind: 'goblin', x: 200, y: -20, aggro: 260, level: 19 }, { kind: 'goblin', x: 20, y: 120, aggro: 260, level: 16 },
      { kind: 'fuyard', x: 230, y: -100, aggro: 300, level: 15, refuge: { x: 440, y: -100 } }
    ],
    props: []
  },
  // Rue Marterey : une porte marron sans enseigne entre un kebab et une laverie.
  marterey: {
    id: 'marterey', title: 'LAUSANNE · RUE MARTEREY', theme: 'marterey',
    room: { x: -260, y: -180, width: 520, height: 340 },
    start: { x: -60, y: 110 },
    blocks: [
      { x: -260, y: -180, width: 200, height: 110, kind: 'kebab' }, { x: -60, y: -180, width: 120, height: 110, kind: 'porte-marron' }, { x: 60, y: -180, width: 200, height: 110, kind: 'laverie' }
    ],
    doors: [], enemies: [], props: []
  },
  // Le comptoir de Rémi : couloir étroit, puis un comptoir avec une lampe spéciale, une balance et une ardoise à la craie. Aucune trace électronique.
  comptoir: {
    id: 'comptoir', title: 'LAUSANNE · LE COMPTOIR', theme: 'comptoir',
    room: { x: -160, y: -200, width: 320, height: 420 },
    start: { x: 0, y: 180 },
    blocks: [
      { x: -160, y: 40, width: 115, height: 180, kind: 'mur-int' }, { x: 45, y: 40, width: 115, height: 180, kind: 'mur-int' },
      { x: -110, y: -70, width: 220, height: 34, kind: 'comptoir-remi' }
    ],
    doors: [], enemies: [], props: []
  },
  // Quartier Sous-gare : l'immeuble Belle Époque « trop normal ».
  sousgare: {
    id: 'sousgare', title: 'LAUSANNE · SOUS-GARE', theme: 'sousgare',
    room: { x: -260, y: -330, width: 520, height: 510 },
    start: { x: -120, y: 140 },
    blocks: [{ x: -260, y: -330, width: 520, height: 260, kind: 'belle-epoque' }],
    doors: [], enemies: [], props: []
  },
  // Cour intérieure : tout est taillé au millimètre.
  cour: {
    id: 'cour', title: 'SOUS-GARE · LA COUR', theme: 'cour',
    room: { x: -140, y: -200, width: 280, height: 380 },
    start: { x: 0, y: 140 },
    blocks: [
      { x: -140, y: -200, width: 28, height: 380, kind: 'lierre' }, { x: 112, y: -200, width: 28, height: 380, kind: 'lierre' },
      { x: -90, y: -60, width: 44, height: 44, kind: 'arbuste' }, { x: 46, y: -60, width: 44, height: 44, kind: 'arbuste' }
    ],
    doors: [], enemies: [], props: []
  },
  // Escalier de pierre jusqu'au 4B : l'air devient plus lourd à chaque étage.
  escalier: {
    id: 'escalier', title: 'SOUS-GARE · ESCALIER', theme: 'escalier',
    room: { x: -90, y: -640, width: 180, height: 900 },
    start: { x: 0, y: 220 },
    blocks: [],
    doors: [], enemies: [], props: []
  },
  // Le 4B (chapitre 3) : un appartement chaud et encombré, qui est Félix lui-même. Plan inventé à minima.
  quatreb: {
    id: 'quatreb', title: 'SOUS-GARE · LE 4B', theme: 'quatreb',
    room: { x: -190, y: -250, width: 380, height: 420 },
    start: { x: 0, y: 140 },
    blocks: [
      { x: -190, y: -250, width: 46, height: 330, kind: 'etagere' }, { x: 144, y: -250, width: 46, height: 330, kind: 'etagere' },
      { x: -144, y: -250, width: 288, height: 56, kind: 'papier' }, { x: -48, y: -134, width: 96, height: 40, kind: 'bureau' }
    ],
    doors: [], enemies: [], props: []
  },
  // Chapitre 4 : un square du matin, où la rupture urbaine se déchire. Plan inventé à minima.
  square: {
    id: 'square', title: 'LAUSANNE · LE SQUARE', theme: 'square',
    room: { x: -300, y: -230, width: 600, height: 450 },
    start: { x: -120, y: 180 },
    blocks: [
      { x: -300, y: -230, width: 600, height: 100, kind: 'immeuble-sq' },
      { x: -198, y: -48, width: 14, height: 14, kind: 'lampadaire' }, { x: 176, y: -62, width: 14, height: 14, kind: 'lampadaire' },
      { x: -44, y: 28, width: 92, height: 24, kind: 'banc' },
      { x: -262, y: 60, width: 34, height: 34, kind: 'arbre' }, { x: 226, y: 74, width: 34, height: 34, kind: 'arbre' }
    ],
    doors: [], enemies: [{ kind: 'chitine', x: 0, y: -110, level: 28, aggro: 320 }], props: []
  },
  // Appartement d'Ishara (canon de Jordan, section 15 de PROJECT.md) : troisième étage, quartier étudiant, Lausanne.
  // Plan inventé à minima : l'entrée et la cuisine à l'est, le salon à l'ouest, le couloir au sud du salon, la chambre d'appoint
  // à gauche du couloir, la salle de bain en face, la chambre d'Ishara fermée. Palette chaude, jamais de bleu.
  appartement: {
    id: 'appartement', title: 'LAUSANNE · CHEZ ISHARA', theme: 'appart',
    room: { x: -320, y: -300, width: 640, height: 600 },
    start: { x: 285, y: -95 },
    blocks: [
      // Cloisons : le couloir (x -60 à 60) relie le salon aux chambres.
      { x: -320, y: -30, width: 260, height: 20, kind: 'cloison' }, { x: 60, y: -30, width: 260, height: 20, kind: 'cloison' },
      { x: -80, y: -10, width: 20, height: 50, kind: 'cloison' }, { x: -80, y: 120, width: 20, height: 180, kind: 'cloison' },
      { x: 60, y: -10, width: 20, height: 40, kind: 'cloison' }, { x: 60, y: 110, width: 20, height: 190, kind: 'cloison', door: 'ishara' },
      { x: 80, y: 150, width: 240, height: 20, kind: 'cloison' },
      // Salon et cuisine.
      { x: -250, y: -90, width: 130, height: 44, kind: 'canape' }, { x: -235, y: -170, width: 100, height: 44, kind: 'tablebasse' },
      { x: -310, y: -290, width: 34, height: 44, kind: 'livres' }, { x: -30, y: -130, width: 60, height: 60, kind: 'table' },
      { x: 70, y: -180, width: 240, height: 36, kind: 'comptoir' }, { x: 70, y: -300, width: 240, height: 40, kind: 'cuisine' },
      // Chambre d'appoint et salle de bain.
      { x: -310, y: 150, width: 90, height: 140, kind: 'lit' }, { x: -210, y: 255, width: 120, height: 40, kind: 'placard' },
      { x: 140, y: 120, width: 100, height: 30, kind: 'radiateur' }, { x: 260, y: 86, width: 60, height: 64, kind: 'douche' }, { x: 255, y: -10, width: 65, height: 36, kind: 'lavabo' }
    ],
    doors: [],
    enemies: [],
    props: []
  }
};
let currentZone = zones.donjon;

// Flaques, papiers, mégots et fissures : décor sans collision, placé une fois pour toutes avec un
// générateur à graine fixe, pour que la ruelle soit toujours la même. Les lampadaires sont à des
// positions fixes : ils éclairent des cercles de bitume.
function scatterProps(zone, seed, count) {
  let state = seed;
  const next = () => (state = (state * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const r = zone.room, props = [], kinds = ['fissure', 'fissure', 'papier', 'papier', 'flaque', 'megot'];
  while (props.length < count) {
    const x = r.x + 20 + next() * (r.width - 40), y = r.y + 20 + next() * (r.height - 40);
    if (zone.blocks.some(b => x > b.x - 12 && x < b.x + b.width + 12 && y > b.y - 12 && y < b.y + b.height + 12)) continue;
    props.push({ x: Math.round(x), y: Math.round(y), kind: kinds[Math.floor(next() * kinds.length)] });
  }
  return props;
}
zones.exterieur.props = [{ x: 96, y: -498, kind: 'residence' }, { x: -150, y: -360, kind: 'lampe' }, { x: 150, y: -120, kind: 'lampe' }, { x: -140, y: 210, kind: 'lampe-eteinte' }, { x: 190, y: 420, kind: 'grille' }, ...scatterProps(zones.exterieur, 20261028, 60)];

function zoneWalls(zone) {
  const r = zone.room;
  return [
    { x: r.x - wallThickness, y: r.y - wallThickness, width: r.width + wallThickness * 2, height: wallThickness },
    { x: r.x - wallThickness, y: r.y + r.height, width: r.width + wallThickness * 2, height: wallThickness },
    { x: r.x - wallThickness, y: r.y, width: wallThickness, height: r.height },
    { x: r.x + r.width, y: r.y, width: wallThickness, height: r.height },
    ...zone.blocks.map(block => ({ ...block }))
  ];
}

// Remplit `room` et `walls` en place : les autres fichiers gardent les mêmes références.
function loadZone(id) {
  currentZone = zones[id];
  Object.assign(room, currentZone.room);
  walls.length = 0;
  walls.push(...zoneWalls(currentZone));
}
