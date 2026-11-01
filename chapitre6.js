'use strict';

// Chapitre 6, « Ce qu'on écrit à ta place » (jour 4, de midi au soir) : l'enveloppe du chef, le préau, la recherche d'Izzy, le remboursement,
// Ouchy et le seizième étage, la boîte posée. Canon : PROJECT.md, sections 34 et 39.
// Entorses assumées : Yarden et « elle », crédits au lieu de francs, jamais de nom de jour, jamais de durée chiffrée dans les paroles du chef.
// « mademoiselle Weiss » (Thot, qui lit le registre) et « monsieur Weiss » (le 4B, qui lit le dessous) ne sont pas une incohérence.
const ch6 = { boxPlaced: false, ringMen: false, doorAjar: false, goalText: '', found: false, visited: 0, seen: new Set() };
zones.preau.goal = () => 'Compte l’enveloppe';
zones.flon.goal = () => ch6.goalText || 'Cherche Izzy';
zones.flon.label = () => 'Le Flon';
zones.preau.label = () => 'Le préau';
zones.hall.label = () => 'Ouchy';
zones.hall.goal = () => 'Suis Izzy';
zones.penthouse.label = () => 'Seizième étage';
zones.penthouse.goal = () => ch6.goalText || 'Suis Izzy';

// Recherche d'Izzy : trois faux « trous », puis l'anneau. Les points se découvrent avec « Examiner ».
const searchSpots = [
  { id: 'chien', x: -150, y: 100, r: 62, label: 'Un trou ?', lines() { ch6.seen.add('chien'); ch6.visited = ch6.seen.size; return ['Un chien énorme, immobile, assis au milieu du passage, tenu par une laisse molle et un propriétaire au téléphone. Les gens se déportent à deux mètres, comme un banc de poissons.', 'Tiamat (voix intérieure) : « Non. »', 'Yarden : « Je vois. »']; } },
  { id: 'homme', x: -20, y: 70, r: 62, label: 'Un trou ?', lines() { ch6.seen.add('homme'); ch6.visited = ch6.seen.size; return ['Un homme d’une cinquantaine d’années hurle dans un téléphone en marchant en cercle. Autour de lui, une zone d’évitement parfaitement ronde.', 'Tiamat : « Non. »', 'Yarden : « J’avais compris tout seul. »', 'Tiamat : « Je sais. Je voulais le dire. »']; } },
  { id: 'flaque', x: 110, y: 120, r: 62, label: 'Un trou ?', lines() { ch6.seen.add('flaque'); ch6.visited = ch6.seen.size; return ['Le troisième trou est une flaque.', 'Pendant mille ans, il a été la chose devant laquelle les couloirs se vidaient. Il passe son après-midi à confondre ce qu’il cherche avec un labrador.', 'Yarden : « Tu peux le dire. »', 'Tiamat : « Je n’ai rien dit. »', 'Yarden : « Tu n’as rien dit très fort. »']; } },
  { id: 'anneau', x: 150, y: 10, r: 80, label: 'La terrasse', available: () => ch6.visited >= 3, lines() { ch6.found = true; return ['Il le voit d’une passerelle : une table vide au milieu de tables pleines, deux mètres de dégagement tout autour, dans un endroit où les gens s’entassent à quatre par table de deux.', 'Autour du vide, six, peut-être sept hommes entre vingt et trente ans, en trois grappes, dans des positions pas naturelles pour des gens censés boire un verre. Ils tournent tous, à distance constante, et aucun n’entre.', 'Un prédateur fait un trou net. Ça, c’est un anneau : un vide au centre et une couronne autour. La chose n’éloigne pas. Elle appelle, et quelque chose retient ceux qu’elle appelle.', 'Tiamat (voix intérieure) : « Là. »', 'Yarden : « Là. »', 'Tiamat : « Tu as mis l’après-midi. »', 'Yarden : « J’ai passé mille ans à être la chose qui vide une pièce. Ça ne m’est pas venu qu’on puisse faire un trou en attirant. »', 'Tiamat : « Non. Ça ne te serait pas venu. »']; } }
];
function chefReturns() {
  return [
    { say: ['La tête inclinée redescend. Rien ne suit : pas un pas, pas un mot, pas un geste vers une poche.', 'Yarden ne le rend pas. On ne rend pas un salut qui n’en est pas un.'] },
    { say: ['Deux options impliquaient de courir. Elle les jette : on ne court pas devant des gens qui ne courent jamais, c’est leur donner une information gratuite.', 'Le chef se décolle du mur. C’est le seul mouvement de toute la rue. Les deux autres ne suivent pas : leur travail n’est pas de la tenir. Leur travail est d’être trois.'] },
    { say: ['Vingt-deux, contre le mur de gauche. Vingt-quatre, près de la vitrine. Le chef : rien.', 'Pas un nombre bas, pas un nombre flou. Rien du tout. Ce n’est pas la première fois.'] },
    { moves: [moveOf('costume0', [[-58, -38]], 55)] },
    { say: ['Il s’arrête à deux mètres, la distance de quelqu’un qui n’a rien à vendre.', 'Le costume ne lui va pas : un corps qui a passé vingt ans dans autre chose, à qui on a demandé ce matin de ressembler à un homme qui va dans un bureau. Les chaussures sont neuves.'] },
    { say: ['Il sort une enveloppe blanche, sans logo, sans fenêtre, sans tampon. Un mot écrit dessus à la main, à l’encre noire : Yarden.', 'Elle quittait le quatrième étage quelques minutes plus tôt. Entre-temps, quelqu’un a écrit son nom d’une main qui ne tremblait pas.', 'Tiamat ne dit rien d’autre. Elle veut juste qu’elle sache qu’elle a vu.'] },
    { say: ['Chef : « Vous étiez difficile à joindre. »', 'Chef : « On aurait pu déposer ça chez vous. Vous n’avez pas de chez vous. On aurait pu le déposer là où vous dormez. On a jugé que non. »'] },
    { say: ['Il tend l’enveloppe et ne la baisse pas. Trois secondes de rue tranquille, avec un bras tendu au milieu.', 'Yarden tend la main droite, la main nue. Les plumes en blackwork remontent du dos de la main jusque sous la manche, en plein soleil, sans rien pour les couvrir.', 'Le chef ne les regarde pas. C’est pire que s’il les avait regardées.'] },
    { say: ['Chef : « Intervention propre. Une créature classée à vingt-huit, sortie en terrain ouvert, neutralisée avant l’arrivée du dispositif. Zéro victime civile. Deux lampadaires. Zéro dommage structurel. Un témoin déplacé par une tierce personne avec une histoire de fuite de gaz, ce qui, entre nous, est exactement ce qu’on aurait dit. »', 'Chef : « Les services rendus se paient. C’est tout ce que c’est. »', 'Yarden : « Je n’ai rien facturé. »', 'Chef : « Non. Vous n’avez rien facturé. »'] },
    { run: () => { bag.push({ name: 'Enveloppe', display: '520 · à rendre' }); lootToast('+ Enveloppe'); } },
    { say: ['Chef : « La dette est honorée. De notre côté, le dossier est fermé. »', 'Chef : « Bonne continuation, mademoiselle Weiss. »'] },
    { moves: [0, 1, 2].map(i => moveOf('costume' + i, [[-320, -30]], 50, { delay: i * .6 })) },
    { run: () => { for (let i = 0; i < 3; i++) delete sceneActors['costume' + i]; } },
    { say: ['Ils ne se retournent pas. Ils ne sortent pas de carnet.', 'La rue reprend son bruit : un scooter, une porte de garage, quelqu’un qui appelle quelqu’un d’autre à un étage.'] },
    { say: ['Elle ne l’a donné que trois fois, ce nom : à une fille en haut d’un escalier de métro, à une autre pieds nus sur un canapé, à une inconnue dans une rue, contre de l’argent. Elle ne l’avait jamais vu écrit par quelqu’un qui ne le lui avait pas demandé.', 'Tiamat (voix intérieure) : « Il l’a appris à la seconde où l’homme du quatrième t’a mis la boîte dans les mains : c’est là que ton nom est entré dans les registres. Le reste, c’est juste le temps d’écrire, de trouver une enveloppe et de descendre de sa voiture. »', 'Tiamat : « Tu as payé huit cents crédits pour être une ligne. Tu es une ligne. »'] }
  ];
}

