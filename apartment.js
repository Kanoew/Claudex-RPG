'use strict';

// Appartement d'Ishara (chapitre 2) : on le parcourt et on examine ce que le canon de Jordan décrit (section 15 de PROJECT.md).
// Les textes ne reprennent que le canon, en narration ; Ishara ne dit rien de nouveau ici.
// Déroulé (canon de Jordan, section 26) : arrivée (clés sur le comptoir, thé), la douche et le miroir, le soutien-gorge d'Ishara,
// puis la première nuit sur le parquet (agents divins, tatouages), puis le matin (café, courbatures). Le run en Abysse vient ensuite.
const home = { stage: 'arrive' };
// Points examinables ajoutés par une scène (chapitre 6 : la recherche d'Izzy) : { zone, list }.
let extraSpots = null;

const apartmentSpots = [
  { id: 'fenetre', x: -190, y: -262, r: 62, label: 'Fenêtre', lines: () => ['Des plantes sur le rebord. Dehors, les toits virent à l’orange sale. Une mouette, un scooter.'] },
  { id: 'livres', x: -285, y: -232, r: 52, label: 'Livres', lines: () => ['Des livres empilés dans l’ordre qu’Ishara est la seule à comprendre.'] },
  { id: 'tablebasse', x: -185, y: -148, r: 62, label: 'Table basse', lines: () => ['Deux tasses sur la table basse : une vide, une à moitié pleine.'] },
  { id: 'canape', x: -185, y: -68, r: 72, label: 'Canapé', lines: () => ['Le canapé fait face à la table basse.'] },
  { id: 'table', x: 0, y: -100, r: 58, label: 'Table', lines: () => ['Une table, vide, comme souvent ici.'] },
  { id: 'comptoir', x: 190, y: -150, r: 58, label: 'Comptoir', lines: () => ['Le comptoir, les clés, la bouilloire.'] },
  { id: 'porte-ishara', x: 40, y: 225, r: 52, label: 'Porte fermée', lines: () => ['La porte est fermée.'] },
  { id: 'placard', x: -150, y: 245, r: 56, label: 'Placard', lines: () => ['Le placard contient des affaires qui ne sont pas les tiennes.'] },
  { id: 'cour', x: -292, y: 90, r: 48, label: 'Fenêtre sur cour', lines: () => ['Elle voit la cour intérieure.'] },
  { id: 'lit', x: -228, y: 215, r: 58, label: 'Lit', lines: () => ['Un lit simple, aux draps propres.'] },
  { id: 'parquet', x: -170, y: 90, r: 60, label: 'Parquet', lines: () => ['Le parquet, et un tapis fin.'], script: () => home.stage === 'nuit' ? nightScript() : null },
  { id: 'shampoings', x: 290, y: 100, r: 60, label: 'Douche', lines: () => ['Petite, propre, fonctionnelle. Deux shampoings. Violet, Ishara. Rouge, la coloc.'] },
  { id: 'radiateur', x: 190, y: 105, r: 52, label: 'Radiateur', lines: () => ['Des serviettes sèchent sur le radiateur.'] },
  { id: 'miroir', x: 290, y: 28, r: 56, label: 'Lavabo', lines: () => ['Le robinet. Simple, efficace.'], script: () => home.stage === 'arrive' ? mirrorScript() : null }
];

// Points examinables par zone : l'appartement d'Ishara et le comptoir de Rémi (chapitre2b.js).
function spotsOfZone() {
  if (currentZone.id === 'appartement') return apartmentSpots;
  if (currentZone.id === 'comptoir') return comptoirSpots;
  if (extraSpots && extraSpots.zone === currentZone.id) return extraSpots.list;
  return null;
}

function nearSpot() {
  const spots = spotsOfZone();
  if (!spots) return null;
  let best = null, bestDistance = Infinity;
  for (const spot of spots) {
    if (spot.available && !spot.available()) continue;
    const distance = Math.hypot(player.x - spot.x, player.y - spot.y);
    if (distance <= spot.r && distance < bestDistance) { best = spot; bestDistance = distance; }
  }
  return best;
}

const interactFree = () => !paused && !combatOver && !document.hidden && !encounterBlocksMovement();
const hasInteract = () => currentZone.id === 'antre' || currentZone.id === 'appartement' || currentZone.id === 'comptoir' || (extraSpots !== null && extraSpots.zone === currentZone.id);
const canInteract = () => currentZone.id === 'antre' ? canUseCrystal() : spotsOfZone() !== null && interactFree() && nearSpot() !== null;

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
    { say: ['Troisième étage. Ishara jette ses clés sur le comptoir en rentrant.', 'Ishara[sourire] : « Thé ? »', 'Ishara : « Lait ? Sucre ? »', 'Yarden : « Noir. »', 'Ishara[sourire] : « Femme de goût. »', 'Ishara : « La chambre en trop, c’est la première à gauche. Y’a des trucs dans le placard. Ma coloc revient pas tout de suite, fais comme chez toi. »', 'Ishara : « Salle de bain en face. Le robinet froid met trente secondes à devenir chaud, c’est normal. »'] },
    // Ishara disparaît dans le couloir, puis revient une serviette à la main.
    { moves: [{ id: 'ishara', path: [{ x: 120, y: -112 }, { x: 40, y: -20 }, { x: 0, y: 60 }], speed: 110 }] },
    { set: ['ishara', { visible: false }] },
    { wait: 1.4 },
    { run: () => { Object.assign(sceneActors.ishara, { visible: true, prop: 'serviette', face: 1 }); } },
    { moves: [{ id: 'ishara', path: [{ x: 60, y: -20 }, { x: 200, y: -100 }], speed: 110 }] },
    { say: ['Ishara lance une serviette sans vérifier si Yarden l’attrape. Yarden l’attrape.'] },
    { set: ['ishara', { prop: null }] },
    { finish: true }
  ];
}

// La première nuit : le lit est trop mou, Yarden dort sur le parquet. Tiamat, les agents divins, puis les tatouages.
// Répliques de Tiamat sur les agents et sur Ishara : propositions courtes à valider (le canon donne seulement « plusieurs organisations » et une réponse évasive).
function nightScript() {
  return [
    { card: 'La première nuit', seconds: 2.4 },
    { run: () => { delete sceneActors.ishara; Object.assign(player, { x: -170, y: 90 }); updateStatus(); } },
    { dark: true },
    { say: ['Le lit est trop mou. Yarden ne semble pas habituée à ce genre de confort. Elle dort par terre, avec l’oreiller.', 'Tiamat (voix intérieure) : « Pathétique. »', 'Yarden : « J’ai connu pire. »'] },
    { say: ['Yarden : « Il y a des agents des dieux, à Helvara ? »', 'Tiamat : « Plusieurs organisations. »', 'Yarden : « Et Ishara ? »', 'Tiamat : « Je ne dirai rien là-dessus. »'] },
    { tattoo: true },
    { run: () => { scytheFreed = true; } },
    { say: ['Dans le noir, les plumes tatouées sur son avant-bras droit se mettent à luire.', 'Tiamat : « Tes tatouages portent la faux. C’est à toi. »'] },
    { tattoo: false },
    { dark: false },
    { say: ['Au matin : du café, du thé et des courbatures.'] },
    { run: () => { home.stage = 'matin'; } },
    { card: 'Jour 2', seconds: 2 },
    ...impasseScript()
  ];
}

function apartmentGoal() {
  return home.stage === 'arrive' ? 'Va à la salle de bain, en face de la chambre d’appoint' : home.stage === 'nuit' ? 'Va dormir sur le parquet de la chambre d’appoint ←' : 'Le matin';
}
