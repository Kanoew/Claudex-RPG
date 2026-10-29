'use strict';

// Scène du miroir (chapitre 2, texte de Jordan adapté au jeu) : le portrait de Yarden s'affiche dans un cadre de miroir pendant
// que le texte défile. Écarts assumés avec le roman, à garder en tête : yeux violets (comme le portrait et les sprites), « elle » et
// « Yarden » partout, paragraphe des piercings retiré (absents du portrait). Le dragon d'oreille et le collier n'existent pas sur le
// portrait : ils sont dessinés par-dessus pendant la scène, puis se dissolvent.
const mirrorArt = { image: null };
const mirrorSource = [1205, 1306];
const mirrorSpots = { ear: [940, 700], chain: [[505, 985], [610, 1085], [715, 985]], stone: [610, 1090] };
const mirrorNow = () => typeof performance !== 'undefined' ? performance.now() / 1000 : 0;

function loadMirrorArt() {
  if (typeof Image === 'undefined') return;
  const image = new Image();
  image.onload = () => { mirrorArt.image = image; };
  image.onerror = () => { mirrorArt.image = null; };
  image.src = 'assets/yarden/visage.png?v=46';
}

// Étapes de scène : 'show' / 'hide', ou des drapeaux { cuff, cuffDissolve, pendant, pendantDissolve }.
function mirrorStep(value) {
  document.getElementById('story-panel').classList.toggle('over-mirror', value === 'show' || (value !== 'hide' && scene.mirror !== null));
  if (value === 'show') scene.mirror = { start: mirrorNow(), cuff: false, cuffFrom: null, pendant: false, pendantFrom: null };
  else if (value === 'hide') scene.mirror = null;
  else if (scene.mirror) {
    const now = mirrorNow();
    if (value.cuff) scene.mirror.cuff = true;
    if (value.pendant) scene.mirror.pendant = true;
    if (value.cuffDissolve) scene.mirror.cuffFrom = now;
    if (value.pendantDissolve) scene.mirror.pendantFrom = now;
  }
}

