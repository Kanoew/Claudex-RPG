# Yarden — L’Abysse

Prototype du chapitre 1 : un petit donjon en vue du dessus, jouable sur téléphone.

[Ouvrir le jeu](https://kanoew.github.io/Claudex-RPG/)

## Jouer

0. L’écran titre propose Commencer ou Continuer si une sauvegarde existe. Le bouton Pause ou Échap suspend le jeu ; le menu permet de revenir au dernier point de passage. La sauvegarde reste dans ce navigateur. Le jeu s’ouvre dans la ruelle d’Helvara : lis le réveil de Yarden, puis marche jusqu’à la faille, qui l’aspire dans l’Abysse. La vie, le mana et les actions n’apparaissent qu’à partir de là. Ajoute `?skip` à la fin du lien pour commencer directement dans le donjon.
1. Avance depuis l’entrée au sud vers la faux violette pour la manifester gratuitement.
2. Bats le gobelin bleu et l’ogre rouge. Les annonces orange indiquent leurs attaques.
3. Affronte le Troll : éloigne-toi du cercle orange ou esquive l’impact.
4. Après sa défaite, rejoins la porte verte au nord : elle mène à l’antre de l’araignée.
5. Avance dans l’antre puis lis le texte. Évite les tirs de venin annoncés en orange ; les colonnes de cristal noir peuvent te protéger. Les coups seuls ne percent pas sa carapace.
6. Approche-toi du cristal noir puis utilise « Cristal » (F au clavier). Pendant les cinq secondes d’aveuglement, approche l’araignée et touche-la avec Fauchage. Elle reste vivante et immobilisée ; Yarden perd connaissance puis se réveille dans la ruelle.
7. Traverse la ruelle d’Helvara en évitant bennes et caisses et rejoins la rue au nord. Quand Yarden remonte la ruelle, la scène du chapitre 2 se joue : Ishara et les deux hommes, le poignet, puis la fin du prototype. La faille se ferme après le réveil.

Sur téléphone : joystick à gauche ; boutons Faux, Fauchage et Esquive à droite. Sur PC : flèches, ZQSD ou WASD ; Espace pour la faux, E pour Fauchage et Maj pour esquiver.

Yarden commence avec 5 PV et 30 mana ; après l’araignée, elle atteint le niveau 24, avec 7 PV et 40 mana. L’invocation et le coup de base de la faux sont gratuits ; Fauchage coûte 20 mana. Le mana revient à 3/s. L’esquive est gratuite. Le venin ralentit temporairement les déplacements. En cas de mort dans l’antre, « Reprendre l’antre » évite de refaire le Troll. « Continuer » avance les courts textes sans faire tourner le combat.

## Fichiers et publication

Ouvre `index.html` directement dans un navigateur récent ou utilise le lien du jeu. Aucun outil de build, paquet à installer ou serveur n’est nécessaire. `enemies.js`, `dungeon.js`, `hud.js`, `zones.js`, `state.js`, `yarden-sprite.js`, `monster-sprite.js`, `encounter.js`, `scene.js`, `render.js`, `combat.js`, `input.js` et `movement.js` sont chargés avant `game.js`. Les salles sont des données dans `zones.js` (dimensions, blocs, portes, monstres) ; `loadZone()` remplit la salle courante. `state.js` porte l’état partagé, `combat.js` les coups et l’esquive, `input.js` le joystick, le clavier et la pause, `movement.js` les collisions, et `game.js` la boucle de jeu ; les barres et boutons sont mis à jour par `hud.js`, et le dessin de la salle et des formes provisoires est dans `render.js`.

## Interface et décor

La vie et le mana ont des barres avec valeurs numériques. Les boutons affichent leur coût ou leur temps de récupération. Le Gardien a une barre fixe dès son apparition et une flèche indique sa position lorsqu’il est hors champ. L’objectif reste au-dessus du terrain.

Deux images de décor, originales et CC0, sont incluses : `assets/sol-pierre.svg` (dalles) et `assets/mur-pierre.svg` (maçonnerie), environ 1,3 Ko au total. Voir `assets/LICENCE.md`. Les portes, piliers et l’ombre autour de Yarden sont dessinés en Canvas. Si les images échouent à charger, un décor de secours est dessiné ; le jeu et les collisions restent identiques.

Yarden est animée par `yarden-sprite.js` (chargé avant `render.js`) : repos et course du [pack de sprites](docs/art/yarden/README.md), puis marche vers le haut et le bas, coup de faux, esquive, dégâts et défaite (`assets/yarden/`, détails dans `assets/yarden/actions.json`). Les bandes de gauche et de droite sont deux dessins distincts : elles ne sont jamais retournées. Le coup, l’esquive et la réaction aux dégâts suivent la durée réelle de l’action ; l’arc du coup reste le repère de portée. À la défaite, Yarden tombe avant l’affichage du message de fin. Si une image ne charge pas, le jeu retombe sur le repos, la course ou le disque violet. Vers le haut ou le bas, le coup et l’esquive utilisent le dernier côté gauche ou droit. Les trois monstres ont leurs sprites (`monster-sprite.js`, bandes de `assets/monsters/` décrites dans `monsters.json`) : gobelin, ogre et Troll (ancien Gardien). Chacun a une marche de quatre images, une pose d’annonce et une pose de coup ou de charge calées sur les attaques du jeu, un flash blanc quand il est touché, et regarde Yarden (leurs images sont retournées pour la droite). Si une image ne charge pas, le disque rose, le carré jaune ou le disque violet reviennent. L’araignée de cristal a neuf poses dans `assets/monsters/spider.png` (marche, préparation, tir, dégâts, aveuglement et incapacitation) ; voir [la fiche de raccordement](docs/art/araignee/README.md). `encounter.js` gère son combat et les textes, `scene.js` joue la scène de la rue (Ishara et les deux hommes) d'après le canon fourni.

GitHub Pages publie la racine de `main` après fusion. À chaque changement des scripts, augmente leur numéro `?v=` dans `index.html`, puis actualise la page après publication.

## Vérifier la logique

Avec Node disponible, sans installation de dépendances :

```sh
node tests/smoke.cjs
```

Ces tests simulent le Canvas. Ils ne remplacent pas une vérification du rendu, de la fluidité et des gestes à deux pouces sur Android. Voir [BILAN.md](BILAN.md) pour l’état du prototype et les essais restants.

