'use strict';

// Chapitre 4, « La trace » : les pâtes, la pression de la nuit, la rupture urbaine de niveau 28, l'équipe au carnet,
// Céleste dans son lit, l'araignée dont Ishara se souvient. Canon : PROJECT.md, section 33.
// Entorses assumées : Yarden et « elle » à la place de Jordan et « il », crédits au lieu de francs, la créature est le rampant gris en attendant son dessin.
// Les répliques absentes du canon sont des propositions courtes à relire (voir docs/TEXTES.md).
const ch4 = { tearAt: 0, broken: false, goalText: '' };
zones.square.goal = () => ch4.goalText || 'Cherche la rupture';
zones.square.label = () => 'Le square';

function setLevel27() {
  playerLevel = 27;
  yardenStats.level = 27;
  lootToast('Niveau 24 → 27');
}

function enterSquare() {
  enterZone('square', 'start');
  clearActors();
  ch4.tearAt = 0; ch4.broken = false; ch4.goalText = '';
  zoneEnemies.square[0].hp = 0;
  sceneActor('ishara', 'ishara', -60, 175, { face: 1 });
  saveCheckpoint('chasse');
}

function enterHomeCh4() {
  enterApartment('ch4');
  isharaOutfit = 'course';
  yardenOutfit = '';
}

const squareCreature = () => zoneEnemies.square[0];

function pastaScene() {
  return [
    { card: 'Chapitre 4 · La trace', seconds: 2.6 },
    { run: () => { enterHomeCh4(); Object.assign(player, { x: 200, y: -110 }); sceneActor('ishara', 'ishara', 120, -95, { face: 1 }); saveCheckpoint('pates'); } },
    { say: ['Yarden cuisine pour la première fois de sa vie. Elle bégaie un peu en le faisant.', 'Elle mange en silence. À chaque bouchée, la faim recule : c’est une chose qu’elle a faite.', 'Yarden : « Pas donnée. Faite. »'] },
    { say: ['Ishara : « Y’a une marque de pâtes, la supérieure. Je la reconnaîtrais les yeux fermés. »'] },
    { say: ['Ishara : « Ma coloc rentre. Demain matin, je crois. Peut-être ce soir tard. Faudra que je lui explique pourquoi y’a quelqu’un dans son lit. »'] },
    { say: ['Yarden ouvre sa fenêtre : Points disponibles : 0.', 'Il me faut du niveau. Vite.'] },
    { card: 'La nuit', seconds: 2 },
    { run: () => { delete sceneActors.ishara; Object.assign(player, { x: -170, y: 90 }); } },
    { dark: true },
    { say: ['Yarden dort par terre, les mains croisées sur la poitrine. Le run du matin ne rapporte plus rien sous son niveau : il lui faut une faille de niveau 28-30.', 'Tiamat (voix intérieure) : « Une faille de ce niveau ne s’ouvre pas quand tu la commandes. Tu vas devoir chasser. »', 'Tiamat : « Et le niveau que tu cherches laissera une trace. »'] },
    { say: ['Yarden : « J’ai une dette de 520 et trois jours. »', 'Tiamat se tait. C’est son premier désaccord laissé passer, sans insister.', 'Yarden lit de l’inquiétude dans ce silence, sans que Tiamat la nomme jamais.', 'Ishara suit. Son buff change les calculs.'] },
    { dark: false },
    { card: 'Aube', seconds: 2.2 }
  ];
}

