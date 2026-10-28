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
      { side: 'north', x: 0, half: 44, label: 'SORTIE', sealed: 'SCELLÉE', needs: 'exitOpen', to: 'exterieur', arrive: 'south' },
      { side: 'south', x: 0, half: 44, label: 'ENTRÉE', decorative: true }
    ],
    enemies: [{ kind: 'goblin', x: 0, y: -200 }, { kind: 'ogre', x: 220, y: -160 }, { kind: 'troll', x: 0, y: -220 }]
  },
  // Dehors : la ruelle d'Helvara où s'ouvre la faille (canon du chapitre 1). Une ruelle étroite, du bitume,
  // des murs de briques, une nuit d'été sous le ciel étouffé de la ville ; la fête d'une résidence
  // universitaire bat son plein à une trentaine de mètres. Les humains ne voient pas la faille : aucun
  // monstre ici, aucun PNJ. La faille est au fond (sud), la rue est au nord.
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
      { side: 'south', x: 0, half: 44, label: 'ABYSSE', to: 'donjon', arrive: 'north' },
      { side: 'north', x: 0, half: 44, label: 'RUE', end: 'Yarden a rejoint la rue. Fin du prototype !' }
    ],
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
zones.exterieur.props = [{ x: -150, y: -360, kind: 'lampe' }, { x: 150, y: -120, kind: 'lampe' }, { x: -140, y: 210, kind: 'lampe' }, ...scatterProps(zones.exterieur, 20261028, 60)];

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
