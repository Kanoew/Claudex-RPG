'use strict';

// Chapitre 5, « Le poids d'une dette » (jour 4) : l'inventaire du matin, la douche et les six points en VIT, la ville, Izzy (niveau 70),
// le contrat de trois jours, le 4B (papiers et dette payée), les trois costumes devant la porte cochère. Canon : PROJECT.md, section 35.
// Entorses assumées : Yarden et « elle » à la place de Jordan et « il », crédits au lieu de francs. Les répliques absentes du canon sont des propositions à relire.
const martereyGoalBase = zones.marterey.goal;
zones.marterey.goal = () => ch2b.goalText || martereyGoalBase();
const sousgareGoalBase = zones.sousgare.goal;
zones.sousgare.goal = () => ch2b.goalText || sousgareGoalBase();

// Contrat avec Izzy : trois jours payés d'avance (520), échéance au jour 7.
const izzyContract = { active: false };

function enterQuatrebAlone() {
  enterZone('quatreb', 'start');
  clearActors();
  sceneActor('felix', 'felix', 0, -115);
  ch2b.paperStillAt = 0;
}

function morningScene() {
  return [
    { card: 'Chapitre 5 · Le poids d’une dette', seconds: 2.8 },
    { run: () => { enterHomeCh4(); yardenOutfit = ''; Object.assign(player, { x: -185, y: -60 }); sceneActor('celeste', 'celeste', 190, -125, { face: -1 }); sceneActor('ishara', 'ishara', 20, -95, { face: 1 }); saveCheckpoint('jour4'); } },
    { say: ['Inventaire du matin : 0 crédit, 520 de dette, un toit toléré. Le parquet, à côté du canapé.'] },
    { say: ['Céleste ne lui adresse pas un mot. Elle laisse la boîte à café au milieu du comptoir.', 'Céleste : « Je ne te sers pas, mais tu peux. »'] },
    { say: ['Ishara ne lui parle plus depuis le dîner.', 'Yarden range le fil de la corde.', 'Yarden : « Je le range. C’est pas pareil. »'] },
    { card: 'La douche', seconds: 2 },
    { say: ['Sous l’eau, Yarden pose trois lignes à Tiamat : pas de rupture, pas de terrain subi, pas de civils.', 'Tiamat enregistre sans objecter.'] },
    { say: ['Deux points par niveau, sans exception : de 24 à 27, six points à distribuer.'] },
    { run: () => openPoints(6) },
    { until: () => !pointsState.open },
    { say: ['Tout en VIT : 5 devient 11. Pour la première fois, elle n’achète pas de la puissance. Elle achète du temps.', 'Tiamat le remarque. Elle ne le dit pas.'] }
  ];
}

function cityScene() {
  return [
    { card: 'Seule en ville', seconds: 2 },
    { run: () => { enterZone('marterey', 'start'); clearActors(); ch2b.goalText = 'Cherche une faille →'; Object.assign(player, { x: -200, y: 110 }); } },
    { say: ['Elle examine la guilde du quartier, et la refuse : s’affilier ferait du « Personne. » du chapitre 4 un mensonge daté.', 'Elle ne trouve aucune faille.'] },
    { until: () => player.x > 120 },
    { run: () => { ch2b.goalText = ''; sceneActor('izzy', 'izzy', 215, 100, { face: -1 }); } },
    { say: ['Un « 70 », dans une rue commerçante. Tiamat arrive une demi-seconde trop tard : c’est la première fois.', 'Niveau 70. Déité Xochiquetzal. Une fleur d’or portée à découvert, des talons dorés, un rouge laqué. Izzy lit le désir des gens, en permanence. Sur Yarden, elle ne lit rien.'] },
    { moves: [moveOf('izzy', [[160, 105]], 70), moveOf('yarden', [[110, 110]], 70)] },
    { say: ['Izzy[narquoise] : « J’ai un studio à Ouchy. Il est vide. Il est à toi. »', 'Yarden se ferme.'] },
    { say: ['Izzy : « Je t’achète trois jours. »'] },
    { say: ['Izzy : « Trois jours, payés d’avance. Cinq cent vingt. Tu marches où je marche, t’es là quand je suis là. Tu réponds à aucune question. »', 'Elle n’achète pas des réponses. Elle achète le droit de regarder.'] },
    { say: ['Izzy retire 520 au distributeur : un montant hors menu, tapé à la main, sans une hésitation. Aucun arrondi, aucun reliquat. Elle compte les billets en les lui tendant, et elle ne regarde pas le solde.', 'L’échéance tombe au jour 7.'] },
    { run: () => { credits = 520; izzyContract.active = true; lootToast('+ 520 crédits'); } },
    { say: ['Izzy : « Ton nom. »', 'Yarden : « Yarden. »', 'Troisième fois qu’elle le donne : à une inconnue, contre de l’argent.'] },
    { say: ['Izzy répète le nom. Il sort trop doux, et elle referme trop tard.', 'Izzy[sourire] : « J’ai pas besoin de ton numéro. T’as accepté mon argent. Tu crois que tu peux disparaître dans cette ville ? »'] }
  ];
}

function felixScene() {
  return [
    { card: 'Le 4B', seconds: 1.8 },
    { run: () => { enterQuatrebAlone(); Object.assign(player, { x: 0, y: -10 }); } },
    { say: ['Yarden pose les 520. Félix les prend sans les compter.'] },
    { run: () => { credits = 0; debt = 0; identityName = 'Yarden Weiss'; } },
    { say: ['Les papiers étaient prêts depuis la veille au soir. Un beau dossier : une nuit à écrire le nom trois cent quarante fois.', 'Félix : « Des impressions non vérifiables, et une rature volontaire. Un dossier sans faute est un dossier fabriqué. L’histoire tiendra. »'] },
    { say: ['Félix : « Les gens qui paient tout d’un coup paient rarement avec leur propre argent. »', 'Félix : « Vous êtes venu couper une laisse. Je vous demande juste de savoir avec quoi vous l’avez coupée. »', 'Yarden a brisé sa propre règle du chapitre 3 sans s’en apercevoir.'] },
    { say: ['Ce n’est pas Félix qui parle : c’est le 4B. L’homme fabrique, le lieu perçoit.', 'Le 4B : « Bonne journée, monsieur Weiss. »'] }
  ];
}

function costumesScene() {
  return [
    { run: () => {
      enterZone('sousgare', 'start'); clearActors();
      Object.assign(player, { x: 0, y: -40 });
      ['chef-costume', 'operateur-a-costume', 'operateur-b-costume'].forEach((sheet, i) => sceneActor('costume' + i, 'sheet', -130 - i * 38, -34 - (i % 2) * 14, { sheet, face: 1 }));
    } },
    { say: ['Midi. Sous la porte cochère, trois hommes en costumes sombres, décalés d’une dizaine de mètres sur la gauche : le chef et deux inconnus.', 'Plus de veste technique, plus de chaussures de marche.'] },
    { say: ['Ils ne font rien. Mains dans les poches, pas de téléphone, pas de gobelet. Le chef n’ouvre pas le carnet.', 'Il incline légèrement la tête : une confirmation, pas un salut.', 'Ils étaient là avant elle.'] },
    { end: 'Fin du chapitre 5. Niveau 27, VIT 11, papiers en main, trois jours dus à Izzy. Fin du prototype !' }
  ];
}

function chapter5Script() {
  return [...morningScene(), ...cityScene(), ...felixScene(), ...costumesScene()];
}
