# Yarden — L’Abysse

Prototype du chapitre 1 : un petit donjon en vue du dessus, jouable sur téléphone.

[Ouvrir le jeu](https://kanoew.github.io/Claudex-RPG/)

## Jouer

1. Avance depuis l’entrée au sud vers la faux violette pour la manifester gratuitement.
2. Bats le rôdeur rose et le chargeur jaune. Les annonces orange indiquent leurs attaques.
3. Affronte le Gardien : éloigne-toi du cercle orange ou esquive l’impact.
4. Après sa défaite, rejoins la porte verte au nord pour sortir.

Sur téléphone : joystick à gauche ; boutons Faux, Fauchage et Esquive à droite. Sur PC : flèches, ZQSD ou WASD ; Espace pour la faux, E pour Fauchage et Maj pour esquiver.

Yarden a 5 PV et 30 mana. La faux coûte 3 mana, Fauchage 12 ; le mana revient à 3/s. L’esquive est gratuite. Un bouton permet de recommencer après une victoire ou une défaite.

## Fichiers et publication

Ouvre `index.html` directement dans un navigateur récent ou utilise le lien du jeu. Aucun outil de build, paquet à installer ou serveur n’est nécessaire. `enemies.js`, `dungeon.js`, `hud.js` et `render.js` sont chargés avant `game.js`. Les règles et les contrôles restent dans `game.js` ; les barres et boutons sont mis à jour par `hud.js`, et le dessin de la salle et des formes provisoires est dans `render.js`.

## Interface et décor

La vie et le mana ont des barres avec valeurs numériques. Les boutons affichent leur coût ou leur temps de récupération. Le Gardien a une barre fixe dès son apparition et une flèche indique sa position lorsqu’il est hors champ. L’objectif reste au-dessus du terrain.

Deux images de décor, originales et CC0, sont incluses : `assets/sol-pierre.svg` (dalles) et `assets/mur-pierre.svg` (maçonnerie), environ 1,3 Ko au total. Voir `assets/LICENCE.md`. Les portes, piliers et l’ombre autour de Yarden sont dessinés en Canvas. Si les images échouent à charger, un décor de secours est dessiné ; le jeu et les collisions restent identiques.

Yarden et les ennemis gardent leurs formes provisoires. Les sprites restent pour les étapes 13 et 14 ; aucun portrait ou sprite n’est inclus dans cette livraison.

GitHub Pages publie la racine de `main` après fusion. À chaque changement des scripts, augmente leur numéro `?v=` dans `index.html`, puis actualise la page après publication.

## Vérifier la logique

Avec Node disponible, sans installation de dépendances :

```sh
node tests/smoke.cjs
```

Ces tests simulent le Canvas. Ils ne remplacent pas une vérification du rendu, de la fluidité et des gestes à deux pouces sur Android. Voir [BILAN.md](BILAN.md) pour l’état du prototype et les essais restants.
