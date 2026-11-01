'use strict';

// Figurants animés du chapitre 4 (pack de Jordan) : planches PNG transparentes de cases 256 x 224, quatre colonnes, pieds à (128, 206).
// Chaque personnage a quelques séquences (repos, marche, course, attaque...) ; les durées viennent de docs/art/ch4/animations.json.
// Tous regardent à gauche ; les figurants anonymes peuvent être retournés. `scale` rapproche leur taille de celle de Yarden.
const sheetCell = { cell: [256, 224], anchor: [128, 206], columns: 4 };
const sheetScale = { creature: .67 };
const sheetClips = {"creature":{"repos":{"frames":[0,1,2,3],"durations":[700,350,150,700],"loop":true},"charge":{"frames":[4,5,6,7],"durations":[100,100,100,100],"loop":true},"attaque":{"frames":[8,9,10,11],"durations":[200,100,100,200],"loop":false},"degats":{"frames":[12,13],"durations":[150,200],"loop":false},"chute":{"frames":[14,15],"durations":[200,1000],"loop":false}},"jogger":{"repos":{"frames":[0,1],"durations":[1300,100],"loop":true},"sursaut":{"frames":[2,3],"durations":[200,250],"loop":false},"course-droite":{"frames":[4,5,6,7],"durations":[100,100,100,100],"loop":true},"course-gauche":{"frames":[8,9,10,11],"durations":[100,100,100,100],"loop":true}},"chef-technique":{"repos":{"frames":[0,1,2,3],"durations":[1100,350,100,1100],"loop":true},"marche-gauche":{"frames":[4,5,6,7],"durations":[200,200,200,200],"loop":true}},"operateur-a":{"repos":{"frames":[0,1,2,3],"durations":[1100,350,100,1100],"loop":true},"marche-gauche":{"frames":[4,5,6,7],"durations":[200,200,200,200],"loop":true}},"operateur-b":{"repos":{"frames":[0,1,2,3],"durations":[1100,350,100,1100],"loop":true},"marche-gauche":{"frames":[4,5,6,7],"durations":[200,200,200,200],"loop":true}},"operatrice-c":{"repos":{"frames":[0,1,2,3],"durations":[1100,350,100,1100],"loop":true},"marche-gauche":{"frames":[4,5,6,7],"durations":[200,200,200,200],"loop":true}},"operateur-d":{"repos":{"frames":[0,1,2,3],"durations":[1100,350,100,1100],"loop":true},"marche-gauche":{"frames":[4,5,6,7],"durations":[200,200,200,200],"loop":true}},"operatrice-e":{"repos":{"frames":[0,1,2,3],"durations":[1100,350,100,1100],"loop":true},"marche-gauche":{"frames":[4,5,6,7],"durations":[200,200,200,200],"loop":true}},"chef-costume":{"repos":{"frames":[0,1,2,3],"durations":[1100,350,100,1100],"loop":true},"marche-gauche":{"frames":[4,5,6,7],"durations":[200,200,200,200],"loop":true}},"operateur-a-costume":{"repos":{"frames":[0,1,2,3],"durations":[1100,350,100,1100],"loop":true},"marche-gauche":{"frames":[4,5,6,7],"durations":[200,200,200,200],"loop":true}},"operateur-b-costume":{"repos":{"frames":[0,1,2,3],"durations":[1100,350,100,1100],"loop":true},"marche-gauche":{"frames":[4,5,6,7],"durations":[200,200,200,200],"loop":true}}};
const sheetNames = Object.keys(sheetClips);

// Séquence jouée d'après l'état de l'acteur : creature (repos, charge, attaque, dégâts, chute), jogger, ou un membre de l'équipe.
function sheetClipName(actor) {
  if (actor.sheet === 'creature') return actor.pose === 'strike' ? 'attaque' : actor.pose === 'hurt' ? 'degats' : actor.pose === 'fall' ? 'chute' : actor.moving ? 'charge' : 'repos';
  if (actor.sheet === 'jogger') return actor.pose === 'startle' ? 'sursaut' : actor.moving ? (actor.dirX < 0 ? 'course-gauche' : 'course-droite') : 'repos';
  return actor.moving ? 'marche-gauche' : 'repos';
}

// Image à afficher : en boucle selon le temps, ou tenue sur la dernière case pour une séquence qui ne boucle pas.
function sheetFrame(clip, seconds) {
  const total = clip.durations.reduce((sum, value) => sum + value, 0);
  let left = clip.loop ? (seconds * 1000) % total : Math.min(seconds * 1000, total - 1);
  for (let i = 0; i < clip.durations.length; i++) {
    if (left < clip.durations[i]) return clip.frames[i];
    left -= clip.durations[i];
  }
  return clip.frames[clip.frames.length - 1];
}
