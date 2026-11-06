'use strict';

// Chapitre 3, « Ce qui obéit aux murs » : la scène du 4B, les papiers et le nom Yarden Weiss. Canon : PROJECT.md, section 30.
// Texte repris des extraits du roman fournis par Jordan (PROJECT.md, section 30). Règles : Félix vouvoie tout le monde, Yarden le tutoie,
// Ishara ne dit jamais « Jordan » dans le 4B. Seules les phrases de liaison de la descente sont des propositions à relire.
// Entorses assumées : crédits au lieu de francs, Yarden et « elle » à la place de Jordan et « il ».
const quatrebPrice = { total: 800, deposit: 280, debt: 520 };

function enterQuatreB() {
  enterZone('quatreb', 'start');
  clearActors();
  sceneActor('ishara', 'ishara', -40, 160, { face: 1 });
  sceneActor('felix', 'felix', 0, -115);
  ch2b.paperStillAt = 0; ch2b.descending = false; extraSpots = null;
  saveCheckpoint('quatreb');
}

zones.quatreb.goal = () => ch2b.descending ? 'Les livres de Félix, puis sors ↓' : 'Parle à Félix';

// Livres du 4B, à lire après la scène. Registre : texte de Jordan. Feuille annotée : répliques de Félix à Ishara, passées à la troisième personne.
const felixBooks = [
  { id: 'registre', x: -125, y: -60, r: 58, label: 'Registre relié', lines: () => ['Registre relié. « Le silence n’est pas de l’argent. L’argent s’use. Un nom, non. Quand "Mithra" en fabrique un, il le porte. Structurellement. Trente ans de noms qu’il n’a jamais lâchés. »'] },
  { id: 'carnet', x: 125, y: -60, r: 58, label: 'Carnet de plume', lines: () => ['Carnet de plume. « Le corps est une commodité. Pratique pour tremper une plume. »'] },
  { id: 'feuille', x: -125, y: 40, r: 58, label: 'Feuille annotée', lines: () => ['Feuille annotée. « Ishara, quant à elle : son instinct, ce petit talent qu’elle a pour savoir en qui avoir confiance avant même qu’on parle. Ce n’est pas elle. Enfin, c’est elle, mais ce n’est pas qu’elle. »', '« Ce qui l’a bénie travaille dans la même maison que ce que je porte. Les serments. Les liens. Son dieu et mon résidu, on tremperait nos plumes dans le même encrier. »'] },
  { id: 'feuillet', x: 0, y: -70, r: 50, label: 'Feuillet volant', lines: () => ['Feuillet volant. « Une identité, c’est un lien. Un nom qu’on n’a pas fini de payer, c’est un nom qu’on ne trahit pas. »'] }
];
zones.quatreb.label = () => 'Le 4B';

