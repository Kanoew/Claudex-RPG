# Yarden — L’Abysse

Prototype du chapitre 1 : un petit donjon en vue du dessus, jouable sur téléphone.

[Ouvrir le jeu](https://kanoew.github.io/Claudex-RPG/)

## Jouer

1. Avance depuis l’entrée au sud vers la faux violette pour la manifester gratuitement.
2. Bats le gobelin bleu et l’ogre rouge. Les annonces orange indiquent leurs attaques.
3. Affronte le Troll : éloigne-toi du cercle orange ou esquive l’impact.
4. Après sa défaite, rejoins la porte verte au nord : elle mène dehors.
5. Dehors, explore la première zone (rochers, deux gobelins qui se réveillent quand tu t’approches), puis quitte-la par le sentier au nord pour terminer le prototype. La grotte au sud te ramène au donjon.

Sur téléphone : joystick à gauche ; boutons Faux, Fauchage et Esquive à droite. Sur PC : flèches, ZQSD ou WASD ; Espace pour la faux, E pour Fauchage et Maj pour esquiver.

Yarden a 5 PV et 30 mana. La faux coûte 3 mana, Fauchage 12 ; le mana revient à 3/s. L’esquive est gratuite. Un bouton permet de recommencer après une victoire ou une défaite.

## Fichiers et publication

Ouvre `index.html` directement dans un navigateur récent ou utilise le lien du jeu. Aucun outil de build, paquet à installer ou serveur n’est nécessaire. `enemies.js`, `dungeon.js`, `hud.js`, `zones.js`, `yarden-sprite.js`, `monster-sprite.js` et `render.js` sont chargés avant `game.js`. Les salles sont des données dans `zones.js` (dimensions, blocs, portes, monstres) ; `loadZone()` remplit la salle courante. Les règles et les contrôles restent dans `game.js` ; les barres et boutons sont mis à jour par `hud.js`, et le dessin de la salle et des formes provisoires est dans `render.js`.

## Interface et décor

La vie et le mana ont des barres avec valeurs numériques. Les boutons affichent leur coût ou leur temps de récupération. Le Gardien a une barre fixe dès son apparition et une flèche indique sa position lorsqu’il est hors champ. L’objectif reste au-dessus du terrain.

Deux images de décor, originales et CC0, sont incluses : `assets/sol-pierre.svg` (dalles) et `assets/mur-pierre.svg` (maçonnerie), environ 1,3 Ko au total. Voir `assets/LICENCE.md`. Les portes, piliers et l’ombre autour de Yarden sont dessinés en Canvas. Si les images échouent à charger, un décor de secours est dessiné ; le jeu et les collisions restent identiques.

Yarden est animée par `yarden-sprite.js` (chargé avant `render.js`) : repos et course du [pack de sprites](docs/art/yarden/README.md), puis marche vers le haut et le bas, coup de faux, esquive, dégâts et défaite (`assets/yarden/`, détails dans `assets/yarden/actions.json`). Les bandes de gauche et de droite sont deux dessins distincts : elles ne sont jamais retournées. Le coup, l’esquive et la réaction aux dégâts suivent la durée réelle de l’action ; l’arc du coup reste le repère de portée. À la défaite, Yarden tombe avant l’affichage du message de fin. Si une image ne charge pas, le jeu retombe sur le repos, la course ou le disque violet. Vers le haut ou le bas, le coup et l’esquive utilisent le dernier côté gauche ou droit. Les trois monstres ont leurs sprites (`monster-sprite.js`, bandes de `assets/monsters/` décrites dans `monsters.json`) : gobelin, ogre et Troll (ancien Gardien). Chacun a une marche de quatre images, une pose d’annonce et une pose de coup ou de charge calées sur les attaques du jeu, un flash blanc quand il est touché, et regarde Yarden (leurs images sont retournées pour la droite). Si une image ne charge pas, le disque rose, le carré jaune ou le disque violet reviennent. L’araignée de cristal est dessinée mais pas encore dans le jeu.

GitHub Pages publie la racine de `main` après fusion. À chaque changement des scripts, augmente leur numéro `?v=` dans `index.html`, puis actualise la page après publication.

## Vérifier la logique

Avec Node disponible, sans installation de dépendances :

```sh
node tests/smoke.cjs
```

Ces tests simulent le Canvas. Ils ne remplacent pas une vérification du rendu, de la fluidité et des gestes à deux pouces sur Android. Voir [BILAN.md](BILAN.md) pour l’état du prototype et les essais restants.

