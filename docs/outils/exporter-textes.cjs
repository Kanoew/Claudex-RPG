'use strict';

// Écrit docs/TEXTES.md : tous les textes du jeu, scène par scène, dans l'ordre où le joueur les lit, pour les relire sur GitHub.
// Usage (depuis la racine du dépôt) : node docs/outils/exporter-textes.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..', '..');
const deep = () => new Proxy(function () {}, {
  get: (_, key) => key === Symbol.toPrimitive ? () => 0 : key === 'length' ? 0 : deep(),
  apply: () => deep(), construct: () => deep(), set: () => true
});
const context = vm.createContext({ document: deep(), window: deep(), ResizeObserver: class { observe() {} }, MutationObserver: class { observe() {} }, requestAnimationFrame() {}, setInterval() { return 0; }, location: { search: '?skip' } });
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([a-z0-9-]+\.js)/g)].map(match => match[1]);
for (const file of files) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
const data = vm.runInContext('({ opening: openingScript(), rue: sceneScript(), sleep: nightScript(), mirror: mirrorScript(), impasse: impasseScript(), runEnd: runEndScript(), marterey: marteryScript(), comptoir: comptoirScript(), sousgare: sousgareScript(), quatreb: quatrebScript(), spots: apartmentSpots.map(s => ({ id: s.id, label: s.label, lines: s.lines() })), goals: [apartmentGoal()] })', context);

// Extras : objets du comptoir et objectifs par lieu (écrits dans un second appel, plus lisible).
data.comptoirSpots = vm.runInContext('comptoirSpots.map(spot => ({ label: spot.label, lines: spot.lines() }))', context);
data.zoneGoals = vm.runInContext(`Object.entries(zones).filter(entry => entry[1].goal).map(entry => { let goal = ""; try { goal = entry[1].goal(); } catch (error) { goal = "(dépend de la partie)"; } return { id: entry[0], goal }; })`, context);

const speaker = /^(Yarden|Ishara|Tiamat|Inconnue|Inconnu 1|Inconnu 2|Rémi|Félix)(?:\[([a-z]+)\])?(?: \(voix intérieure\))? : « ?([\s\S]*?) ?»$/;
function render(steps) {
  const out = [];
  for (const step of steps) {
    if (step.say) for (const line of step.say) out.push('- ' + line.replace(speaker, (m, who, expression, text) => `**${who}${expression ? ' (' + expression + ')' : ''}** : « ${text} »`));
    else if (step.card) out.push(`- *Carte plein écran : ${step.card}*`);
    else if (step.end) out.push(`- *Fin de scène : ${step.end}*`);
    else if (step.metro === 'show') out.push('- *Le métro (wagon animé)*');
    else if (step.mirror === 'show') out.push('- *Le miroir (portrait de Yarden)*');
    else if (step.music === 'fete') out.push('- *Musique de la fête*');
    else if (step.tattoo === true) out.push('- *Les tatouages luisent (la faux)*');
  }
  return out.join('\n');
}

const parts = [
  '# Textes du jeu', '',
  'Fichier généré par `node docs/outils/exporter-textes.cjs` : ne pas le modifier à la main. Les textes vivent dans le code (`opening.js`, `scene.js`, `apartment.js`, `mirror.js`, `chapitre2b.js`, `chapitre3.js`, `stats.js`, `hud.js`) ; ce fichier les rassemble pour la relecture. Une ligne `Nom (expression)` indique le visage montré dans la bulle.', '',
  '## Ouverture : la ruelle et la faille', '', render(data.opening), '',
  '## La rue : Ishara, les deux hommes, la marche, le métro, l’immeuble', '', render(data.rue), '',
  '## L’appartement : objets à examiner', '',
  data.spots.map(s => `- **${s.label}** : ${(s.lines || ['(rien avant la nuit)']).join(' ')}`).join('\n'), '',
  '## L’appartement : la première nuit (parquet, agents divins, tatouages)', '', render(data.sleep), '',
  '## Le miroir, puis le soutien-gorge d’Ishara', '', render(data.mirror), '',
  '## Le lendemain matin : l’impasse et la faille', '', render(data.impasse), '',
  '## Fin du run : le butin', '', render(data.runEnd), '',
  '## Rue Marterey : la porte marron', '', render(data.marterey), '',
  '## Le comptoir de Rémi', '', render(data.comptoir), '',
  '## Le 4B : Sous-gare, la cour, l’escalier', '', render(data.sousgare), '',
  '## Chapitre 3 : le 4B, Félix, les papiers', '', render(data.quatreb), '',
  '## Le comptoir de Rémi : objets à examiner', '', data.comptoirSpots.map(s => `- **${s.label}** : ${s.lines.join(' ')}`).join('\n'), '',
  '## Objectifs affichés en haut, par lieu', '', data.zoneGoals.map(z => `- **${z.id}** : ${z.goal}`).join('\n'), '',
  '## Objectif affiché en haut (appartement)', '', `- ${data.goals[0]}`, ''
];
fs.writeFileSync(path.join(root, 'docs', 'TEXTES.md'), parts.join('\n'));
console.log('docs/TEXTES.md écrit');
