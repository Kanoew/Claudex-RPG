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
    // 1. Seuil.
    { say: ['La porte cède sans résistance, comme si elle attendait la main.', 'Ishara : « Félix ? »', 'Tiamat (voix intérieure) : « Reste sur le seuil de ton attention. Je regarde avec toi. »'] },
    { say: ['L’air change de densité, pas de température : une pression basse contre la mâchoire.', 'Un appartement chaud, encombré, presque domestique. Du papier punaisé en couches sur tous les murs : documents jaunis, tampons, filigranes, écritures dans des alphabets inconnus.', 'Des étagères du sol au plafond. Des bocaux qui contiennent des choses qui ont été vivantes. Des crânes alignés, propres, tournés vers la pièce comme un public patient.'] },
    { moves: [moveOf('yarden', [[0, -10]], 80), moveOf('ishara', [[-48, 5]], 80, { delay: .3 })] },
    // 2. Félix.
    { say: ['Au fond, derrière la table de travail, Félix ne se lève pas : encriers, plumes, lampes à bras articulés éteintes. Yarden ne lit aucun niveau, seulement une absence.', 'Ses yeux rattrapent parfois en retard le mouvement de sa tête. Là, ils suivent à temps, par courtoisie.'] },
    { say: ['Félix : « Vous êtes récente. »', 'Félix : « Très récente. Deux jours. Peut-être moins. Et soigneusement rangée sous quelque chose. »'] },
    { say: ['Félix : « La plupart des gens qui passent cette porte sentent quelque chose et repartent en se disant qu’ils ont eu tort. Vous, vous êtes entrée en comptant les crânes. C’est plus poli que la moyenne. »', 'Yarden : « Ishara dit que tu fais des papiers. »', 'Félix : « Ishara dit vrai. »'] },
    { say: ['Félix pose un seul tabouret pour Yarden. Ishara reste debout.', 'Félix : « Une identité complète, c’est trois choses. Un nom qui existe dans les bons registres. Une histoire qui tient si on tire dessus. Et un silence, du mien, permanent. Les deux premières se paient en crédits. La troisième se paie autrement. »', 'Félix : « Quel nom voulez-vous porter dans ce monde ? »'] },
    // 3. Le prix du silence.
    { say: ['Yarden ne touche pas la plume.', 'Yarden : « Avant de choisir un nom, je veux savoir avec quoi. »', 'Félix : « La plupart des gens signent d’abord. Ils s’inquiètent du prix une fois le nom écrit. »', 'Yarden : « Je ne suis pas la plupart des gens. »', 'Félix : « Non. Manifestement. »'] },
    { say: ['Félix : « Le silence, ce n’est pas de l’argent. L’argent, ça s’épuise, ça se remplace, ça ne me lie à personne. Ce que vous voyez ici, c’est trente ans de noms que je n’ai jamais dits. »', 'Félix : « Quand je fabrique une identité, je m’attache à elle. Pas sentimentalement : structurellement. Je ne demande pas d’argent pour le silence. Je demande de ne pas avoir à le regretter. »'] },
    { say: ['Yarden : « Dis-moi pourquoi je n’arrive pas à te lire. »', 'Félix : « Je n’en émets pas. J’en ai eu un, il y a longtemps. »', 'Félix : « Aujourd’hui, je ne suis pas dans cet appartement. Je suis cet appartement. Le corps est une commodité. Pratique pour tremper une plume. »'] },
    { say: ['Félix enlève ses lunettes et les pose.', 'Félix : « Ce qui vous protège. Est-ce que ça va me suivre jusque dans mes murs ? »', 'Tiamat (voix intérieure) : « C’est la bonne question. Et je ne connais pas encore la réponse. »'] },
    // 4. Tiamat parle par la bouche de Yarden.
    { say: ['Quelque chose monte de la marque du flanc gauche jusqu’à la gorge. Yarden reste conscient, spectatrice de sa propre voix.', 'Tiamat : « Mithra. »'] },
    { say: ['Félix : « Vous prononcez un nom que je n’ai pas donné. »', 'Tiamat : « Je ne le donne pas non plus. Je le reconnais. »', 'Tiamat : « Ce n’est pas une bénédiction que tu portes. C’est un résidu. Un très vieux résidu, oublié de son maître, qui continue à faire son travail dans les murs d’un appartement lausannois parce que c’est la seule chose qu’il sache faire. »'] },
    { say: ['Tiamat : « Ton résidu scelle. Moi, je masque. Deux vieux métiers différents, dans deux maisons différentes. Nous pouvons travailler côte à côte sans nous toucher. »', 'Ishara regarde, sans exister trop fort.'] },
    { run: () => { ch2b.paperStillAt = mirrorNow(); } },
    { wait: 1.6 },
    { say: ['Le bruissement du papier dans les murs s’arrête, comme un cœur qui saute un battement.'] },
    // 5. La corde d'Ishara.
    { say: ['Félix : « Je ne touche jamais un lien qu’on ne m’offre pas. Ce serait comme lire le courrier d’un autre. »', 'Félix : « Vous n’avez rien à me prouver, Ishara. Vous pouvez rester une inconnue. C’est un droit. »', 'Ishara : « …Vas-y. Je veux savoir. »'] },
    { say: ['Félix : « Vous êtes une Éveillée ordinaire. Ça, c’est la surface. Niveau onze, défense de zone. Mais en dessous, il y a une corde. »', 'Félix : « C’est une corde de témoin. Le genre de lien qu’on tend quand on veut voir à travers quelqu’un. Pas le commander. Le regarder. »', 'Félix : « Votre instinct, ce petit talent que vous avez pour savoir en qui avoir confiance avant même qu’on parle. Ce n’est pas vous. Enfin, c’est vous, mais ce n’est pas que vous. »'] },
    { say: ['Yarden : « Tu sais qui c’est ? »', 'Félix : « Non. Le nom est effacé du lien, délibérément. »', 'Félix : « Ce qui vous a bénie travaille dans la même maison que ce que je porte. Les serments. Les liens. Votre dieu et mon résidu, on tremperait nos plumes dans le même encrier. »'] },
    { say: ['Félix : « En ce moment, elle pointe vers votre amie. Depuis un moment déjà, je crois. Ce qui vous regarde à travers vous… regarde elle. »', 'Ishara : « Attends. C’est pour ça que je t’ai suivie. J’ai cru que c’était moi. Mon bon instinct pour les gens. Et en fait, c’est quelqu’un qui a décidé pour moi. »', 'Ishara lève la main : « Non, c’est bon. Je voulais savoir. Je sais. C’est juste… beaucoup. »'] },
    // 6. Le nom et le prix.
    { say: ['Félix : « Vous auriez été bon faussaire. Dans une autre vie. »', 'Yarden : « J’en ai eu plusieurs. »', 'Félix : « Je m’en doute. »'] },
    { say: ['Yarden choisit le prénom : Yarden. Félix choisit le nom de famille : quelque chose de si ordinaire que l’œil glisse dessus, un nom qu’on oublie en le lisant.', 'Félix tourne la feuille : « Yarden Weiss. Suisse par un grand-parent, née ailleurs, arrivée jeune. L’histoire tiendra si on tire dessus. Je m’en porte garant. »'] },
    { say: ['Yarden : « Combien ? »', 'Félix : « Pour les papiers, huit cents crédits. Vous en avez deux cent quatre-vingts. Vous me devrez le reste. Ça tombe bien. »', 'Félix : « Une identité, c’est un lien. Un nom qu’on n’a pas fini de payer, c’est un nom qu’on ne trahit pas. »'] },
    { run: () => { credits = 0; debt = quatrebPrice.debt; identityName = 'Yarden Weiss'; } },
    { say: ['Yarden pose les 280 en travers de la feuille. Félix les prend sans les compter.', 'Il reste une dette de 520.', 'Félix : « Revenez dans trois jours. Le nom existera. Dans les registres, dans les serveurs, dans la mémoire de la ville. Vous pourrez louer, vendre, être arrêtée et relâchée comme n’importe qui. Bienvenue à Helvara, Yarden. »'] },
    { say: ['Première fois que quelqu’un dit le nom à voix haute.', 'Tiamat (voix intérieure) : « Ça te va. »', 'Yarden : « Oui. »'] },
    // 7. La descente.
    { run: () => { enterEscalier(); isharaOutfit = 'course'; Object.assign(player, { x: 0, y: -540 }); sceneActors.ishara.x = -30; sceneActors.ishara.y = -510; } },
    { moves: [moveOf('yarden', [[0, -200]], 95), moveOf('ishara', [[-30, -180]], 95, { delay: .3 })] },
    { say: ['L’escalier s’allège à mesure qu’ils descendent. Au deuxième, les géraniums.'] },
    { moves: [moveOf('yarden', [[0, 130]], 95), moveOf('ishara', [[-30, 150]], 95, { delay: .3 })] },
    { say: ['Au premier, l’odeur banale d’un couloir d’immeuble : cire, poussière, courrier.'] },
    { run: enterCour },
    { say: ['Dans la cour : des pavés sans une herbe, du lierre au millimètre, deux arbustes symétriques.', 'Yarden comprend. Ce n’est pas de la maniaquerie, c’est de la méthode : un être qui tient par l’ordre extérieur, quand le reste a déménagé dans les murs.'] },
    { say: ['Ishara : « Niveau 41, quand même. Pour une araignée. »', 'Tiamat (voix intérieure) : « Tu ne lui en as pas parlé. »'] },
    { moves: [moveOf('ishara', [[60, 150]], 110)] },
    { say: ['Ishara descend vers le quai en parlant de pâtes. Yarden range le fil avec les autres, et prend le métro.', 'Niveau 24. Yarden Weiss.'] },
    { end: 'Les papiers seront prêts dans trois jours. Fin du prototype !' }
  ];
}
