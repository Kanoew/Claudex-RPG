'use strict';

// Chapitre 3, « Ce qui obéit aux murs » : la scène du 4B, les papiers et le nom Yarden Weiss. Canon : PROJECT.md, section 30.
// Seuls les éléments cités dans PROJECT.md sont canon (la phrase de Félix à Yarden, la formule de Tiamat, le prix et la dette).
// Les autres répliques sont des propositions courtes à relire dans docs/TEXTES.md, car le texte exact du roman manque.
// Entorses assumées : crédits au lieu de francs, Yarden et « elle » à la place de Jordan et « il ».
const quatrebPrice = { total: 800, deposit: 280, debt: 520 };

function enterQuatreB() {
  enterZone('quatreb', 'start');
  clearActors();
  sceneActor('ishara', 'ishara', -40, 160, { face: 1 });
  sceneActor('felix', 'felix', 0, -115);
  saveCheckpoint('quatreb');
}

zones.quatreb.goal = () => 'Parle à Félix';
zones.quatreb.label = () => 'Le 4B';

function quatrebScript() {
  return [
    { run: enterQuatreB },
    { say: ['La porte cède sans résistance, comme si elle attendait la main.', 'L’air change de densité, pas de température : une pression basse contre la mâchoire.'] },
    { say: ['Un appartement chaud, encombré, presque domestique. Du papier punaisé en couches sur tous les murs : documents jaunis, tampons, filigranes, écritures dans des alphabets inconnus.', 'Des étagères du sol au plafond. Des bocaux qui contiennent des choses qui ont été vivantes. Des crânes alignés, propres, tournés vers la pièce comme un public patient.'] },
    { moves: [moveOf('yarden', [[0, -40]], 80), moveOf('ishara', [[-48, -20]], 80, { delay: .3 })] },
    { say: ['Au fond, derrière la table de travail, Félix ne se lève pas. Il ne bouge pas de la bonne façon : posé comme le mobilier.', 'Aucun niveau lisible. Pas un zéro : une absence lisse.'] },
    { say: ['Félix : « Vous êtes récente… Deux jours. Peut-être moins. Et soigneusement rangée sous quelque chose. »'] },
    { say: ['Ishara : « Félix, c’est elle. Il lui faut un nom. Et des papiers. »', 'Félix : « Le 4B n’est pas ma maison, mademoiselle. Le 4B, c’est moi. Le corps en tablier est une commodité : pratique pour tremper une plume. »'] },
    { say: ['Félix : « Je ne lis que les liens et les serments. Et seulement si on me le permet. »', 'Félix : « Il me faut un oui explicite de la jeune femme, avant de lire sa corde. »'] },
    { say: ['Ishara : « Oui. »'] },
    { say: ['Yarden : « Avant de signer quoi que ce soit : le prix du silence. »', 'Félix : « Vous refusez de signer sans connaître le prix. C’est sain. Continuons. »'] },
    { say: ['La voix de Yarden change. Ce n’est plus tout à fait la sienne.', 'Tiamat : « Mithra. »', 'Félix : « Ah. Elle parle, alors. »'] },
    { say: ['Tiamat : « Ton résidu scelle, moi je masque. Deux vieux métiers différents, dans deux maisons différentes. »', 'Tiamat : « Nous pouvons travailler côte à côte sans nous toucher. »'] },
    { say: ['Félix[neutre] : « Soit. »', 'Félix lit la corde d’Ishara. Une corde de témoin, tendue vers Yarden. La signature du dieu a été effacée, volontairement.', 'Félix : « Intéressant. Je n’en dirai rien. »'] },
    { say: ['Félix : « Un nom, maintenant. »', 'Yarden : « Yarden. »', 'Félix : « Yarden. Le Jourdain, la racine qui descend. Un nom unisexe à l’origine. Pour le reste, Weiss : personne ne regarde un Weiss. »', 'Félix : « Suisse par un grand-parent, née ailleurs, arrivée jeune. Vingt-deux ans sur le papier. »'] },
    { say: ['Yarden : « Vingt-deux. »', 'Félix : « Le corps en paraît vingt. Un écart assumé. Ça explique le léger décalage, et personne n’ira creuser. »'] },
    { say: ['Félix : « Huit cents crédits en tout. Deux cent quatre-vingts maintenant, cinq cent vingt en dette. »', 'Félix : « Des crédits pour le nom. Et, pour le silence : ne pas avoir à le regretter. »', 'Félix : « Un nom qu’on n’a pas fini de payer est un nom qu’on ne trahit pas. »'] },
    { run: () => { credits = 0; debt = quatrebPrice.debt; identityName = 'Yarden Weiss'; } },
    { say: ['Yarden verse l’acompte : 280 → 0. Il reste une dette de 520.', 'Félix : « Vos papiers seront prêts dans trois jours. »'] },
    { say: ['Ishara[sourire] : « Yarden Weiss. »', 'Yarden : « C’est étrange à entendre. »'] },
    { moves: [moveOf('yarden', [[0, 120]], 90), moveOf('ishara', [[-20, 130]], 90, { delay: .3 })] },
    { say: ['Ishara : « Dis, ton araignée de niveau 41… ça n’a pas dû être drôle. »', 'Yarden[surprise] : « Je ne t’ai jamais parlé d’une araignée. »'] },
    { end: 'Les papiers seront prêts dans trois jours. Fin du prototype !' }
  ];
}
