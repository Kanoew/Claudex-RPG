'use strict';

// Affichage des répliques : une ligne « Nom : « texte » » devient une bulle avec le nom et un visage. La voix de Tiamat est une voix
// intérieure : bulle violette en italique, avec la pierre bleue, jamais un visage. Les inconnus ont une silhouette. Le récit n'a ni nom ni visage.
const portraitArt = { yarden: null, ishara: null };
const speakerPattern = /^(Yarden|Ishara|Tiamat|Inconnue|Inconnu 1|Inconnu 2)(?: \(voix intérieure\))? : « ?([\s\S]*?) ?»$/;

function loadPortraits() {
  if (typeof Image === 'undefined') return;
  for (const [key, file] of [['yarden', 'assets/yarden/visage.png?v=48'], ['ishara', 'assets/npcs/ishara/chibi/idle.png?v=48']]) {
    const image = new Image();
    image.onload = () => { portraitArt[key] = image; };
    image.onerror = () => { portraitArt[key] = null; };
    image.src = file;
  }
}

function parseStoryLine(line) {
  const match = speakerPattern.exec(line);
  return match ? { who: match[1], text: match[2] } : { who: null, text: line };
}

function drawPortrait(who) {
  const canvas = document.getElementById('story-portrait');
  if (!canvas || !canvas.getContext) return;
  const pen = canvas.getContext('2d');
  const size = canvas.width;
  pen.clearRect(0, 0, size, size);
  pen.imageSmoothingEnabled = who !== 'Ishara' && who !== 'Inconnue';
  if (who === 'Yarden' && portraitArt.yarden) {
    pen.fillStyle = '#e9e0cc'; pen.fillRect(0, 0, size, size);
    pen.drawImage(portraitArt.yarden, 40, 40, 320, 320, 0, 0, size, size);
  } else if ((who === 'Ishara' || who === 'Inconnue') && portraitArt.ishara) {
    pen.fillStyle = '#d9c4a3'; pen.fillRect(0, 0, size, size);
    pen.drawImage(portraitArt.ishara, 12, 0, 62, 62, 0, 0, size, size);
  } else if (who === 'Tiamat') {
    // Pas de visage : la pierre bleue marbrée sur sa chaîne, qui pulse.
    const glow = pen.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
    glow.addColorStop(0, '#6b57e8'); glow.addColorStop(1, '#0d0a1e');
    pen.fillStyle = glow; pen.fillRect(0, 0, size, size);
    pen.fillStyle = '#5d8fd6'; pen.beginPath(); pen.arc(size / 2, size / 2, size * .2, 0, Math.PI * 2); pen.fill();
    pen.fillStyle = '#b6d0f5'; pen.beginPath(); pen.arc(size / 2 - 4, size / 2 - 5, size * .06, 0, Math.PI * 2); pen.fill();
  } else {
    // Inconnu ou image absente : silhouette.
    pen.fillStyle = '#242a35'; pen.fillRect(0, 0, size, size);
    pen.fillStyle = '#58606d'; pen.beginPath(); pen.arc(size / 2, size * .38, size * .18, 0, Math.PI * 2); pen.fill();
    pen.fillRect(size * .22, size * .62, size * .56, size * .4);
    pen.fillStyle = '#d9c4a3'; pen.font = `bold ${size * .3}px system-ui`; pen.textAlign = 'center'; pen.fillText('?', size / 2, size * .46);
  }
}

function showStoryLine(line) {
  const { who, text } = parseStoryLine(line);
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
  if (who !== null) drawPortrait(who);
}
