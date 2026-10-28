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
      { side: 'north', x: 0, half: 44, label: 'SORTIE', sealed: 'SCELLÉE', needs: 'exitOpen', end: 'Yarden a quitté l’Abysse. Donjon terminé !' },
      { side: 'south', x: 0, half: 44, label: 'ENTRÉE', decorative: true }
    ],
    enemies: [{ kind: 'goblin', x: 0, y: -200 }, { kind: 'ogre', x: 220, y: -160 }, { kind: 'troll', x: 0, y: -220 }]
  }
};
let currentZone = zones.donjon;

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