function preauScene() {
  return [
    { run: () => { enterZone('preau', 'start'); clearActors(); Object.assign(player, { x: 0, y: 0 }); } },
    { say: ['Elle ne l’ouvre pas dans la rue. Un préau d’école désaffecté, un banc de pierre à l’ombre, un angle mort entre deux bâtiments, une seule ligne d’approche.', 'Elle s’assied. Elle pose la boîte à côté d’elle. Elle ouvre l’enveloppe.'] },
    { say: ['Des billets usagés, pas séquentiels, des coupures moyennes mélangées, du genre qu’on rassemble sur plusieurs jours.', 'Elle compte, lentement, une fois. Puis elle recompte : le deuxième comptage ne sert à rien, elle a su le total à mi-chemin du premier.', 'Cinq cent vingt.'] },
    { say: ['Pas cinq cents. Pas huit cents, le prix de l’identité. Pas mille, un chiffre d’homme qui arrondit.', 'Yarden : « C’est le montant de ce que je dois à Izzy. À l’unité près. »'] },
    { say: ['Ils pourraient lui rendre ce qu’elle vient de dépenser : ce serait simple, presque poli. Mais ce qu’elle a dépensé pour ce nom, c’est huit cents. Ils rendent le deuxième versement tout seul, découpé du premier, comme un objet à part.', 'Tiamat (voix intérieure) : « Il l’est. »', 'Ils n’étaient pas dans la rue, ce matin. Alors ils ne l’ont pas entendu. Elle remonte la matinée à l’envers : la carte dans une fente, quatre chiffres tapés, une machine qui rend de l’argent et un papier qu’on ne regarde pas.'] },
    { say: ['Yarden : « Le bancomat. »', 'Tiamat : « Le bancomat. »', 'Une machine écrit toujours. Elle note la borne, le compte, le montant, avant même que les billets sortent. Il ne lit pas les gens : il lit une carcasse, une ardoise, un registre, un retrait. Il n’a pas besoin de savoir ce qu’elle est. Il lui suffit de savoir ce qu’elle laisse.'] },
    { say: ['Tiamat : « Maintenant range-le, parce que la deuxième partie est pire. Ce retrait n’est pas le tien. »', 'Un retrait a un compte. Un compte a un titulaire. Une fille qui porte une fleur d’or à découvert est affiliée à quelque chose, et une affiliation, ça s’écrit quelque part.', 'Ils n’ont pas eu besoin de la voir une seule fois.'] },
    { say: ['Zéro crédit à elle. Cinq cent vingt qui n’appartiennent à personne. Une boîte de huit cents grammes. Un nom dans les registres, dans un carnet, sur une enveloppe. Un appartement avec deux filles dedans, dont ils ont pris la peine de dire qu’ils connaissaient l’adresse.', 'Et une fille de niveau soixante-dix qui vient, sans le savoir, d’entrer dans une archive.'] },
    { say: ['Yarden : « Il ne m’a pas payée. Il m’a montré ce qu’il pouvait lire. »', 'Tiamat : « Et il t’a montré qu’il le rend. C’est la partie qu’on oublie de craindre. Celui-là n’attaque pas. Il n’exige pas. Il note, il archive, et de temps en temps il fait un geste correct. Et le geste correct te coûte plus cher que la menace, parce qu’après un geste correct tu ne peux plus dire qu’on t’a rien fait. »', 'Tiamat : « Ils sont deux à savoir écrire ton nom aujourd’hui. Un le fabrique. L’autre le classe. »'] },
    { say: ['Elle se lève. Elle n’a pas mangé depuis la veille, et son épaule tire chaque fois qu’elle change la boîte de bras.', 'Elle a cinq cent vingt crédits sur elle. Elle n’en touchera pas un.'] }
  ];
}

