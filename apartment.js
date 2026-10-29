'use strict';

// Appartement d'Ishara (chapitre 2) : on le parcourt et on examine ce que le canon de Jordan décrit (section 15 de PROJECT.md).
// Les textes ne reprennent que le canon, en narration ; Ishara ne dit rien de nouveau ici.
// Déroulé : arrivée (clés sur le comptoir, bouilloire, thé), exploration libre, première nuit dans la chambre d'appoint,
// matin (café, courbatures), puis la salle de bain et le miroir (étape suivante : pour l'instant la scène s'arrête là).
const home = { stage: 'arrive' };

const apartmentSpots = [
  { id: 'fenetre', x: -190, y: -262, r: 62, label: 'Fenêtre', lines: () => ['Des plantes sur le rebord de la fenêtre : c’est par là qu’entre la lumière.', 'Dehors, les toits de Lausanne virent à l’orange sale. Une mouette, un scooter.'] },
  { id: 'livres', x: -285, y: -232, r: 52, label: 'Livres', lines: () => ['Une pile de livres, rangés selon une logique qui n’appartient qu’à Ishara.'] },
  { id: 'tablebasse', x: -185, y: -148, r: 62, label: 'Table basse', lines: () => ['Deux tasses sur la table basse : une vide, une à moitié pleine.'] },
  { id: 'canape', x: -185, y: -68, r: 72, label: 'Canapé', lines: () => ['Le canapé fait face à la table basse. Pas de télé.'] },
  { id: 'table', x: 0, y: -100, r: 58, label: 'Table', lines: () => ['Une table que personne n’utilise. Ici, on mange debout, au comptoir.'] },
  { id: 'comptoir', x: 190, y: -150, r: 58, label: 'Comptoir', lines: () => ['Le comptoir s’ouvre sur le salon. Les clés d’Ishara y sont jetées ; la bouilloire est visible depuis le canapé.'] },
  { id: 'porte-ishara', x: 40, y: 225, r: 52, label: 'Porte fermée', lines: () => ['La porte est fermée.'] },
  { id: 'placard', x: -150, y: 245, r: 56, label: 'Placard', lines: () => ['La chambre est celle de la colocataire, absente : le placard contient ses affaires.'] },
  { id: 'cour', x: -292, y: 90, r: 48, label: 'Fenêtre sur cour', lines: () => ['Une fenêtre sur la cour intérieure. Sous un tapis fin, le parquet.'] },
  { id: 'lit', x: -228, y: 215, r: 58, label: 'Lit', lines: () => ['Un lit simple, aux draps propres.'] },
  { id: 'parquet', x: -170, y: 90, r: 60, label: 'Parquet', lines: () => ['Le parquet, sous un tapis fin.'], script: () => home.stage === 'arrive' ? sleepScript() : null },
  { id: 'shampoings', x: 290, y: 100, r: 60, label: 'Douche', lines: () => ['Petite, propre, encombrée par les affaires de deux personnes.', 'Deux shampoings : le violet est celui d’Ishara, le rouge celui de la colocataire.'] },
  { id: 'radiateur', x: 190, y: 105, r: 52, label: 'Radiateur', lines: () => ['Des serviettes sèchent sur le radiateur.'] },
  { id: 'miroir', x: 290, y: 28, r: 56, label: 'Lavabo', lines: () => ['Le robinet met trente secondes à chauffer.'], script: () => home.stage === 'matin' ? mirrorScript() : null }
];

function nearSpot() {
  if (currentZone.id !== 'appartement') return null;
  let best = null, bestDistance = Infinity;
  for (const spot of apartmentSpots) {
    const distance = Math.hypot(player.x - spot.x, player.y - spot.y);
    if (distance <= spot.r && distance < bestDistance) { best = spot; bestDistance = distance; }
  }
  return best;
}

const interactFree = () => !paused && !combatOver && !document.hidden && !encounterBlocksMovement();
const hasInteract = () => currentZone.id === 'antre' || currentZone.id === 'appartement';
const canInteract = () => currentZone.id === 'antre' ? canUseCrystal() : currentZone.id === 'appartement' && interactFree() && nearSpot() !== null;

function useInteract() {
  if (currentZone.id === 'antre') { useCrystal(); return; }
  if (!canInteract()) return;
  const spot = nearSpot();
  const script = spot.script && spot.script();
  if (script) { startScene(script); return; }
  const lines = spot.lines();
  if (lines) showStory(lines, null);
}

// Arrivée devant l'immeuble : Yarden et Ishara en bas de la rue, avant d'entrer.
function enterQuartier() {
  enterZone('quartier', 'start');
  for (const id of Object.keys(sceneActors)) delete sceneActors[id];
  sceneActor('ishara', 'ishara', -100, 150, { face: 1 });
}

function enterApartment(stage) {
  enterZone('appartement', 'start');
  abyssReached = true;
  home.stage = stage;
  for (const id of Object.keys(sceneActors)) delete sceneActors[id];
  if (stage === 'arrive') {
    sceneActor('ishara', 'ishara', 205, -112, { face: -1 });
    saveCheckpoint('appart');
  }
}

function resetApartment() {
  home.stage = 'arrive';
}

// Arrivée : les clés, la bouilloire, le thé (canon : thé, puis café ; courbatures ; première nuit).
function apartmentArrivalSteps() {
  return [
    { say: ['Troisième étage. Ishara jette ses clés sur le comptoir en rentrant.', 'Ishara[sourire] : « Thé ? »', 'Ishara : « Lait ? Sucre ? »', 'Yarden : « Noir. »', 'Ishara[sourire] : « Femme de goût. »', 'Ishara : « La chambre en trop, c’est la première à gauche. Y’a des trucs dans le placard si t’as besoin, ma coloc met des années à récupérer ses affaires. »', 'Ishara : « Salle de bain en face. Le robinet froid met trente secondes à devenir chaud, c’est normal. »', 'Ishara lance une serviette sans vérifier si Yarden l’attrape. Yarden l’attrape.'] },
    { finish: true }
  ];
}

function sleepScript() {
  return [
    { card: 'La première nuit', seconds: 2.4 },
    { run: () => { delete sceneActors.ishara; home.stage = 'matin'; Object.assign(player, { x: -170, y: 90 }); saveCheckpoint('matin'); updateStatus(); } },
    { say: ['Yarden passe la nuit sur le parquet de la chambre d’appoint.', 'Au matin : du café, et des courbatures.'] },
    { finish: true }
  ];
}

function apartmentGoal() {
  return home.stage === 'arrive' ? 'Explore · la chambre d’appoint est à gauche, dans le couloir' : 'Va à la salle de bain, en face de la chambre d’appoint';
}
