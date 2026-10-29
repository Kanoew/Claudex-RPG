'use strict';

// Ouverture du chapitre 1 d'après le canon de Jordan : Yarden se réveille dans la ruelle d'Helvara, une faille
// s'ouvre dans le mur de briques, le joueur marche jusqu'à elle et elle l'aspire. Pas de monstre ni de combat.
// Le récit reprend seulement le canon. Les répliques de Tiamat sont une proposition courte, à valider par Jordan :
// froide, calme, légèrement amusée, jamais chaleureuse, « partout » plutôt que derrière elle.
const openingRift = { x: 0, y: 505 };

function openingScript() {
  return [
    { run: () => { riftShown = false; updateStatus(); } },
    { say: [
      'Helvara, la nuit. Yarden se réveille dans une ruelle, adossée à un mur de briques.',
      'Plus loin, une fête bat son plein dans une résidence étudiante : musique, rires. Personne ne la remarque.',
      'Niveau 1. Un corps plus petit qu’avant, une voix plus haute. Ses souvenirs de combat sont en morceaux.',
      'Tiamat (voix intérieure) : « Réveillée. Ne cherche pas derrière toi : je suis partout. »'
    ] },
    { run: () => { riftShown = true; updateStatus(); } },
    { say: [
      'Dans le mur de briques, à quelques pas, une faille s’ouvre : une déchirure verticale en forme de bouche, aux bords d’un bleu profond. Elle aspire l’air avec un bruit sourd.',
      'Personne d’autre ne la voit.',
      'Tiamat : « C’est moi qui l’ai ouverte. La traverser sera ton choix. »'
    ] },
    { until: () => Math.hypot(player.x - openingRift.x, player.y - openingRift.y) < 100 },
    { moves: [{ id: 'yarden', path: [{ x: openingRift.x, y: openingRift.y - 10 }], speed: 150 }] },
    { say: ['Tiamat : « L’Abysse est trop dangereux pour une niveau 1. Je t’accompagne. »'] },
    { run: () => { enterZone('donjon', 'start'); saveCheckpoint('abysse'); } },
    { finish: true }
  ];
}

function startOpening() {
  resetDungeonRun();
  abyssReached = false;
  riftShown = false;
  loadZone('exterieur');
  Object.assign(player, zones.exterieur.start);
  yardenSprite.side = 'right';
  facing = { x: 1, y: 0 };
  startScene(openingScript());
  updateStatus();
}

// Commence directement dans le donjon, sans l'ouverture (lien ?skip et tests).
function skipOpening() {
  resetDungeonRun();
}