function searchScene() {
  return [
    { say: ['Elle ne sait pas où Izzy habite. Ni son nom de famille, ni sa guilde, ni son numéro. Elle sait qu’elle s’appelle Izzy, qu’elle est de niveau soixante-dix, qu’elle porte du rouge cerise sur les cheveux et sur la bouche. Il faut la trouver avant qu’elle trouve.', 'Elle remonte à Saint-François. Elle n’y est pas. Évidemment.', 'Yarden : « Je vérifie les endroits où elle a une raison d’être. J’en vois quatre. »', 'Tiamat (voix intérieure) : « Trois. »'] },
    { run: () => { enterZone('flon', 'start'); clearActors(); ch6.seen = new Set(); ch6.visited = 0; ch6.found = false; ch6.ringMen = false; extraSpots = { zone: 'flon', list: searchSpots }; ch6.goalText = 'Cherche un trou (Examiner)'; } },
    { say: ['La méthode, elle l’a depuis mille ans : on ne cherche pas un prédateur, on cherche le comportement des proies. On ne voit jamais la chose, on voit le trou qu’elle fait dans le reste.', 'Donc : chercher le trou.'] },
    { until: () => ch6.visited >= 3 },
    { run: () => { ch6.goalText = 'Regarde la terrasse (Examiner)'; } },
    { say: ['Le trou n’est pas l’information : la ville est pleine de trous, un chien, un cinglé, une flaque. Ce que ni un chien ni une flaque ne font, c’est un anneau.'] },
    { until: () => ch6.found },
    { run: () => { ch6.goalText = ''; ch6.ringMen = true; extraSpots = null; sceneActor('izzy', 'izzy', 170, -70, { face: -1 }); [[110, -112, 'grand'], [236, -118, 'compact'], [250, -58, 'grand'], [96, -50, 'compact'], [180, -150, 'grand'], [128, -10, 'compact']].forEach(([x, y, kind], i) => sceneActor('ring' + i, kind, x, y, { face: i % 2 ? -1 : 1 })); } },
    { say: ['Elle est seule à sa table. Robe bordeaux, veste de cuir noir sur le dossier, un verre auquel elle n’a pas touché depuis si longtemps que la glace a fondu. Le tatouage floral doré sur la clavicule, à découvert, en plein soleil, comme un panneau de rue.', 'Un des types se décolle du bar et fait trois pas vers elle. Izzy tourne la tête de dix degrés, un micro-sourire déjà en place : poli, chaleureux, absolument fermé. Le type ralentit, oblique vers une plante en pot et repart.', 'Tiamat (voix intérieure) : « Elle sait ce qu’ils veulent tous. Elle te l’a dit elle-même. Elle n’a pas de bouton. »'] },
    { moves: [moveOf('yarden', [[150, -48]], 70)] },
    { say: ['Elle ne contourne pas le vide. Elle entre dedans, en ligne droite, une boîte de huit cents grammes sous le bras.', 'Le menton d’Izzy bouge le premier. Puis les épaules, de deux centimètres. Le volet retombe une seconde entière plus tard. Elle la compte.'] },
    { say: ['Izzy : « Tiens. J’avais dit que je te contactais. »', 'Yarden : « T’as pas contacté. »', 'Izzy : « J’allais. »', 'Yarden : « T’as pas de numéro. »', 'Izzy : « J’allais quand même. J’ai des gens pour ça. »'] }
  ];
}

