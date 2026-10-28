# Yarden — ressources pour l’étape 13

Ce dossier prépare le remplacement du disque provisoire de Yarden. Les fichiers du jeu ne chargent pas encore ces images : l’intégration et le test Android restent à faire dans la prochaine session. Aucun changement de combat, collision, contrôle ou caméra n’est inclus.

## Où commencer

- Ouvrir [l’aperçu animé](index.html) localement dans un navigateur, ou sur GitHub Pages après fusion : `/Claudex-RPG/docs/art/yarden/`.
- Pour le jeu : [`assets/yarden/`](../../../assets/yarden/) contient onze bandes PNG transparentes et le manifeste [`animations.json`](../../../assets/yarden/animations.json). L’ensemble pèse environ **208 Ko**, chaque PNG moins de 24 Ko.
- Pour retravailler les images : [planche source complète](yarden-source.png), 1536 × 2288 pixels, cases de 192 × 208. Cette source de 3,17 Mo est une référence ; ne pas la charger pendant le jeu sur téléphone.
- [Référence du personnage](yarden-reference.png), [planche des poses](contact-sheet.png), [seize regards](directions.png), [étapes du mouvement](motion-stills.png).
- Aperçus : [toutes les animations en GIF](previews/all-states.gif), [vidéo MP4](previews/all-states.mp4), [repos → saut → repos](previews/idle-jump-idle.gif), [boucle des regards](previews/look-loop.gif).

Les GIF, la vidéo et les grandes images de ce dossier servent à la vérification et à la préparation. Ils ne sont pas importés par le jeu et ne font pas partie de son chargement initial.

## Animations disponibles

Les indices de ligne de la source commencent à zéro. La version légère garde exactement le même ordre des images, avec des cases de **96 × 104 pixels**, en une ligne par fichier. Les durées précises sont dans le manifeste.

| Ligne source | Bande dans `assets/yarden/` | Images | Utilisation | GIF |
|---|---|---:|---|---|
| 0 | `idle.png` | 6 | Repos, respiration et clignement | [Voir](previews/idle.gif) |
| 1 | `running-right.png` | 8 | Déplacement vers la droite | [Voir](previews/running-right.gif) |
| 2 | `running-left.png` | 8 | Déplacement vers la gauche | [Voir](previews/running-left.gif) |
| 3 | `waving.png` | 4 | Salut | [Voir](previews/waving.gif) |
| 4 | `jumping.png` | 5 | Saut avec élévation puis retour au sol | [Voir](previews/jumping.gif) |
| 5 | `failed.png` | 8 | Déception / contrariété | [Voir](previews/failed.gif) |
| 6 | `waiting.png` | 6 | Attente, paume ouverte | [Voir](previews/waiting.gif) |
| 7 | `running.png` | 6 | Réflexion, main au menton | [Voir](previews/running.gif) |
| 8 | `review.png` | 6 | Vérification, ajustement des lunettes | [Voir](previews/review.gif) |
| 9 | `look-9.png` | 8 | Regards de 0° à 157,5° | [Voir la boucle](previews/look-loop.gif) |
| 10 | `look-10.png` | 8 | Regards de 180° à 337,5° | [Voir la boucle](previews/look-loop.gif) |

**Attention au nom `running` : il désigne la réflexion, pas une course.** Les déplacements sont `running-left` et `running-right`. Une réaction de déception n’est pas une animation de dégâts ou de mort.

Les seize regards tournent dans le sens horaire, en coordonnées écran : 0° haut, 90° droite, 180° bas, 270° gauche. Ils font tourner la tête et les yeux ; **ce ne sont pas seize directions de marche**, ni des vues complètes de dos. Le passage entre les deux bandes, surtout 337,5° → 0°, est plus marqué que les autres changements de tête.

## Identité à conserver

Yarden porte les lunettes rondes dorées, le chignon noir à mèches lavande-gris, une veste courte et un pantalon cargo noirs, des boucles argentées. Le gant noir est sur sa **main gauche anatomique**, les tatouages de plumes sur le bras et la main **droits**, laissés nus. L’accent violet est sur son flanc gauche. Pas de collier, d’ear cuff ni d’arme dans ces sprites.

Ne pas retourner horizontalement une bande pour fabriquer l’autre sens : cela inverse le gant, les tatouages et l’accent du flanc. Les deux courses ont été préparées séparément.

## Passage de relais pour la prochaine session

1. Lire `PROJECT.md` en entier. Cette livraison prépare les ressources ; elle ne valide pas l’étape 13.
2. Charger seulement les bandes nécessaires et conserver le disque actuel comme secours si une image échoue.
3. Utiliser `render.js` pour le dessin et les états du jeu existants pour choisir l’animation. Ne pas changer les collisions ou les valeurs de combat pour adapter les images.
4. L’étape 13 prévoit quatre directions de marche et un coup de faux. **Il manque encore la vraie marche vers le haut/de dos et vers le bas, ainsi que le coup de faux.** Il n’y a pas non plus de roulade, dégâts ou mort dédiés. Demander la suite à Jordan avant de produire ces nouvelles séquences ; ne pas présenter les regards ou le saut comme leur remplacement.
5. Les fichiers du jeu restent des scripts simples, sans dépendance ni build. Si un script chargé change, augmenter sa version `?v=` dans `index.html`.
6. Tester sur Android : silhouette lisible, pieds stables, annonces ennemies visibles, attaques/esquive/collisions et commandes à deux pouces toujours identiques.

### Découpage Canvas

Le manifeste fournit le nombre d’images, les durées et un point d’ancrage commun : **(48, 101)** dans une case légère de 96 × 104. Il est situé près du sol. Garder les cases complètes, y compris pour le saut : recadrer chaque pose séparément supprimerait l’élévation et créerait des sauts de taille.

```js
// image = bande PNG chargée, frame = index à partir de zéro.
// groundX/groundY = point au sol choisi pour le personnage à l’écran.
const scale = 0.5; // exemple : case affichée de 48 × 52, à juger sur Android
ctx.drawImage(image, frame * 96, 0, 96, 104,
  groundX - 48 * scale, groundY - 101 * scale,
  96 * scale, 104 * scale);
```

Le contrôleur doit cumuler le temps écoulé et respecter les durées de chaque image, puis boucler ou terminer selon l’action choisie. L’aperçu autonome montre ce découpage ; il n’est pas un contrôleur de combat prêt à brancher.

## Provenance et vérification

Images fournies par Jordan pour son personnage Yarden, auparavant nommé Vesper pendant la préparation. Aucun droit CC0 n’est ajouté à ces fichiers ; la déclaration `assets/LICENCE.md` reste limitée aux deux images de pierre.

La planche source contient 73 poses dans une grille de 8 × 11, dont 15 cases inutilisées transparentes. Les bandes légères sont extraites de cette planche, réduites ensemble à 50 % et enregistrées en PNG à palette avec transparence. Aucun dessin nouveau, miroir ou changement de pose n’est appliqué lors de cette conversion. Le SHA-256 de la source est inscrit dans le manifeste pour identifier les mêmes pixels.