function drawSceneMirror() {
  const m = scene.mirror;
  if (!m) return;
  const now = mirrorNow();
  const fade = Math.min(1, (now - m.start) / .5);
  const portraitWidth = Math.min(width * .8, height * .52 * mirrorSource[0] / mirrorSource[1], 360);
  const portraitHeight = portraitWidth * mirrorSource[1] / mirrorSource[0];
  const left = (width - portraitWidth) / 2, top = Math.max(16, height * .04);
  const scale = portraitWidth / mirrorSource[0];
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
  const at = ([x, y]) => [left + x * scale, top + y * scale];
  // Dragon d'argent sur l'oreille gauche (à droite sur l'image) : un petit anneau enroulé, qui se défait en brume.
  if (m.cuff) {
    const k = m.cuffFrom === null ? 0 : Math.min(1, (now - m.cuffFrom) / 1.4);
    const [x, y] = at(mirrorSpots.ear);
    ctx.globalAlpha = fade * (1 - k);
    ctx.strokeStyle = '#d9dde4'; ctx.lineWidth = Math.max(2, 9 * scale * 2);
    ctx.beginPath(); ctx.arc(x, y, 38 * scale * 2, -2.2, 1.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 6 * scale * 2, y - 24 * scale * 2, 9 * scale * 2, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 12 && k > 0; i++) {
      ctx.globalAlpha = fade * (1 - k) * .8;
      ctx.fillStyle = '#e7ebf2';
      ctx.fillRect(x + Math.cos(i * 1.7) * 34 * scale * 2 + k * 10 * Math.sin(i), y + Math.sin(i * 1.7) * 30 * scale * 2 - k * 60 * (.5 + i % 3 * .3), 3, 3);
    }
  }
  // Collier : chaîne fine et pierre bleue marbrée qui pulse, puis qui se dissout en chaleur.
  if (m.pendant) {
    const k = m.pendantFrom === null ? 0 : Math.min(1, (now - m.pendantFrom) / 1.8);
    const pulse = .5 + .5 * Math.sin(now * 5 * (1 + k * 2));
    const points = mirrorSpots.chain.map(at), [sx, sy] = at(mirrorSpots.stone);
    ctx.globalAlpha = fade * (1 - k);
    ctx.strokeStyle = '#d9dde4'; ctx.lineWidth = Math.max(1.5, 5 * scale * 2);
    ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]); ctx.quadraticCurveTo(points[1][0], points[1][1] + 14, points[2][0], points[2][1]); ctx.stroke();
    ctx.fillStyle = `rgba(100, 150, 230, ${.25 + pulse * .3})`;
    ctx.beginPath(); ctx.arc(sx, sy, (24 + pulse * 8) * scale * 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4f7fd0';
    ctx.beginPath(); ctx.arc(sx, sy, 13 * scale * 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a9c8f2';
    ctx.beginPath(); ctx.arc(sx - 3 * scale * 2, sy - 4 * scale * 2, 4 * scale * 2, 0, Math.PI * 2); ctx.fill();
    if (k > 0) {
      // La chaleur descend vers le sternum.
      ctx.globalAlpha = fade * Math.sin(k * Math.PI) * .6;
      ctx.fillStyle = '#ffb867';
      ctx.beginPath(); ctx.arc(sx, sy + k * 70 * scale * 2, (18 + k * 16) * scale * 2, 0, Math.PI * 2); ctx.fill();
    }
  }
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
    { say: ['Le robinet met trente secondes à chauffer.'] },
    { mirror: 'show' },
    { say: ['Le miroir était au-dessus du lavabo.', 'Quelqu’un le regardait.', 'Une fille. Traits acérés, mâchoire nette, peau pâle. Des yeux violets qui évaluaient — les siens, comprit-elle une demi-seconde trop tard, parce que la fille dans le miroir avait marqué exactement la même pause qu’elle, au même moment.', 'Elle s’approcha.'] },
    { say: ['Les cheveux d’abord. Noirs, avec des mèches d’une couleur qu’elle ne savait pas nommer — quelque chose entre le lavande et le gris, comme de la cendre qui aurait décidé d’être belle. Le chignon avait survécu à l’Abysse, aux ogres et à la soirée. Défait exactement comme il fallait. Elle n’avait rien fait pour ça.', 'Les lunettes. Rondes, monture fine, dorée. Elle les toucha du bout du doigt. Elles étaient là depuis le début et elle ne les avait jamais vues.', 'Le maquillage — noir-violet, quelque chose qui scintillait quand la tête bougeait, un trait de liner tiré au cordeau. Intact. Après deux combats, une paralysie au venin et une nuit dehors. Ce qui posait des questions de physique que Yarden choisit de ne pas poser ce soir.'] },
    { say: ['Yarden se pencha vers le miroir. Recula. Se pencha à nouveau.', 'Yarden : « Tiamat. »', 'Tiamat : « Oui. »', 'Yarden : « C’est quoi ce style. »', 'Tiamat : « Le tien. »', 'Yarden : « J’ai l’air d’une— »', 'Elle chercha le mot. Son vocabulaire millénaire n’en avait pas. Elle emprunta à la soirée étudiante.', 'Yarden : « — d’une gothique. »', 'Tiamat : « Tu as l’air de quelqu’un qu’on remarque et qu’on ne questionne pas. Les humains classent ce qu’ils voient. Ils te rangeront dans “style assumé” et s’arrêteront là. »', 'Tiamat : « Personne ne cherche un boss de donjon sous du liner. »'] },
    { say: ['Yarden regarda encore. Le plus étrange, c’était que ça ne la dérangeait pas. Le visage était froid, difficile à lire, avec quelque chose d’affûté dans le regard qui n’appartenait à aucune étudiante de vingt ans.', 'C’était un visage qu’elle aurait respecté, en face.', 'Yarden : « ...C’est acceptable. »', 'Tiamat : « Je sais. »'] },
    { mirror: { cuff: true } },
    { say: ['Elle tourna la tête pour examiner le profil.', 'Sur l’oreille gauche — un dragon.', 'Un ear cuff argenté, fin, enroulé sur le cartilage comme s’il dormait là depuis toujours. Yarden fronça les sourcils. Elle ne l’avait jamais senti. Pas une fois. Pas dans les combats, pas dans la ruelle, pas—', 'Tiamat : « Tu l’as remarqué. »', 'Ce n’était pas une question. Il y avait autre chose dans le ton. Quelque chose de conclusif.', 'Yarden : « C’était quoi. »', 'Tiamat : « Une protection. Pour la période où tu ne savais pas encore à quoi tu ressemblais. »', 'Tiamat : « Le maillon le plus fragile d’une couverture, c’est celui qui ne connaît pas son propre visage. »'] },
    { mirror: { cuffDissolve: true } },
    { say: ['Le dragon d’argent se réchauffa contre le cartilage. Une fois. Puis il se défit — pas comme un bijou qu’on retire, comme de la brume qui décide de partir — et il n’y eut plus rien sur l’oreille.', 'Tiamat : « Sa fonction est terminée. »'] },
    { mirror: { pendant: true } },
    { say: ['Et le collier suivit.'] },
    { mirror: { pendantDissolve: true } },
    { say: ['La pierre bleue marbrée pulsa une dernière fois contre sa gorge — plus longue, plus chaude que toutes les précédentes — puis la chaîne se dissout à son tour, et Yarden sentit quelque chose entrer. Pas disparaître. Migrer. Une chaleur qui descendait de la gorge vers le sternum, vers le tatouage du chest, vers la marque sur le flanc gauche. Qui s’installait.', 'Tiamat : « Le collier était un canal. Visible. Identifiable. Un agent compétent aurait fini par se demander pourquoi une Éveillée de niveau 24 porte un artefact qui pulse. »', 'Tiamat : « Maintenant, le canal, c’est toi. La marque suffit. »', 'Yarden : « Tu aurais pu faire ça dès le début. »', 'Tiamat : « Le collier avait un autre usage. Tu avais besoin de quelque chose à toucher pour croire que je suis réelle. »', 'Le ton était neutre, factuel — et précisément pour ça, un peu cruel.', 'Tiamat : « Ce besoin est passé. »', 'Yarden regarda sa gorge nue dans le miroir. Tiamat avait raison.', 'Elle détesta ça avec méthode.'] },
    { mirror: 'hide' },
    { end: 'Les tatouages arrivent à la prochaine étape. Fin du prototype !' }
  ];
}
