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
  ch2b.paperStillAt = 0;
  saveCheckpoint('quatreb');
}

zones.quatreb.goal = () => 'Parle à Félix';
zones.quatreb.label = () => 'Le 4B';

function quatrebScript() {
  return [
    { run: enterQuatreB },
    // Seuil.
    { say: ['La porte s’ouvre sans aucune difficulté.', 'Ishara : « Félix ? »', 'Tiamat (voix intérieure) : « Sois sur tes gardes. »'] },
    { say: ['Une lourde pression semble émaner de la pièce.', 'Un appartement chaud, rempli de papier en couches sur les murs, des caractères illisibles.', 'Plusieurs étagères, des bocaux, des crânes alignés.'] },
    { moves: [moveOf('yarden', [[0, -10]], 80), moveOf('ishara', [[-48, 5]], 80, { delay: .3 })] },
    // Félix.
    { say: ['Au fond, Félix assis. Encriers, plumes, lampes à bras articulés. Aucune lecture de niveau par Yarden. Une absence.', 'Ses yeux la suivent avec du retard.'] },
    { say: ['Félix : « Vous êtes récente. »', 'Félix : « Très récente. Deux jours maximum. Vous cachez quelque chose. »'] },
    { say: ['Félix : « La plupart des gens viennent ici avec un but, et repartent souvent sans rien. Vous avez l’air d’être venue avec un but précis. C’est plus poli que la moyenne. »', 'Yarden : « Ishara dit que tu fais des papiers. »', 'Félix : « Ishara dit vrai. »'] },
    { say: ['Félix pousse un tabouret. Ishara reste debout.', 'Félix : « Une identité complète ? Un nom, les registres. Une bonne histoire. Et surtout du silence. Pour les deux premiers ce sera en crédits. Le troisième, lui, se paie différemment. »', 'Félix : « Quel nom voulez-vous porter dans ce monde ? »'] },
    // Le prix du silence.
    { say: ['Yarden ne touche pas la plume.', 'Yarden : « Avant de choisir un nom, je veux savoir avec quoi. »', 'Félix : « La plupart des gens signent d’abord. Ils s’inquiètent du prix une fois le nom écrit. »', 'Yarden : « Je ne suis pas la plupart des gens. »', 'Félix : « Non. Manifestement. »'] },
    { say: ['Félix : « Le silence, ce n’est pas de l’argent. L’argent, ça s’épuise, ça se remplace, ça ne me lie à personne. Ce que vous voyez ici, c’est trente ans de noms que je n’ai jamais divulgués. »', 'Félix : « Quand je fabrique une identité, je m’attache à elle. Pas sentimentalement : structurellement. Je ne demande pas d’argent pour le silence. Je demande de ne pas avoir à le regretter. »'] },
    { say: ['Yarden : « Dis-moi pourquoi je n’arrive pas à te lire. »', 'Félix : « Je n’en émets pas. J’en ai eu un, il y a longtemps. »', 'Félix : « Aujourd’hui, je ne suis pas dans cet appartement. Je suis cet appartement. Le corps est une commodité. Pratique pour tremper une plume. »'] },
    { say: ['Félix enlève ses lunettes et les pose.', 'Félix : « Ce qui vous protège. Est-ce que ça va me suivre jusque dans mes murs ? »', 'Tiamat (voix intérieure) : « C’est la bonne question. Et je ne connais pas encore la réponse. »'] },
    // Tiamat parle par la bouche de Yarden.
    { say: ['Quelque chose monte de la marque du flanc gauche jusqu’à la gorge. Yarden reste consciente, spectatrice de sa propre voix.', 'Tiamat : « Mithra. »'] },
    { say: ['Félix : « Vous prononcez un nom que je n’ai pas donné depuis longtemps. »', 'Tiamat : « Je ne le donne pas non plus. Je le reconnais. »', 'Tiamat : « Ce n’est pas une bénédiction que tu portes. C’est un résidu. Un très vieux résidu, oublié de son maître, qui continue à faire son travail dans les murs d’un appartement parce que c’est la seule chose qu’il sache faire. »'] },
    { say: ['Tiamat : « Ton résidu scelle. Moi, je masque. Deux vieux métiers différents, dans deux maisons différentes. Nous pouvons travailler côte à côte sans nous toucher. »', 'Ishara regarde.'] },
    { run: () => { ch2b.paperStillAt = mirrorNow(); } },
    { wait: 1.6 },
    { say: ['Le bruissement du papier dans les murs s’arrête, comme un cœur qui saute un battement.'] },
    // La corde d'Ishara.
    { say: ['Félix : « Je ne touche jamais un lien qu’on ne m’offre pas. Ce serait comme lire le courrier d’un autre. »', 'Félix : « Quant à vous Ishara, vous pouvez rester une inconnue. Sauf si vous souhaitez savoir. »', 'Ishara : « …Vas-y. Je veux savoir. »'] },
    { say: ['Félix : « Vous êtes une Éveillée ordinaire. Ça, c’est la surface. Niveau onze, défense de zone. Mais en dessous, il y a une corde. »', 'Félix : « C’est une corde de témoin. Le genre de lien qu’on tend quand on veut voir à travers quelqu’un. Pas le commander. Le regarder. »', 'Félix : « Votre instinct, ce petit talent que vous avez pour savoir en qui avoir confiance avant même qu’on parle. Ce n’est pas vous. Enfin, c’est vous, mais ce n’est pas que vous. »'] },
    { say: ['Yarden : « Tu sais qui c’est ? »', 'Félix : « Non. Le nom est effacé du lien, délibérément. »', 'Félix : « Ce qui vous a bénie travaille dans la même maison que ce que je porte. Les serments. Les liens. Votre dieu et mon résidu, on tremperait nos plumes dans le même encrier. »'] },
    { say: ['Félix : « En ce moment, elle pointe vers votre amie. Depuis un moment déjà, je crois. Ce qui vous regarde à travers vous… regarde elle. »', 'Ishara : « Attends. C’est pour ça que je t’ai suivie. J’ai cru que c’était moi. Mon bon instinct pour les gens. Et en fait, c’est quelqu’un qui a décidé pour moi. »', 'Ishara lève la main : « Non, c’est bon. Je voulais savoir. Je sais. C’est juste… beaucoup. »'] },
    // Le nom et le prix.
    { say: ['Félix : « Vous auriez été bon faussaire. Dans une autre vie. »', 'Yarden : « J’en ai eu plusieurs. »', 'Félix : « Je m’en doute. »'] },
    { say: ['Yarden choisit le prénom : Yarden. Félix choisit le nom de famille : quelque chose de si ordinaire que l’œil glisse dessus, un nom qu’on oublie en le lisant.', 'Félix tourne la feuille : « Yarden Weiss. Suisse par un grand-parent, née ailleurs, arrivée jeune. L’histoire tiendra si on tire dessus. Je m’en porte garant. »'] },
    { say: ['Yarden : « Combien ? »', 'Félix : « Pour les papiers, huit cents crédits. Vous en avez deux cent quatre-vingts. Vous me devrez le reste. Ça tombe bien. »', 'Félix : « Une identité, c’est un lien. Un nom qu’on n’a pas fini de payer, c’est un nom qu’on ne trahit pas. »'] },
    { run: () => { credits = 0; debt = quatrebPrice.debt; identityName = 'Yarden Weiss'; } },
    { say: ['Yarden pose les 280 en travers de la feuille. Félix les prend sans les compter.', 'Il reste une dette de 520.', 'Félix : « Revenez dans trois jours. Le nom existera. Dans les registres, dans les serveurs, dans la mémoire de la ville. Vous pourrez louer, vendre, être arrêtée et relâchée comme n’importe qui. Bienvenue à Helvara, Yarden. »'] },
    { say: ['Première fois que quelqu’un dit le nom à voix haute.', 'Tiamat (voix intérieure) : « Ça te va. »', 'Yarden : « Oui. »'] },
    // La descente.
    { run: () => { enterEscalier(); isharaOutfit = 'course'; Object.assign(player, { x: 0, y: -540 }); sceneActors.ishara.x = -30; sceneActors.ishara.y = -510; } },
    { moves: [moveOf('yarden', [[0, -200]], 95), moveOf('ishara', [[-30, -180]], 95, { delay: .3 })] },
    { say: ['L’escalier s’allège à mesure qu’ils descendent. Au deuxième, les fleurs.'] },
    { moves: [moveOf('yarden', [[0, 130]], 95), moveOf('ishara', [[-30, 150]], 95, { delay: .3 })] },
    { say: ['Au premier, l’odeur banale d’un couloir d’immeuble : cire, poussière, courrier.'] },
    { run: enterCour },
    { say: ['Dans la cour : des pavés sans une herbe, du lierre au millimètre, deux arbustes symétriques.', 'Yarden comprend. Ce n’est pas de la maniaquerie, c’est de la méthode : un être qui tient par l’ordre extérieur, quand le reste a déménagé dans les murs.'] },
    { run: () => { enterZone('sousgare', 'start'); clearActors(); Object.assign(player, { x: -20, y: 120 }); sceneActor('ishara', 'ishara', 20, 120, { face: -1 }); } },
    { say: ['La porte cochère se referme. Le quartier Sous-gare les reprend : trottoir normal, voitures normales, la station M2 en contrebas.', 'Ishara marche une dizaine de mètres sans rien dire. C’est nouveau.'] },
    { say: ['Ishara : « Je vais avoir besoin de temps pour digérer ça. »', 'Yarden : « Oui. »', 'Ishara : « Toute ma vie j’ai cru que j’étais juste… bonne avec les gens. Et un mec-appartement me dit que c’est quelqu’un d’autre qui regarde par mes yeux. »'] },
    { say: ['Yarden : « Ce n’est pas ce qu’il a dit. Il a dit qu’une corde te tourne vers les gens. Pas qu’elle décide à ta place. »', 'Yarden : « Elle t’oriente. Tu marches quand même. Ce n’est pas la même chose d’être poussée vers une porte et de choisir de l’ouvrir. »'] },
    { say: ['Ishara[sourire] : « Bon. Yarden. Faut que je m’habitue. Mais celui-là, je peux le dire à voix haute sans te griller, donc va pour Yarden. »', 'Ishara : « Tu rentres ? La chambre en trop est toujours là. »', 'Yarden : « Oui. Je rentre. »'] },
    { say: ['Ishara : « Cool. Bon, par contre, ce soir c’est toi qui cuisines, parce que mes œufs t’ont clairement pas impressionnée et j’ai ma fierté. »', 'Yarden : « Je ne sais pas cuisiner. »', 'Ishara : « Tu sais neutraliser une araignée de niveau 41 avec sept pour cent de mana. Tu géreras des pâtes. »'] },
    { say: ['Tiamat (voix intérieure) : « Tu ne lui en as pas parlé. »'] },
    { moves: [moveOf('ishara', [[60, 150]], 110)] },
    { say: ['Ishara descend vers le quai en parlant de pâtes. Yarden range le fil avec les autres, et prend le métro.', 'Niveau 24. Yarden Weiss.'] },
    { run: () => { unlockFree(); } },
    ...chapter4Script()
  ];
}