function quatrebScript() {
  return [
    { run: enterQuatreB },
    // Seuil.
    { say: ['Ishara : « Félix ? »', 'Tiamat[froide] (voix intérieure) : « Sois sur tes gardes. »'] },
    { say: ['Une lourde pression semble émaner de la pièce.'] },
    { moves: [moveOf('yarden', [[0, -10]], 80), moveOf('ishara', [[-48, 5]], 80, { delay: .3 })] },
    // Félix (version allégée validée par Jordan le 6 novembre 2026 : plus de narration, tirades longues dans les livres du 4B).
    { say: ['Félix : « Vous êtes récente. »', 'Félix : « Très récente. Deux jours maximum. Vous cachez quelque chose. »'] },
    { say: ['Yarden : « Ishara dit que tu fais des papiers d’identité. »', 'Félix : « Ishara dit vrai. »'] },
    { say: ['Félix : « Une identité complète ? Un nom, les registres. Une bonne histoire. Et surtout du silence. Pour les deux premiers ce sera en crédits. Le troisième, lui, se paie différemment. »', 'Félix : « Quel nom voulez-vous porter dans ce monde ? »'] },
    // Le prix du silence.
    { say: ['Yarden : « Avant de choisir un nom, je veux savoir avec quoi. »', 'Félix : « Je ne demande pas d’argent pour le silence. Je demande de ne pas avoir à le regretter. »'] },
    { say: ['Yarden : « Dis-moi pourquoi je n’arrive pas à te lire. »', 'Félix : « Je n’en émets pas. J’en ai eu un, il y a longtemps. »', 'Félix : « Aujourd’hui, je ne suis pas dans cet appartement. Je suis cet appartement. »'] },
    { say: ['Félix : « Ce qui vous protège. Est-ce que ça va me suivre jusque dans mes murs ? »', 'Tiamat (voix intérieure) : « C’est la bonne question. Et je ne connais pas encore la réponse. »'] },
    // Tiamat parle par la bouche de Yarden.
    { say: ['Tiamat[froide] (par Yarden) : « Mithra. »'] },
    { say: ['Félix : « Vous prononcez un nom que je n’ai pas donné depuis longtemps. »', 'Tiamat (par Yarden) : « Je ne le donne pas non plus. Je le reconnais. »', 'Tiamat[froide] (par Yarden) : « Ce n’est pas une bénédiction que tu portes. C’est un résidu. Un très vieux résidu, oublié de son maître, qui continue à faire son travail dans les murs d’un appartement parce que c’est la seule chose qu’il sache faire. »'] },
    { say: ['Tiamat (par Yarden) : « Ton résidu scelle. Moi, je masque. Deux vieux métiers différents, dans deux maisons différentes. Nous pouvons travailler côte à côte sans nous toucher. »'] },
    { run: () => { ch2b.paperStillAt = mirrorNow(); } },
    { wait: 1.6 },
    // La corde d'Ishara.
    { say: ['Félix : « Je ne touche jamais un lien qu’on ne m’offre pas. Ce serait comme lire le courrier d’un autre. »', 'Félix : « Quant à vous Ishara, vous pouvez rester une inconnue. Sauf si vous souhaitez savoir. »', 'Ishara : « …Vas-y. Je veux savoir. »'] },
    { say: ['Félix : « Vous êtes une Éveillée ordinaire. Ça, c’est la surface. Niveau onze, défense de zone. Mais en dessous, il y a une corde. »', 'Félix : « C’est une corde de témoin. Le genre de lien qu’on tend quand on veut voir à travers quelqu’un. Pas le commander. Le regarder. »'] },
    { say: ['Yarden : « Tu sais qui c’est ? »', 'Félix : « Non. Le nom est effacé du lien, délibérément. »'] },
    { say: ['Félix : « En ce moment, elle pointe vers votre amie. Depuis un moment déjà, je crois. Ce qui vous regarde à travers vous… regarde elle. »', 'Ishara : « Attends. C’est pour ça que je t’ai suivie. J’ai cru que c’était moi. Mon bon instinct pour les gens. Et en fait, c’est quelqu’un qui a décidé pour moi. »', 'Ishara : « Non, c’est bon. Je voulais savoir. Je sais. C’est juste… beaucoup. »'] },
    // Le nom et le prix.
    { say: ['Félix : « Vous auriez été bon faussaire. Dans une autre vie. »', 'Yarden : « J’en ai eu plusieurs. »', 'Félix : « Je m’en doute. »'] },
    { say: ['Félix : « Yarden Weiss. Suisse par un grand-parent, née ailleurs, arrivée jeune. L’histoire tiendra si on tire dessus. Je m’en porte garant. »'] },
    { say: ['Yarden : « Combien ? »', 'Félix : « Pour les papiers, huit cents crédits. Vous en avez deux cent quatre-vingts. Vous me devrez le reste. Ça tombe bien. »'] },
    { run: () => { credits = 0; debt = quatrebPrice.debt; identityName = 'Yarden Weiss'; popText(player, '−280 crédits · dette 520', 'loot'); } },
    { wait: 1.4 },
    { say: ['Félix : « Revenez dans trois jours. Le nom existera. Dans les registres, dans les serveurs, dans la mémoire de la ville. Vous pourrez louer, vendre, être arrêtée et relâchée comme n’importe qui. Bienvenue à Helvara, Yarden. »'] },
    { say: ['Tiamat[amusee] (voix intérieure) : « Ça te va. »', 'Yarden : « Oui. »'] },
    // Exploration libre du 4B (les livres), puis la descente à pied, sans narration.
    { run: () => { ch2b.descending = true; extraSpots = { zone: 'quatreb', list: felixBooks }; updateStatus(); } },
    { until: () => player.y > 150 },
    { run: () => { extraSpots = null; enterEscalier(); isharaOutfit = 'course'; Object.assign(player, { x: 0, y: -540 }); sceneActors.ishara.x = -30; sceneActors.ishara.y = 200; updateStatus(); } },
    { until: () => player.y > 190 },
    { run: () => { enterCour(); Object.assign(player, { x: 0, y: -160 }); sceneActors.ishara.x = -30; sceneActors.ishara.y = 150; updateStatus(); } },
    { until: () => player.y > 120 },
    { run: () => { ch2b.descending = false; enterZone('sousgare', 'start'); clearActors(); Object.assign(player, { x: -20, y: 120 }); sceneActor('ishara', 'ishara', 20, 120, { face: -1 }); } },
    { say: ['Ishara : « Je vais avoir besoin de temps pour digérer ça. »', 'Yarden : « Oui. »', 'Ishara : « Toute ma vie j’ai cru que j’étais juste… bonne avec les gens. Et un mec-appartement me dit que c’est quelqu’un d’autre qui regarde par mes yeux. »'] },
    { say: ['Yarden : « Ce n’est pas ce qu’il a dit. Il a dit qu’une corde te tourne vers les gens. Pas qu’elle décide à ta place. »', 'Yarden : « Elle t’oriente. Tu marches quand même. Ce n’est pas la même chose d’être poussée vers une porte et de choisir de l’ouvrir. »'] },
    { say: ['Ishara[sourire] : « Yarden Weiss, alors. Faut que je m’habitue. »', 'Ishara : « Tu rentres ? La chambre en trop est toujours là. »', 'Yarden : « Oui. Je rentre. »'] },
    { say: ['Ishara : « Cool. Bon, par contre, ce soir c’est toi qui cuisines, parce que mes œufs t’ont clairement pas impressionnée et j’ai ma fierté. »', 'Yarden : « Je ne sais pas cuisiner. »', 'Ishara : « Tu sais neutraliser une araignée de niveau 41. Tu géreras des pâtes. »'] },
    { say: ['Tiamat (voix intérieure) : « Tu ne lui en as pas parlé. »'] },
    { moves: [moveOf('ishara', [[60, 150]], 110)] },
    { card: 'Niveau 24. Yarden Weiss.', seconds: 2.2 },
    { run: () => { unlockFree(); } },
    ...chapter4Script()
  ];
}
