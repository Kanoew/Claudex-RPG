# Yarden — Générations des chapitres 7 à 9

## Livraison

| Besoin | Cases animées | Portraits |
|---|---:|---:|
| Vieille femme de la maison, assise | 4 | 1 |
| Homme au costume gris | 16 | 1 |
| Céleste à l’intake | 24 | 2 |
| Onze pièces sur le feutre | 11 objets statiques | — |
| Yarden à mains nues | 96 | — |
| Ishara à la dague | 24 | — |
| Izzy en t-shirt gris | 20 | 3 |
| Concierge d’Ouchy | 12 | 1 |
| Vasseur | 16 | 1 |
| Céleste du quotidien, puis manteau/foulard | 40 | 2 |

Total : 56 séquences, 252 cases animées, 11 portraits et 11 objets.

## Format contrôlé

- Bandes par animation : cases 211 × 148, repère des pieds (105,132), fond vert RGB exact #00FF00 opaque.
- Bandes complètes par personnage ou tenue ; index des séquences dans animations.json.
- Portraits : fichiers individuels 256 × 256.
- Repos : 1000, 500, 140, 1000 ms ; marches : 150 ms par case.
- Poings, écrasement, esquive, dégâts et défaite de Yarden : six cases par action et par direction, dessinées séparément. Impacts du direct/croisé/écrasement sur les cases 3 et 4 (indices 2 et 3 dans le manifeste).
- Aucun retournement d’image utilisé dans les exports.
- Vérification des dimensions, du fond, des nombres d’images et des durées des GIF. Le CSV détaille chaque séquence.

## Reprises après contrôle des générations

- Céleste reste châtain dans toutes ses tenues et portraits.
- La marche de dos de Céleste à l’intake a été produite sur une bande complémentaire.
- Izzy : mèches devant le visage retirées, cheveux tirés en arrière ; t-shirt gris distinct du pack cosy bordeaux.
- Ishara : continuité de la présence de la dague reprise sur la marche à droite.

## Avant intégration

Ces ressources ne sont pas branchées dans le jeu. Valider la fluidité, les silhouettes et la taille dans les scènes ; les nouveaux visages des personnages sans référence physique sont des propositions visuelles.
Les asymétries ont été demandées et les deux directions de Yarden ont été générées séparément : gant gauche, main droite nue tatouée, déchirure à droite ; dague à droite pour Ishara, tatouage et chevalière à gauche pour Izzy. Relire les mains pose par pose avant de remplacer les sprites : les très petits détails des ongles et des jointures ne peuvent pas être certifiés à l’échelle de 100 px.
Les durées des actions sont des durées d’aperçu. Les caler sur les fenêtres de combat existantes lors du branchement, sans changer automatiquement les dégâts ou récupérations.
Les GIF réduisent la palette : les PNG verts sont les exports à intégrer. Le dossier apercus-png sert seulement au lecteur d’animations, avec transparence.
L’aperçu HTML a été contrôlé syntaxiquement, mais pas joué dans Chromium dans cette session.
Aucun décor, aucune tenue façade d’Izzy pour le chapitre 7 et aucune mécanique du jeu n’ont été modifiés.