function repayScene() {
  return [
    { say: ['Yarden pose la boîte par terre, contre le pied de la chaise. Elle sort l’enveloppe, la pose sur la table entre le verre et le cendrier, et la pousse de dix centimètres.', 'Izzy ne la prend pas. Il y a un nom écrit dessus, à l’encre noire, par quelqu’un qui écrit droit.', 'Izzy : « C’est quoi. »', 'Yarden : « Cinq cent vingt. »'] },
    { say: ['Izzy : « On était d’accord sur trois jours. »', 'Yarden : « On était d’accord sur cinq cent vingt contre trois jours. Je te rends les cinq cent vingt. »', 'Izzy : « C’était pas une avance. C’était un contrat. »', 'Yarden : « Je sais. »', 'Izzy : « Alors tu comprends que ça se fait pas comme ça. »', 'Yarden : « Je comprends. Je le fais quand même. »'] },
    { say: ['Quelque chose se dérègle derrière ce visage. Ce n’est ni de la colère ni de la déception : quelqu’un qui appuie sur un interrupteur, entend le clic, et ne voit pas la lumière s’allumer.', 'Izzy : « T’as eu ça où. »', 'Yarden : « C’est pas dans le contrat. »', 'Izzy : « Y a plus de contrat, tu viens de le clore. »', 'Yarden : « Un travail. »', 'Izzy : « En moins d’une journée. T’avais rien ce matin. Zéro. Et là tu poses cinq cent vingt sur ma table. »', 'Yarden : « Oui. »', 'Izzy : « Et tu vas pas me dire d’où ils viennent. »', 'Yarden : « Non. »'] },
    { run: () => { const i = bag.findIndex(item => item.name === 'Enveloppe'); if (i >= 0) bag.splice(i, 1); updateBagHud(); } },
    { say: ['Elle prend l’enveloppe. Rapide, pas élégant : du plat de la main, un pouce pour l’ouvrir, un œil dedans sans compter, dans la poche de la veste. Elle ne demande pas s’il en reste.', 'Sa main reste sur la veste une demi-seconde de trop. Des ongles longs, bordeaux, laqués, refaits par quelqu’un dont c’est le métier, sauf deux : l’index et le majeur, coupés ras, sans couleur. Yarden ne demande pas pourquoi.'] },
    { say: ['Izzy : « Bon. Bah t’es libre. »', 'Yarden : « Oui. »', 'Izzy : « Trois jours de moins à me suivre partout. Tu dois être contente. »', 'Yarden ne répond pas. Elle regarde la ville derrière Izzy, parce que la regarder elle aurait été une réponse.', 'Des heures qu’Izzy est assise à écouter cette ville vouloir. Et en face d’elle, du silence.'] },
    { say: ['Izzy : « Attends. T’es où ce soir. »', 'Yarden : « Chez des gens. Deux filles. Un canapé. Un parquet à côté d’un canapé. »', 'Izzy : « T’as des papiers maintenant. »', 'Yarden : « Oui. »', 'Izzy : « Donc t’as un nom, une carte d’identité, et rien derrière. Pas de bail, pas d’adresse, pas de garant, pas de fiche de salaire. »', 'Yarden : « C’est à peu près ça. »', 'Izzy : « Tu sais ce qui se passe dans cette ville quand t’as un nom et pas d’adresse ? »', 'Yarden : « Je m’en doute. »', 'Izzy : « Non, tu t’en doutes pas. Personne te loue rien. Jamais. T’es une ligne vide dans un formulaire et les gens d’ici lisent les formulaires. »'] },
    { say: ['Izzy : « J’ai un appartement. »', 'Elle le dit trop vite, un demi-ton trop haut, et elle s’entend. Rien ne bouge dans son visage, ce qui est en soi une information.', 'Izzy : « Grand. Très grand. Ridiculement grand. Y a des pièces où je vais jamais. »', 'Yarden : « C’est de la charité. »', 'Izzy : « Non. J’ai déjà essayé la charité ce matin, ça a duré deux secondes et ça m’a coûté cinq cent vingt. »'] },
    { say: ['Izzy : « C’est de l’intérêt. Personnel. J’ai payé pour trois jours et j’en ai pas eu un seul. On m’a jamais rendu un paiement de ma vie. Jamais. Les gens gardent. Tout le monde garde. »', 'Izzy : « Alors soit tu es la seule honnête de ce canton, soit tu as fait quelque chose entre ce matin et maintenant que je veux comprendre, et dans les deux cas ça m’énerve. »', 'Yarden : « C’est une raison, ça. »', 'Izzy : « C’est la meilleure que j’aie. Prends-la ou prends le parquet. »'] },
    { say: ['Yarden pense à un homme qui est un appartement, et qui lui a dit qu’un nom qu’on n’a pas fini de payer est un nom qu’on ne trahit pas. Elle vient de couper deux laisses dans la même journée, et elle ne sait pas encore avec quoi elle a coupé la deuxième.', 'Elle pense aussi, brièvement, que cinq cent vingt crédits sont dans la poche d’une veste, passés par une machine qui écrit, et qu’il y a une personne dans cette ville capable de lire ce que les machines écrivent. Elle ne dit rien de tout ça.', 'Yarden : « D’accord. »'] },
    { say: ['Tiamat avait dit, ce matin : « Elle est une adresse. Va-t’en. » Elle attend. Rien ne vient. Pas d’objection, pas d’avertissement, pas même ce mot retenu derrière les dents.', 'Un quatrième silence. Yarden n’a pas de nom pour celui-là non plus. Elle le range avec les trois autres, dans l’ordre, et elle note le chiffre.'] },
    { say: ['Izzy hoche la tête, une seule fois, comme quelqu’un qui conclut une transaction dont il ne connaît ni le prix ni la marchandise. Elle se lève, prend sa veste, ne la regarde pas.', 'Izzy, très bas, pour elle-même, sans voir que le son sort : « Mais pourquoi j’ai fait ça, moi. »', 'Yarden ramasse la boîte. Elle ne répond pas : la seule réponse possible, c’est « je ne sais pas non plus », et ça n’aiderait aucune des deux.'] },
    { run: () => { ch6.ringMen = false; } }
  ];
}

