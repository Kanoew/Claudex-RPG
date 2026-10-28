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
  // Première zone dehors : pas de PNJ ni de quête, seulement de l'exploration et deux gobelins.
  // Le canon ne décrit pas cet extérieur : son apparence est un choix de design provisoire.
  exterieur: {
    id: 'exterieur',
    title: 'EXTÉRIEUR · PREMIÈRE ZONE',
    theme: 'dehors',
    room: { x: -600, y: -400, width: 1200, height: 800 },
    // Rochers solides, répartis pour laisser un chemin dégagé entre la grotte (sud) et le sentier (nord).
    blocks: [
      { x: -330, y: -170, width: 120, height: 90 }, { x: 210, y: -250, width: 140, height: 100 },
      { x: -90, y: -40, width: 80, height: 80 }, { x: 300, y: 70, width: 100, height: 130 },
      { x: -500, y: 120, width: 90, height: 120 }, { x: 90, y: 170, width: 110, height: 70 },
      { x: -180, y: 230, width: 90, height: 70 }
    ],
    doors: [
      { side: 'south', x: 0, half: 44, label: 'ABYSSE', to: 'donjon', arrive: 'north' },
      { side: 'north', x: 0, half: 44, label: 'SENTIER', end: 'Première zone traversée. Fin du prototype !' }
    ],
    // Un gobelin ne bouge qu'une fois Yarden à moins de 320 pixels, puis il la poursuit comme les autres.
    enemies: [{ kind: 'goblin', x: -250, y: -290, aggro: 320 }, { kind: 'goblin', x: 440, y: -120, aggro: 320 }],
    props: []
  }
};
let currentZone = zones.donjon;

// Brins d'herbe, cailloux et fleurs : décor sans collision, placé une fois pour toutes avec un
// générateur à graine fixe, pour que la zone soit toujours la même.
function scatterProps(zone, seed, count) {
  let state = seed;
  const next = () => (state = (state * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const r = zone.room, props = [], kinds = ['tuft', 'tuft', 'pebble', 'flower'];
  while (props.length < count) {
    const x = r.x + 30 + next() * (r.width - 60), y = r.y + 30 + next() * (r.height - 60);
    if (zone.blocks.some(b => x > b.x - 12 && x < b.x + b.width + 12 && y > b.y - 12 && y < b.y + b.height + 12)) continue;
    props.push({ x: Math.round(x), y: Math.round(y), kind: kinds[Math.floor(next() * kinds.length)] });
  }
  return props;
}
zones.exterieur.props = scatterProps(zones.exterieur, 20261028, 90);

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
