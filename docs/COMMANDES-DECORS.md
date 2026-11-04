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