function ruptureScene() {
  return [
    { run: enterSquare },
    { say: ['Un square, tôt le matin. Personne, ou presque.'] },
    { run: () => { ch4.tearAt = mirrorNow(); ch4.broken = true; playSfx('hit'); sceneActor('creature', 'sheet', 0, -110, { sheet: 'creature', face: -1 }); sceneActor('jogger', 'sheet', 250, 40, { sheet: 'jogger', face: -1 }); } },
    { wait: .9 },
    { say: ['La faille ne s’ouvre pas : elle se déchire d’un coup. Une pression qui claque les tympans, un éclair bleu-noir.', 'Les lampadaires proches explosent. Du verre partout.', 'Un jogger, à trente mètres. Une fenêtre qui s’allume au deuxième étage de l’immeuble d’en face.'] },
    { run: () => { sceneActors.jogger.pose = 'startle'; } },
    { say: ['Niveau 28. Chitine sombre, longue, basse sur pattes, des membres qui plient dans le mauvais sens, une tête sans yeux visibles.', 'Elle vise le vivant le plus proche : le jogger. Pas Yarden.'] },
    { say: ['Yarden tend la main droite et garde la lame courte, une forme refermée : une serpe noire dans le poing, pour que les civils ne voient qu’un reflet.', 'Le Voile grince.'] },
    { say: ['Yarden : « ISHARA. Le jogger. Fais-le partir. »'] },
    { run: () => { sceneActors.jogger.pose = null; } },
    { moves: [moveOf('ishara', [[160, 60]], 190), moveOf('creature', [[200, 30]], 150)] },
    { say: ['Ishara : « COURS ! GAZ ! FUITE DE GAZ ! COURS ! »'] },
    { moves: [moveOf('jogger', [[330, 40]], 170)] },
    { moves: [moveOf('creature', [[-60, 150]], 170)] },
    { run: () => { player.hp = Math.max(2, player.maxHp - 3); sceneActors.creature.pose = 'strike'; updateStatus(); } },
    { say: ['Elle se retourne vers Yarden et la blesse à l’épaule. La veste est déchirée : trois entailles parallèles.', 'Tiamat (voix intérieure) : « Elle est plus rapide que l’araignée. Et toi, tu es plus lent qu’hier. »'] },
    { run: () => {
      const c = squareCreature(), actor = sceneActors.creature;
      resetEnemy(c); c.x = actor.x; c.y = actor.y;
      delete sceneActors.creature; delete sceneActors.jogger;
      ch4.goalText = 'Neutralise la créature';
    } },
    { until: () => squareCreature().hp <= 0 },
    { run: () => { ch4.goalText = ''; setLevel27(); } },
    { say: ['Elle tombe. Une fraction de seconde, et c’est fini.', 'Niveau 24 → 27. Ishara gagne zéro niveau : le coup est à Yarden.'] }
  ];
}

function equipeScene() {
  return [
    { run: () => { const team = ['chef-technique', 'operateur-a', 'operateur-b', 'operatrice-c', 'operateur-d', 'operatrice-e']; team.forEach((sheet, i) => sceneActor('op' + i, 'sheet', -150 + i * 60, 280, { sheet, face: 1 })); } },
    { say: ['Six opérateurs, aucun écusson, aucune électronique, un carnet manuscrit. Ils arrivent quatre à cinq minutes après la rupture, sans gyrophare.'] },
    { moves: [0, 1, 2, 3, 4, 5].map(i => moveOf('op' + i, [[-150 + i * 60, 130 + (i % 2) * 24]], 140)) },
    { say: ['Le chef lit la coupe franche sur la carcasse avant de regarder Yarden.', 'Chef : « T’es affiliée à qui ? »', 'Yarden : « Personne. »', 'Chef : « Ton nom. »'] },
    { say: ['Yarden : « Vous arrivez quatre minutes trop tard. J’ai fait courir les gens que vous auriez dû protéger. Et tout ce que vous avez à me demander, c’est mon nom ? »'] },
    { say: ['Le chef referme son carnet.', 'Chef : « On remballe. On a ce qu’on est venus chercher. »', 'Personne ne demande ses papiers.'] },
    { say: ['Yarden comprend une seconde trop tard : ils n’ont jamais voulu le nom. Ils voulaient voir ce qu’une Éveillée fait quand on le lui demande.', 'Premier échange perdu sans un coup.'] },
    { moves: [0, 1, 2, 3, 4, 5].map(i => moveOf('op' + i, [[-150 + i * 60, 300]], 130, { delay: i * .12 })) },
    { run: () => { for (let i = 0; i < 6; i++) delete sceneActors['op' + i]; } },
    { say: ['Ils emportent la carcasse. Aucun crédit gagné : la dette reste à 520.', 'Ishara : « C’est bon, là ? C’est… fini ? »', 'Yarden : « Non. »'] }
  ];
}

