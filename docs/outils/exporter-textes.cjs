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
const context = vm.createContext({ document: deep(), window: deep(), ResizeObserver: class { observe() {} }, requestAnimationFrame() {}, setInterval() { return 0; }, location: { search: '?skip' } });
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([a-z-]+\.js)/g)].map(match => match[1]);
for (const file of files) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
const data = vm.runInContext('({ opening: openingScript(), rue: sceneScript(), sleep: sleepScript(), mirror: mirrorScript(), spots: apartmentSpots.map(s => ({ id: s.id, label: s.label, lines: s.lines() })), goals: [apartmentGoal()] })', context);

const speaker = /^(Yarden|Ishara|Tiamat|Inconnue|Inconnu 1|Inconnu 2)(?:\[([a-z]+)\])?(?: \(voix intérieure\))? : « ?([\s\S]*?) ?»$/;
function render(steps) {
  const out = [];
  for (const step of steps) {
    if (step.say) for (const line of step.say) out.push('- ' + line.replace(speaker, (m, who, expression, text) => `**${who}${expression ? ' (' + expression + ')' : ''}** : « ${text} »`));
    else if (step.card) out.push(`- *Carte plein écran : ${step.card}*`);
    else if (step.end) out.push(`- *Fin de scène : ${step.end}*`);
    else if (step.metro === 'show') out.push('- *Le métro (wagon animé)*');
    else if (step.mirror === 'show') out.push('- *Le miroir (portrait de Yarden)*');
    else if (step.music === 'fete') out.push('- *Musique de la fête*');
  }
  return out.join('\n');
}

const parts = [
  '# Textes du jeu', '',
  'Fichier généré par `node docs/outils/exporter-textes.cjs` : ne pas le modifier à la main. Les textes vivent dans le code (`opening.js`, `scene.js`, `apartment.js`, `mirror.js`, `stats.js`, `hud.js`) ; ce fichier les rassemble pour la relecture. Une ligne `Nom (expression)` indique le visage montré dans la bulle.', '',
  '## Ouverture : la ruelle et la faille', '', render(data.opening), '',
  '## La rue : Ishara, les deux hommes, la marche, le métro, l’immeuble', '', render(data.rue), '',
  '## L’appartement : objets à examiner', '',
  data.spots.map(s => `- **${s.label}** : ${(s.lines || ['(rien avant la nuit)']).join(' ')}`).join('\n'), '',
  '## L’appartement : la première nuit', '', render(data.sleep), '',
  '## Le miroir', '', render(data.mirror), '',
  '## Objectif affiché en haut (appartement)', '', `- ${data.goals[0]}`, ''
];
fs.writeFileSync(path.join(root, 'docs', 'TEXTES.md'), parts.join('\n'));
console.log('docs/TEXTES.md écrit');
