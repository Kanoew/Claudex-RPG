'use strict';

// Scène du miroir (chapitre 2, texte de Jordan raccourci et adapté au jeu) : le portrait de Yarden s'affiche dans un cadre de miroir pendant
// que le texte défile. Écarts assumés avec le roman : yeux violets (comme le portrait et les sprites), « elle » et « Yarden » partout, paragraphes
// des piercings, du dragon d'oreille et du collier retirés (entorse au canon pour faciliter les sprites, voulue par Jordan).
const mirrorArt = { image: null };
const mirrorSource = [1205, 1306];
const mirrorNow = () => typeof performance !== 'undefined' ? performance.now() / 1000 : 0;

function loadMirrorArt() {
  if (typeof Image === 'undefined') return;
  const image = new Image();
  image.onload = () => { mirrorArt.image = image; };
  image.onerror = () => { mirrorArt.image = null; };
  image.src = 'assets/yarden/visage.png?v=46';
}

// Étapes de scène : 'show' / 'hide'.
function mirrorStep(value) {
  document.getElementById('story-panel').classList.toggle('over-mirror', value === 'show');
  scene.mirror = value === 'show' ? { start: mirrorNow() } : null;
}

function drawSceneMirror() {
  const m = scene.mirror;
  if (!m) return;
  const fade = Math.min(1, (mirrorNow() - m.start) / .5);
  const viewport = typeof uxSceneViewport === 'function' ? uxSceneViewport() : { top: 0, bottom: height };
  const available = viewport.bottom - viewport.top;
  const portraitWidth = Math.min(width * .8, available * .8 * mirrorSource[0] / mirrorSource[1], 360);
  const portraitHeight = portraitWidth * mirrorSource[1] / mirrorSource[0];
  const left = (width - portraitWidth) / 2, top = viewport.top + Math.max(16, (available - portraitHeight) / 2);
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.fillStyle = '#140d09ee';
  ctx.fillRect(0, 0, width, height);
  // Cadre de miroir en bois chaud, verre clair.
  ctx.fillStyle = '#8a6a44';
  roundedRectPath(left - 12, top - 12, portraitWidth + 24, portraitHeight + 24, 16);
  ctx.fill();
  ctx.fillStyle = '#e9e0cc';
  roundedRectPath(left - 4, top - 4, portraitWidth + 8, portraitHeight + 8, 11);
  ctx.fill();
  if (mirrorArt.image) ctx.drawImage(mirrorArt.image, left, top, portraitWidth, portraitHeight);
  ctx.restore();
}

// Le texte reste lisible sans cacher le portrait : un paragraphe de narration trop long est coupé en phrases regroupées.
function splitNarration(line) {
  if (line.length <= 150 || line.includes('«')) return [line];
  const parts = [];
  let current = '';
  for (const sentence of line.split(/(?<=[.!?…])\s+(?=[A-ZÉÈÀÂ])/)) {
    if (current && (current + ' ' + sentence).length > 150) { parts.push(current); current = sentence; } else current = current ? current + ' ' + sentence : sentence;
  }
  if (current) parts.push(current);
  return parts;
}

function mirrorScript() {
  return mirrorSteps().map(step => step.say ? { say: step.say.flatMap(splitNarration) } : step);
}

function mirrorSteps() {
  return [
    { mirror: 'show' },
    { say: ['Yarden : « Tiamat. »', 'Tiamat : « Oui. »', 'Yarden[agacee] : « C’est quoi, ce style ? »', 'Tiamat : « Le tien. »', 'Yarden[agacee] : « On dirait le genre de péquenaud qui venait m’affronter, avant. »', 'Tiamat[amusee] : « Tu as l’air de quelqu’un qu’on remarque et qu’on ne questionne pas. Les humains rangent ce qu’ils voient. Ils te classeront dans "style assumé" et s’arrêteront là. Personne ne cherche un boss de donjon sous du liner. »'] },
    { say: ['Yarden[souriante] : « ...C’est acceptable. »', 'Tiamat : « Je sais. »'] },
    { mirror: 'hide' },
    { card: 'La douche', seconds: 2.2 },
    { run: () => { yardenOutfit = 'serviette'; } },
    { say: ['Trente secondes de froid. Puis l’eau devient chaude, presque trop.'] },
    // Il sort de la douche en serviette et n'arrive pas à fermer les crochets : il va voir Ishara. Dialogue seulement, rien n'est montré.
    { run: () => { sceneActor('ishara', 'ishara', -105, -100, { face: 1 }); } },
    { moves: [{ id: 'yarden', path: [{ x: 200, y: 60 }, { x: 30, y: 60 }, { x: 0, y: -10 }, { x: -60, y: -85 }], speed: 130 }] },
    { say: ['Yarden : « Ishara. J’ai un problème avec ce truc de fille. »', 'Tiamat[amusee] : « Un soutien-gorge. L’agrafe est dans le dos. »', 'Yarden : « Je réussis pas à la fermer. »', 'Ishara[sourire] : « Tourne-toi. »', 'Ishara : « Voilà. Deux secondes. »', 'Ishara[inquiete] : « Toi, ça va ? Tu t’adaptes ? »', 'Yarden : « Euh... oui, oui. »', 'Ishara : « Tiens, un t-shirt gris et un short. Le lit est propre. »'] },
    { run: () => { yardenOutfit = 'tshirt-short'; } },
    { say: ['Yarden : « Hmm, d’accord, merci. On verra demain. »'] },
    { run: () => { home.stage = 'nuit'; saveCheckpoint('nuit'); } },
    { finish: true }
  ];
}