function retourScene() {
  return [
    { card: 'Le retour', seconds: 2 },
    { run: () => { enterHomeCh4(); Object.assign(player, { x: -228, y: 215, hp: player.hp }); sceneActor('ishara', 'ishara', -190, 185, { face: -1 }); } },
    { say: ['Yarden, l’épaule ouverte et les côtes fissurées, se couche sur le lit de la chambre, les mains croisées sur la poitrine.', 'Ishara la soigne à mains nues. Ses mains tremblent : le contrecoup arrive quarante minutes plus tard.'] },
    { say: ['Tiamat (voix intérieure) : « Tu as sorti une variable de ton calcul et tu l’as emmenée dehors quand même. »', 'Yarden : « Je sais. »', 'Tiamat : « Non. Tu l’apprends. »'] },
    { run: () => { player.hp = player.maxHp; updateStatus(); } }
  ];
}

function celesteScene() {
  return [
    { card: '14 h', seconds: 2 },
    { run: () => { enterHomeCh4(); Object.assign(player, { x: -228, y: 215 }); sceneActor('ishara', 'ishara', -200, 150, { face: -1 }); sceneActor('celeste', 'celeste', 200, -105, { face: -1 }); saveCheckpoint('celeste'); } },
    { say: ['Céleste, niveau 22, la coloc d’Ishara, famille de guilde marchande, rentre d’un événement de guilde de onze heures.', 'Robe midi noire, veste cropped en cuir, bottines à talon bloc, une chaîne dorée avec un petit pendentif de guilde.'] },
    { moves: [moveOf('celeste', [[30, -40], [20, 90], [-130, 100]], 110)] },
    { say: ['Elle trouve quelqu’un endormi dans son lit et croit pendant cinq secondes à un cadavre.', 'Premier réflexe : elle se met devant Ishara.'] },
    { moves: [moveOf('celeste', [[-165, 130]], 90)] },
    { say: ['Yarden ouvre un œil et lit le pendentif de Céleste ouvertement, une seconde entière, en la laissant la voir faire.', 'Céleste comprend que c’était volontaire.'] },
    { say: ['Céleste[alerte] : « Elle est qui, elle ? »', 'Ishara explique mal : ni l’Abysse, ni le square, ni la guilde, ni la dette, ni le dragon.'] },
    { say: ['Céleste : « Dans ma chambre. »', 'Ishara : « Techniquement, c’est la chambre d’appoint quand t’es pas là. »', 'Céleste : « Le mot appoint fait pas ce que tu crois qu’il fait. »'] },
    { say: ['Céleste : « Et toi, tu t’appelles comment ? »', 'Yarden : « Yarden. »', 'C’est la deuxième fois qu’elle donne ce nom, alors qu’il n’existe encore dans aucun registre.'] },
    { moves: [moveOf('yarden', [[-100, 80], [20, 80], [0, -10], [-185, -60]], 110)] },
    { say: ['Céleste se couche. Yarden dort sur le canapé.'] }
  ];
}

function araigneeScene() {
  return [
    { card: 'Le soir', seconds: 2 },
    { run: () => { enterHomeCh4(); Object.assign(player, { x: 0, y: -60 }); sceneActor('ishara', 'ishara', 50, -60, { face: -1 }); } },
    { say: ['Yarden : « L’araignée de niveau quarante et un. Hier soir, dans la cour du 4B. Tu l’as mentionnée. Je t’en ai jamais parlé. »', 'Yarden : « L’araignée de cristal. Niveau quarante et un. Sept pour cent de mana. Tu me l’as dit en sortant. Mot pour mot. »'] },
    { say: ['Ishara ne ment pas. Elle cherche dans sa mémoire, ses yeux vont sur le côté, sa main se referme sur du vide.', 'Ishara : « Non… Tu m’en as parlé. »', 'Tiamat (voix intérieure) : « Regarde-la. Elle ne ment pas. »'] },
    { say: ['Ishara[inquiete] : « …Je croyais que tu me l’avais dit. Yarden. Je me souviens que tu me l’as dit. »'] },
    { say: ['La corde ne fait pas que regarder. Quelque chose écrit dans sa mémoire.'] },
    { run: () => { saveCheckpoint('jour4'); } },
    ...chapter5Script()
  ];
}

function chapter4Script() {
  return [...pastaScene(), ...ruptureScene(), ...equipeScene(), ...retourScene(), ...celesteScene(), ...araigneeScene()];
}
