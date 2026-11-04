# Ton audit, en lecture rapide

Le jeu n’a pas été modifié. Aucun commit, aucune suppression, aucun push.

## Ce que je ferais d’abord

1. **Réparer les raccords de l’histoire.** Ishara connaît déjà Yarden quand elle réagit comme si elle découvrait son prénom. La confrontation sur l’araignée existe en deux versions successives. Le chapitre 6 se souvient aussi de phrases absentes du chapitre 5.
2. **Enlever les notes restées dans le récit.** Par exemple « sa règle du chapitre 3 » et « Plusieurs loots, niveau 19 max, propre ».
3. **Laisser respirer les scènes.** Souvent, un geste raconte déjà quelque chose, puis la narration l’explique deux fois. Mes propositions gardent le geste et coupent les commentaires en trop.
4. **Remettre les documents à jour.** Le jeu va jusqu’au chapitre 6 ; le README et le bilan décrivent encore une version plus courte.
5. **Corriger l’export des textes.** Il répète des chapitres entiers dans le document de relecture. Cela ne signifie pas que le jeu les joue plusieurs fois.

## Pour les fichiers inutiles

Je n’ai pas trouvé de gros fichier de code entier à supprimer sans perdre une fonction identifiable du jeu. Il y a quelques petits éléments sans usage actuel, des anciens packs qui servent encore aux aperçus, et beaucoup de ressources préparées pour la suite.

La majorité du poids vient des images de travail, pas du jeu chargé sur téléphone. Certaines ont été conservées à ta demande pour pouvoir refaire les exports : je ne recommande pas de les jeter.

## Où lire

- [Rapport des fichiers](01-FICHIERS-ET-NETTOYAGE.md) : à quoi ils servent, pourquoi certains encombrent le projet, quoi risquerait de casser.
- [Rapport des dialogues et de la cohérence](02-DIALOGUES-ET-COHERENCE.md) : commence par les six priorités et ce que je garderais. Le détail contient 27 observations de raccord ou de présentation et 50 propositions de style. Tu peux les accepter séparément.
- [Inventaire des 523 fichiers](03-INVENTAIRE-523-FICHIERS.csv) : une ligne par fichier, lisible dans un tableur. L’ouvrir avec le séparateur point-virgule si nécessaire.

Les citations du rapport détaillé renvoient aux fichiers et aux lignes du dépôt analysé. Les deux fichiers JSON sont des annexes techniques : observations structurées et liste des 108 images demandées par les chargeurs actuels.

Les 48 tests logiques existants passent. Je n’ai pas fait de partie complète sur téléphone et les romans intégraux ne sont pas dans ce dépôt : les points marqués « à confirmer » restent à comparer aux chapitres. Une phrase que je trouve artificielle n’est pas une preuve d’origine IA ; c’est un avis de lecture.

Version analysée : `6ab6572438ba771576f297ac0e06dbbfc1727b28`, le 4 novembre 2026. Les rapports sont placés à côté du dépôt, dans `/workspace/rapports-audit-yarden/`.
