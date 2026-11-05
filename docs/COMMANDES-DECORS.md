# Commandes de décors : tout ce que GPT doit générer

À donner à GPT en une fois : il génère image par image, dans l'ordre, puis range le tout dans un zip. Les décors sont posés par `decors.js` (voir `assets/decors/`). **Les obstacles, personnages et collisions restent ceux du jeu** : les décors n'en contiennent aucun qui bouge.

## 1. Instruction de départ à coller dans GPT

```
Tu génères les décors d'un petit jeu 2D en vue de dessus à trois quarts (chibi, manhwa semi-réaliste). Je te donne un BLOC DE STYLE, puis une liste numérotée d'images. Génère-les toutes, une par une, dans l'ordre, sans me poser de question. Garde exactement le même style, la même palette et le même angle de caméra pour toutes les images. Respecte le format indiqué pour chaque image. Nomme chaque fichier exactement comme indiqué. À la fin, range tous les fichiers dans un seul zip avec deux dossiers : decors/ (fonds) et objets/ (planches d'objets sur fond vert). Si une image est ratée, régénère-la avant de passer à la suivante.
```

## 2. Bloc de style (à coller avant la liste)

```
STYLE : vue de dessus à trois quarts, caméra à environ 60 degrés, échelle constante (pas de point de fuite, pas de perspective plongeante). Rendu semi-réaliste manhwa, inspiré de WLOP, émulation de pellicule CineStill 800T, grain marqué, brume douce, reflets sur les surfaces mouillées. Palette bleu-vert froid dominante, ombres profondes, UN SEUL accent chaud (la lumière d'une porte, de fenêtres ou d'une lampe). Le sol au centre doit rester propre et lisible. INTERDIT : personnages, animaux, voitures, vélos, arbres, mobilier mobile, poubelles, texte, lettres, logos, enseignes avec mots, filigrane. Le fond doit être assez plat pour poser de petits personnages chibi dessus.
```

Négatif : `people, characters, cars, bicycles, trees, bins, text, letters, watermark, fisheye, strong perspective, vanishing point`

## 3. Lot 1 : extérieurs (le plus joué)

