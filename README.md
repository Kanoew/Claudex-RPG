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

Ouvre `index.html` directement dans un navigateur récent ou utilise le lien du jeu. Aucun outil de build, paquet à installer ou serveur n’est nécessaire. `enemies.js` et `dungeon.js` sont chargés avant `game.js`.

GitHub Pages publie la racine de `main` après fusion. À chaque changement des scripts, augmente leur numéro `?v=` dans `index.html`, puis actualise la page après publication.

## Vérifier la logique

Avec Node disponible, sans installation de dépendances :

```sh
node tests/smoke.cjs
```

Ces tests simulent le Canvas. Ils ne remplacent pas une vérification du rendu, de la fluidité et des gestes à deux pouces sur Android. Voir [BILAN.md](BILAN.md) pour l’état du prototype et les essais restants.
