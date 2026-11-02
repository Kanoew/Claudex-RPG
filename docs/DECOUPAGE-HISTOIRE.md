# Découpage de l'histoire : un morceau par run

Étape 5 du cahier des charges. **Aucune scène nouvelle, aucun texte réécrit** : ce sont les scènes déjà dans le jeu, rejouées depuis la rue. Un run réussi (chef vaincu) débloque le morceau suivant ; on le lance avec le bouton **Histoire ✦**. L'ordre se change dans `hubUnits` (`hubstory.js`) en une ligne.

| Run | Morceau | Contenu (ce qui est déjà dans le jeu) | Ce que ça ouvre |
|---|---|---|---|
| 1 | Le comptoir de Rémi | rue Marterey, l'interphone, Rémi évalue le butin, le partage | **la boutique de Rémi** |
| 2 | Sous-gare, le 4B | l'immeuble, la cour, l'escalier, le 4B (chapitre 3) | |
| 3 | Les pâtes et la rupture | le dîner, le square tôt le matin (début du chapitre 4) | |
| 4 | L'équipe | l'équipe, le retour, les soins d'Ishara | |
| 5 | Céleste | Céleste (chapitre 4) | |
| 6 | L'araignée | la question de la mémoire d'Ishara | |
| 7 | Le poids d'une dette | la douche, les points de VIT, Izzy et ses 520 (chapitre 5) | |
| 8 | Félix et les costumes | le 4B, les costumes, le chef revient | |
| 9 | Le préau et le Flon | le préau, la recherche d'Izzy, le remboursement (chapitre 6) | |
| 10 | Ouchy | le hall, le seizième étage, la boîte (fin du chapitre 6) | |

## Règles de la rediffusion

- L'histoire jouée ne change rien à ce que tu as : crédits, dette, sac, niveau, points de stats et tenue sont remis comme avant à la fin du morceau.
- Elle ne modifie jamais le point de passage de l'histoire (« Continuer »).
- Le chapitre 1 (réveil, faille, faux, Troll) reste le tutoriel. Le chapitre 2 (appartement d'Ishara, nuit, miroir, premier run) n'est pas dans la liste : il fait partie du début de partie.
- Le texte de fin de chapitre 6 (« Fin du prototype ! ») est retiré en rediffusion.

## Décidé le 2 novembre 2026 (étape 5b)

« Nouvelle partie » joue le chapitre 1, puis le chapitre 2 jusqu'à la fin du premier run de l'impasse, puis ouvre le hub. Les morceaux 1 à 10 se rejouent ensuite depuis le hub.

## À décider avec Jordan

1. Le morceau 7 rouvre le panneau des points de VIT : on garde, ou on le saute en rediffusion ?
2. Faut-il un morceau plus court ou plus long à tel ou tel endroit (par exemple couper « L'équipe » en deux) ?