| N° | Fichier | Format | Contenu |
|---|---|---|---|
| 1 | `decors/quartier.png` | 5:4 | **Déjà fait** (rue devant l'immeuble, nuit, porte au centre). À refaire seulement pour la variante `quartier-jour.png`. |
| 2 | `decors/quartier-jour.png` | 5:4 | Même rue, même cadrage, même immeuble, **en plein jour** (matin clair, ciel couvert). Mêmes fenêtres, même porte. |
| 3 | `decors/exterieur.png` | 9:16 | Ruelle étroite d'Helvara, la nuit : bitume, caniveaux, trottoirs étroits, murs de briques de chaque côté, la porte lumineuse d'une résidence étudiante tout au nord avec quelques lanternes en papier, lampadaire. Sol propre au centre. |
| 4 | `decors/impasse.png` | 1:1 | Impasse derrière un pressing fermé, **matin**, lumière grise : rideau métallique baissé, murs sales, sol en béton, un coin d'ombre. |
| 5 | `decors/marterey.png` | 3:2 | Rue Marterey, **dix heures, jour** : une porte marron sans enseigne entre un kebab et une laverie (sans texte), trottoir et chaussée. |
| 6 | `decors/sousgare.png` | 1:1 | Quartier Sous-gare, **jour** : un immeuble Belle Époque « trop normal », quatre étages, fenêtres alignées, des fleurs au deuxième, une porte d'entrée, trottoir et chaussée. |
| 7 | `decors/cour.png` | 3:4 | Cour intérieure du même immeuble : pavés sans une herbe, lierre taillé au cordeau, arbustes taillés, murs sobres. Tout est taillé au millimètre. |
| 8 | `decors/square.png` | 4:3 | Un square, **tôt le matin** : allées de gravier, pelouse tondue, bordure, lumière froide. Pas de banc, pas d'arbre (à part). |
| 9 | `decors/flon.png` | 3:2 | Esplanade et terrasse d'un bar au Flon, **fin d'après-midi** : dalles, rebord, façade d'un bar sans enseigne lisible. Pas de tables (à part). |

### Planches d'objets (fond vert pur #00FF00, un seul fichier par planche)

Chaque planche : objets bien séparés, sans se toucher, sans ombre portée sur le vert, même angle que les décors, **mêmes couleurs et même éclairage froid**. Format 16:9.

| N° | Fichier | Contenu de la planche |
|---|---|---|
| 10 | `objets/quartier.png` | deux voitures garées (une bordeaux, une bleu-gris), un support à vélos avec trois vélos, un arbre en bac, une jardinière fleurie, une poubelle de rue |
| 11 | `objets/exterieur.png` | une benne verte rouillée, une pile de trois caisses en bois, deux poubelles à roulettes noires, un scooter sombre (un vrai scooter) |
| 12 | `objets/impasse.png` | deux poubelles, un vélo appuyé |
| 13 | `objets/square.png` | un banc public, un arbre, un lampadaire |
| 14 | `objets/flon.png` | trois tables rondes de terrasse avec chaises, un comptoir de bar extérieur |

## 4. Lot 2 : intérieurs (après validation du lot 1)

Les meubles qui comptent pour le jeu (zones à examiner) seront posés par le jeu ; l'image ne montre que murs, sol, éclairage et éléments fixes.

| N° | Fichier | Format | Contenu |
|---|---|---|---|
| 15 | `decors/appartement.png` | 1:1 | Appartement d'Ishara, 3ᵉ étage, **palette chaude, jamais de bleu** : sol en parquet, murs clairs, entrée et cuisine à l'est, salon à l'ouest. Sans meubles. |
| 16 | `decors/comptoir.png` | 3:4 | Couloir étroit puis comptoir de Rémi : un comptoir avec une lampe spéciale, une balance, une ardoise à la craie. **Aucun écran, aucune trace électronique.** |
| 17 | `decors/quatreb.png` | 1:1 | Le 4B, un appartement **chaud et encombré** : parquet, murs encombrés d'étagères vides, une fenêtre. Sans meubles mobiles. |
| 18 | `decors/escalier.png` | 9:16 | Escalier de pierre qui monte, étroit, l'air dense. Vue de dessus, une seule volée. |
| 19 | `decors/preau.png` | 5:4 | Préau désaffecté : colonnes, sol de béton, poussière, lumière du jour. |
| 20 | `decors/hall.png` | 4:3 | Hall d'immeuble d'Ouchy : sol de marbre, ascenseur au fond, boîtes aux lettres. |
| 21 | `decors/penthouse.png` | 3:2 | Seizième étage : grande baie vitrée donnant sur la ville et l'eau, sol de marbre, très peu de meubles, lumière du soir. |

## 5. Lot 3 : l'Abysse (plus tard)

| N° | Fichier | Format | Contenu |
|---|---|---|---|
| 22 | `decors/donjon.png` | 3:2 | Salle de pierre de l'Abysse, dalles usées, murs lourds, lumière froide. |
| 23 | `decors/run.png` | 4:3 | Salle plate à la lumière **ocre**, quelques roches au sol (sans piliers). |
| 24 | `decors/antre.png` | 5:4 | Antre de cristal, cristaux bleu-violet, câbles de cristal au sol. |

## 6. À savoir (pour Jordan)

- Je recadre et je redimensionne : générer en haute résolution, format indiqué, c'est tout.
- Un même lieu jour et nuit = deux fichiers (`-jour`). Le jeu choisira selon la scène ; pour l'instant seule la nuit du quartier est branchée.
- Rien n'est branché tant que Jordan n'a pas validé le rendu. L'ancien dessin en code reste en secours.

## 7. Lot 4 : appartement d'Ishara, penthouse d'Izzy, escalier (5 novembre 2026)

Les trois dernières zones encore dessinées en code. Décor sans meubles, meubles sur une planche à fond vert (même principe que la ruelle). Les mesures sont celles du jeu (`zones.js`) : l'image doit épouser les collisions, sans rien déplacer. Les pourcentages sont ceux du rectangle de la zone.

| N° | Fichier | Format |
|---|---|---|
| 1 | `decors/appartement.png` | 1:1 |
| 2 | `objets/appartement.png` | 16:9, fond vert |
| 3 | `decors/penthouse.png` | 3:2 |
| 4 | `objets/penthouse.png` | 16:9, fond vert |
| 5 | `decors/escalier.png` | 9:16 (la bande centrale est recadrée au rapport 1:5 du jeu) |

À coller d'abord (bloc de style) :

```
STYLE : vue de dessus à trois quarts, caméra à environ 60 degrés, échelle constante (pas de point de fuite). Rendu semi-réaliste manhwa, inspiré de WLOP, émulation de pellicule CineStill 800T, grain marqué, brume douce, reflets sur les surfaces. Le sol doit rester propre et lisible. INTERDIT : personnages, animaux, meubles ou objets mobiles (sauf sur les planches demandées), texte, lettres, logos. Assez plat pour poser de petits personnages chibi dessus.
```

**1. Appartement d'Ishara** (room x -320, y -300, 640 × 600 ; palette chaude, jamais de bleu)

```
Cutaway floor plan of a small apartment seen from above at 60 degrees, square 1:1, ceiling removed so every room is visible, warm cozy palette (honey wood parquet, cream walls, soft lamp light), never blue. NO furniture, NO objects, only walls, floors, doors and windows. Layout, using percentages of the image (left to right, top to bottom):
- A straight central corridor running north to south at 41% to 59% of the width.
- Top-left, 0% to 37% wide and 0% to 45% tall: a living room, with a large window in the north wall at around 27% of the width.
- Top-right, 62% to 100% wide and 0% to 45% tall: an open kitchen area with a bare tiled north wall. The entrance door is in the east wall at about 34% of the height.
- A horizontal partition wall at 45% to 48% of the height across both left and right sides.
- Bottom-left, 0% to 37% wide and 48% to 100% tall: a small spare bedroom with a window on the west wall at about 65% of the height.
- Bottom-right, 59% to 100% wide and 48% to 75% tall: a small bathroom with a tiled floor.
- Below it, 59% to 100% wide and 78% to 100% tall: a closed bedroom, seen only as a room with a shut door at the corridor wall.
Warm lamp light, soft shadows, clean floors.
```

**2. Meubles de l'appartement** (planche)

```
Game asset sheet on a flat solid pure green (#00FF00) background, 16:9, well spaced objects, none touching, no shadow on the green. Same camera angle as the apartment cutaway (60 degrees from above), warm palette, never blue. Objects, left to right, top to bottom: 1) a three-seat sofa; 2) a low coffee table with two mugs; 3) a stack of books on a small shelf; 4) a small square dining table; 5) a kitchen counter with a kettle and keys, 240x36 proportion (long and thin); 6) a kitchen unit with sink and cupboards, 240x40 proportion; 7) a single bed with clean linen; 8) a wardrobe, 120x40 proportion; 9) a radiator with towels; 10) a small shower cubicle; 11) a bathroom sink with a mirror and a tap.
```

Positions dans le jeu : canapé (-250,-90, 130×44), table basse (-235,-170, 100×44), livres (-310,-290, 34×44), table (-30,-130, 60×60), comptoir (70,-180, 240×36), cuisine (70,-300, 240×40), lit (-310,150, 90×140), placard (-210,255, 120×40), radiateur (140,120, 100×30), douche (260,86, 60×64), lavabo (255,-10, 65×36). Cloisons et couloir : voir `zones.js`. Points à examiner : `apartmentSpots` dans `apartment.js`.

**3. Penthouse d'Izzy** (room x -330, y -230, 660 × 470)

```
Top-down three-quarter view of a very large luxury penthouse on the sixteenth floor, 3:2 aspect ratio, evening light, pale marble floor, almost no decoration, cold blue-teal dominant palette with ONE warm accent (a low lamp glow). NO furniture. Layout, as percentages of the image:
- A full-width floor-to-ceiling glass wall along the entire north edge, showing a city and a lake at dusk.
- An empty open lounge floor occupying the top 55% of the image.
- A horizontal partition across the image at 55% to 60% of the height, with a gap in the middle (38% to 42% of the width) leading to a corridor in the bottom 40%.
- In the bottom corridor area: three closed doors on the south side, the third one very slightly ajar.
- A bare area for a kitchen island at the top-left (0% to 23% wide, 5% to 16% tall).
Clean marble floor, soft reflections.
```

**4. Meubles du penthouse** (planche)

```
Game asset sheet on a flat solid pure green (#00FF00) background, 16:9, well spaced objects, none touching, no shadow on the green. Same camera angle (60 degrees from above), luxury cold palette, white marble and dark steel. Objects, left to right: 1) a long kitchen island with three stools, 150x44 proportion; 2) a long grey designer sofa, 200x36 proportion; 3) a second identical sofa; 4) a low rectangular white marble coffee table, 80x30 proportion.
```

Positions dans le jeu : baie (-330,-230, 660×26), cuisine-îlot (-330,-204, 150×44), canapés (40,-140) et (40,-60), 200×36 chacun, table de marbre (100,-100, 80×30), cloisons y 30..50 (x -330..-80 et x -50..330).

**5. Escalier** (room x -90, y -640, 180 × 900)

```
Top-down three-quarter view of a single straight narrow stone staircase going up, vertical 9:16 composition, the staircase exactly centered and occupying the middle third of the width, from the bottom to the top of the image, with stone walls on both sides, a small landing with a closed door at the very top. Dense heavy air, cold blue-teal dominant palette, deep shadows, one warm accent from a light above the door. Steps clean and readable, no objects, no people.
```
