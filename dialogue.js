'use strict';

// Affichage des répliques : une ligne « Nom : « texte » » devient une bulle avec le nom et un visage. La voix de Tiamat est une voix
// intérieure : bulle violette en italique, avec la pierre bleue, jamais un visage. Les inconnus ont une silhouette. Le récit n'a ni nom ni visage.
const portraitArt = {};
const portraitNames = ['yarden-neutre', 'yarden-souriante', 'yarden-agacee', 'yarden-surprise', 'ishara-neutre', 'ishara-sourire', 'ishara-inquiete', 'inconnu-1-neutre', 'inconnu-1-menacant', 'inconnu-2-neutre', 'inconnu-2-menacant', 'remi-neutre', 'felix-neutre', 'ishara-course-neutre', 'ishara-course-sourire', 'ishara-course-inquiete'];
const portraitBase = { 'Yarden': 'yarden', 'Ishara': 'ishara', 'Inconnue': 'ishara', 'Inconnu 1': 'inconnu-1', 'Inconnu 2': 'inconnu-2', 'Rémi': 'remi', 'Félix': 'felix' };
// « Nom[expression] : « texte » » ; l'expression est facultative (neutre par défaut).
const speakerPattern = /^(Yarden|Ishara|Tiamat|Inconnue|Inconnu 1|Inconnu 2|Rémi|Félix)(?:\[([a-z]+)\])?(?: \(voix intérieure\))? : « ?([\s\S]*?) ?»$/;

function loadPortraits() {
  if (typeof Image === 'undefined') return;
  for (const name of portraitNames) {
    const image = new Image();
    image.onload = () => { portraitArt[name] = image; };
    image.onerror = () => { portraitArt[name] = null; };
    image.src = `assets/portraits/${name}.png?v=58`;
  }
}

function parseStoryLine(line) {
  const match = speakerPattern.exec(line);
  return match ? { who: match[1], expression: match[2] || 'neutre', text: match[3] } : { who: null, expression: null, text: line };
}

function drawPortrait(who, expression) {
  const canvas = document.getElementById('story-portrait');
  if (!canvas || !canvas.getContext) return;
  const pen = canvas.getContext('2d');
  const size = canvas.width;
  pen.clearRect(0, 0, size, size);
  const base = portraitBase[who];
  // En tenue de course, Ishara a son propre visage  ; les autres expressions gardent l'ancien dessin.
  const course = base === 'ishara' && isharaOutfit === 'course' && (portraitArt[`ishara-course-${expression}`] || portraitArt['ishara-course-neutre', 'ishara-course-sourire', 'ishara-course-inquiete']);
  const image = course || (base && (portraitArt[`${base}-${expression}`] || portraitArt[`${base}-neutre`]));
  if (image) {
    pen.fillStyle = '#2b3347'; pen.fillRect(0, 0, size, size);
    pen.drawImage(image, 0, 0, size, size);
  } else if (who === 'Tiamat') {
    // Pas de visage : un œil de dragon, iris bleu-violet et pupille fendue, dans le noir.
    const dark = pen.createRadialGradient(size / 2, size / 2, 6, size / 2, size / 2, size * .75);
    dark.addColorStop(0, '#2a1d52'); dark.addColorStop(1, '#0a0716');
    pen.fillStyle = dark; pen.fillRect(0, 0, size, size);
    const cx = size / 2, cy = size / 2, w = size * .42, h = size * .22;
    pen.beginPath();
    pen.moveTo(cx - w, cy); pen.quadraticCurveTo(cx, cy - h * 2.1, cx + w, cy); pen.quadraticCurveTo(cx, cy + h * 2.1, cx - w, cy);
    pen.closePath();
    pen.save(); pen.clip();
    const iris = pen.createRadialGradient(cx, cy, 4, cx, cy, w * .8);
    iris.addColorStop(0, '#d9e6ff'); iris.addColorStop(.35, '#6f8dff'); iris.addColorStop(1, '#3a2a8a');
    pen.fillStyle = iris; pen.fillRect(0, 0, size, size);
    pen.fillStyle = '#05030c'; pen.beginPath(); pen.ellipse(cx, cy, size * .045, h * 1.9, 0, 0, Math.PI * 2); pen.fill();
    pen.restore();
    pen.strokeStyle = '#a99cff'; pen.lineWidth = 3;
    pen.beginPath(); pen.moveTo(cx - w, cy); pen.quadraticCurveTo(cx, cy - h * 2.1, cx + w, cy); pen.quadraticCurveTo(cx, cy + h * 2.1, cx - w, cy); pen.stroke();
    pen.fillStyle = '#ffffffcc'; pen.beginPath(); pen.arc(cx - size * .1, cy - size * .09, size * .035, 0, Math.PI * 2); pen.fill();
  } else {
    // Image absente : silhouette.
    pen.fillStyle = '#242a35'; pen.fillRect(0, 0, size, size);
    pen.fillStyle = '#58606d'; pen.beginPath(); pen.arc(size / 2, size * .38, size * .18, 0, Math.PI * 2); pen.fill();
    pen.fillRect(size * .22, size * .62, size * .56, size * .4);
  }
}

function showStoryLine(line) {
  const { who, expression, text } = parseStoryLine(line);
  story.current = line;
  const card = document.getElementById('story-card');
  const portrait = document.getElementById('story-portrait');
  const name = document.getElementById('story-name');
  card.classList.toggle('tiamat', who === 'Tiamat');
  card.classList.toggle('speaker', who !== null);
  portrait.hidden = who === null;
  name.hidden = who === null;
  name.textContent = who === 'Tiamat' ? 'TIAMAT · VOIX INTÉRIEURE' : who === null ? '' : who.toUpperCase();
  document.getElementById('story-text').textContent = text;
  if (who !== null) drawPortrait(who, expression);
}