function ouchyScene() {
  return [
    { card: 'Ouchy', seconds: 2 },
    { run: () => { enterZone('hall', 'start'); clearActors(); Object.assign(player, { x: 0, y: 100 }); sceneActor('izzy', 'izzy', 30, 104, { face: -1 }); sceneActor('concierge', 'passant', 0, -90, { face: 1 }); } },
    { say: ['L’immeuble est à Ouchy, face au lac. Quinze étages de verre et de pierre claire dans un quartier qui n’en autorise pas dix : quelqu’un, quelque part, a obtenu quelque chose.', 'Elle avait dit Ouchy, ce matin. Un studio vide. Elle n’y a pas repensé une seule fois de tout l’après-midi. Pendant mille ans, elle a connu un lieu, un seul. On ne demande pas à une chose où elle habite.', 'Tiamat le lui avait pourtant mis dans la bouche : « Elle est une adresse. » Elle avait entendu le mot. Pas ce que le mot voulait dire.'] },
    { moves: [moveOf('izzy', [[20, -50]], 70), moveOf('yarden', [[-20, -44]], 70, { delay: .4 })] },
    { say: ['Un hall de la taille d’une salle de bal, du marbre, un comptoir avec un homme derrière. L’homme se lève quand Izzy entre. Il ne se lève pas pour Yarden.', 'Le concierge : « Mademoiselle. »', 'Izzy : « Salut. Elle est avec moi. »', 'L’homme regarde Yarden une seconde entière : la boîte en carton, la veste, les tatouages sur la main droite, le chignon défait.', 'Le concierge : « Bien sûr. »'] },
    { say: ['L’ascenseur est en miroir sur trois côtés. Yarden s’y voit trois fois et n’y accorde aucune importance particulière. Quinze étages, un sous-sol, et un bouton sans numéro sous le tableau, qu’elle enregistre sans commentaire.', 'Izzy passe une carte devant un lecteur. Le seizième s’allume.', 'Yarden : « Y a pas de seizième. »', 'Izzy : « Si. »', 'Yarden : « Le tableau dit quinze. »', 'Izzy : « Le tableau dit ce qu’on lui a demandé de dire. »'] }
  ];
}

