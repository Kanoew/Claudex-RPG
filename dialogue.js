'use strict';

// Affichage des répliques : une ligne « Nom : « texte » » devient une bulle avec le nom et un visage. La voix de Tiamat est une voix
// intérieure : bulle violette en italique, avec la pierre bleue, jamais un visage. Les inconnus ont une silhouette. Le récit n'a ni nom ni visage.
const portraitArt = {};
const portraitNames = ['yarden-neutre', 'yarden-souriante', 'yarden-agacee', 'yarden-surprise', 'ishara-neutre', 'ishara-sourire', 'ishara-inquiete', 'inconnu-1-neutre', 'inconnu-1-menacant', 'inconnu-2-neutre', 'inconnu-2-menacant'];
const portraitBase = { 'Yarden': 'yarden', 'Ishara': 'ishara', 'Inconnue': 'ishara', 'Inconnu 1': 'inconnu-1', 'Inconnu 2': 'inconnu-2' };
// « Nom[expression] : « texte » » ; l'expression est facultative (neutre par défaut).
const speakerPattern = /^(Yarden|Ishara|Tiamat|Inconnue|Inconnu 1|Inconnu 2)(?:\[([a-z]+)\])?(?: \(voix intérieure\))? : « ?([\s\S]*?) ?»$/;

function loadPortraits() {
  if (typeof Image === 'undefined') return;
  for (const name of portraitNames) {
    const image = new Image();
    image.onload = () => { portraitArt[name] = image; };
    image.onerror = () => { portraitArt[name] = null; };
    image.src = `assets/portraits/${name}.png?v=49`;
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
  const image = base && (portraitArt[`${base}-${expression}`] || portraitArt[`${base}-neutre`]);
  if (image) {
    pen.fillStyle = '#2b3347'; pen.fillRect(0, 0, size, size);
    pen.drawImage(image, 0, 0, size, size);
  } else if (who === 'Tiamat') {
    // Pas de visage : la pierre bleue marbrée sur sa chaîne.
    const glow = pen.createRadialGradient(size / 2, size / 2, 6, size / 2, size / 2, size / 2);
    glow.addColorStop(0, '#6b57e8'); glow.addColorStop(1, '#0d0a1e');
    pen.fillStyle = glow; pen.fillRect(0, 0, size, size);
    pen.fillStyle = '#5d8fd6'; pen.beginPath(); pen.arc(size / 2, size / 2, size * .2, 0, Math.PI * 2); pen.fill();
    pen.fillStyle = '#b6d0f5'; pen.beginPath(); pen.arc(size / 2 - 8, size / 2 - 10, size * .06, 0, Math.PI * 2); pen.fill();
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