function penthouseScene() {
  return [
    { run: () => { ch6.doorAjar = false; ch6.boxPlaced = false; enterZone('penthouse', 'start'); clearActors(); Object.assign(player, { x: -250, y: -90 }); sceneActor('izzy', 'izzy', -214, -86, { face: 1 }); saveCheckpoint('seizieme'); } },
    { say: ['Les portes s’ouvrent directement dans l’appartement. Pas de couloir, pas de palier, pas de porte : l’ascenseur monte dans le salon comme une trappe dans un plancher.', 'La première chose qu’elle voit, c’est le lac. Il occupe tout le mur, trente mètres de verre du sol au plafond, sans montant. Derrière, l’eau, les montagnes de l’autre côté, un ciel qui tourne à l’orange sur la crête.'] },
    { say: ['Le sol est en pierre pâle, le plafond fait quatre mètres. À gauche, une cuisine que personne n’a jamais salie. À droite, trois canapés bas autour d’une table basse en marbre, pour douze personnes, et une bibliothèque aux livres alignés par taille.', 'Dehors, une terrasse fait tout le tour de l’étage : transats, bar extérieur, oliviers en pots de deux mètres, et sur la face sud une piscine, au-dessus du lac le plus profond du pays.', 'Tiamat (voix intérieure) : « Voilà une adresse. »'] },
    { say: ['Elle compte. Ascenseur : un. Escalier de service, derrière la cuisine, porte grise : deux. Une deuxième porte grise au fond du couloir, probablement technique : peut-être. La terrasse, le vide : pas une option.', 'Deux sorties. Peut-être trois. Pour un espace de cette taille, c’est mauvais.', 'Izzy : « Tu comptes les fenêtres ? »', 'Yarden : « Les sorties. »', 'Izzy : « Y en a combien ? »', 'Yarden : « Deux. »'] },
    { say: ['Izzy s’arrête. Elle regarde autour d’elle, vraiment, en tournant sur elle-même une fois, comme quelqu’un qui découvre un objet dans sa propre poche.', 'Izzy : « Ah. »', 'Izzy : « J’ai jamais regardé. »'] },
    { say: ['Deux cages. Dans l’une, on compte les sorties d’une maison qui n’est pas la sienne. Dans l’autre, on habite la sienne sans en avoir jamais cherché une seule.'] },
    { moves: [moveOf('izzy', [[-200, 100], [210, 120]], 110), moveOf('yarden', [[-230, 90], [190, 125]], 105, { delay: .3 })] },
    { say: ['Elle lui fait faire le tour vite, avec l’ennui de quelqu’un qui montre un logement qu’elle n’a pas choisi. Une salle à manger de douze couverts jamais utilisée. Une salle de sport dont deux machines ont encore leur film plastique. Un bureau, un fauteuil en cuir, un sous-main vierge. Trois chambres d’amis, lits faits, coussins alignés.', 'Au bout du couloir, la chambre principale, magnifique, et sans une trace de personne : le lit est tendu comme dans une brochure, pas de pli, pas de verre d’eau, pas de chargeur, pas de livre posé à l’envers. Yarden la regarde deux secondes de trop, et ne dit rien.'] },
    { moves: [moveOf('izzy', [[-240, 130]], 110), moveOf('yarden', [[-205, 134]], 105, { delay: .2 })] },
    { run: () => { ch6.doorAjar = true; } },
    { say: ['Ils reviennent vers le salon quand Yarden voit que la troisième porte du couloir n’est pas tout à fait fermée. Un travers de main, pas plus.', 'Izzy tend le bras pour la tirer : « Ça, c’est rien. » Mais le geste arrive une demi-seconde après le regard, et une demi-seconde, sur elle, c’est très long.'] },
    { say: ['Une pièce petite, la plus petite de l’étage, sans vue sur le lac. Un lit simple, défait, avec le creux d’un corps encore dedans. Un verre d’eau posé à même le sol. Un livre ouvert à l’envers sur les draps. Un chargeur. Une paire de lunettes pliée sur une pile de vêtements qui ne sont pas rangés par couleur.', 'Tous les dépôts qu’un être humain laisse dans un endroit où il dort, ceux qui manquent à la chambre de la reine, sont là.'] },
    { say: ['La porte se referme. Sur la pierre pâle, devant le seuil, trente centimètres de sol légèrement plus mats que le reste. Un pied nu qui passe au même endroit tous les soirs.', 'Izzy ne dit rien. Elle a déjà remis le menton au bon angle.', 'Une chambre de princesse qu’on tient au carré pour qu’elle existe sur une photo. Une chambre de bonne où l’on dort vraiment. Quatre cents mètres carrés face au plus beau lac du pays, et elle se couche dans la seule pièce d’où l’on ne voit rien.'] },
    { say: ['Tiamat (voix intérieure) : « Tu ne dis rien. »', 'Yarden : « Non. »', 'Tiamat : « Pourquoi. »', 'Yarden : « Parce qu’elle m’a montré tout le reste. Et celle-là, elle a essayé de la fermer. »'] },
    { say: ['Izzy lui donne la deuxième chambre d’amis, avec salle de bain privée.', 'Izzy : « Serviettes dans le placard. Si t’as faim, la cuisine est là, y a rien dedans, je commande. Et je te demande rien. »', 'Izzy : « Le contrat est fermé. Tu me dois rien, je t’achète rien, je pose pas de question, on est clairs. Reste le temps que tu veux. »', 'Yarden : « C’est une phrase dangereuse. »', 'Izzy : « Ouais. J’ai remarqué en la disant. »'] },
    { moves: [moveOf('izzy', [[-120, 130], [-250, 130], [-296, 190]], 120)] },
    { say: ['Elle reste une seconde de plus qu’il n’en faut. Puis elle tape deux fois le montant de la porte avec la paume, comme on donne le départ à quelque chose, et elle repart vers le couloir nord, pieds nus, sans lumière.'] },
    { run: () => { delete sceneActors.izzy; ch6.doorAjar = false; } },
    { moves: [moveOf('yarden', [[52, 190]], 100)] },
    { say: ['Son estomac fait ce que font les estomacs qu’on oublie une journée entière. Elle le note comme la fissure d’un plafond : une donnée sans instruction attachée.', 'Tiamat (voix intérieure) : « Tu as mis six points ce matin dans ce qui te garde debout. Et tu n’as rien avalé depuis hier. »', 'Yarden : « Je sais. »'] },
    { run: () => { ch6.boxPlaced = true; } },
    { say: ['Elle pose la boîte sur la commode. Huit cents grammes : une carte d’identité, un permis, deux extraits, une attestation, trois relevés, un bail à Renens, une carte de bibliothèque expirée et un formulaire avec une rature volontaire.', 'Vingt-deux ans de vie qui n’avait jamais eu lieu.', 'Elle n’a jamais posé quelque chose, depuis qu’elle a ouvert les yeux dans ce monde. Tout ce qu’elle possédait, elle le portait sur elle : un endroit où l’on laisse un objet est un endroit où l’on compte revenir.'] },
    { say: ['Tiamat (voix intérieure) : « Tu peux la reprendre demain. »', 'Yarden : « Je sais. »', 'Tiamat : « Ce n’est pas ce que je te demande. »'] },
    { say: ['Dehors, la lumière finit de tomber derrière la crête, l’eau perd sa couleur, et quinze étages plus bas, une ville continue de faire ce que font les villes.', 'Quelque part, un homme en costume range un carnet dans une poche intérieure. Il a écrit deux lignes cet après-midi. La première porte un nom. La seconde porte un numéro de carte, une borne, un montant.', 'Elle ne dit pas qu’une fille de niveau soixante-dix a repris cet argent sur la terrasse d’un bar, sans compter, avant de rentrer chez elle avec l’anomalie. Elle n’a pas besoin de le dire.'] },
    { end: 'Fin du chapitre 6. Niveau 27, VIT 11, 0 crédit, aucune dette, logée au seizième étage. Fin du prototype !' }
  ];
}

function chapter6Script() {
  return [...chefReturns(), ...preauScene(), ...searchScene(), ...repayScene(), ...ouchyScene(), ...penthouseScene()];
}
