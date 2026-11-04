# Corrections de cette branche

Branche : `codex/relecture-dialogues-coherence`.
Base : `6ab6572`. Les rapports d’audit décrivent cette base ; ce document décrit ce qui change ensuite.

## Ce qui est appliqué

| Repère | Fichier | Texte retenu ou changement |
|---|---|---|
| C01 | `chapitre3.js` | « Yarden Weiss, alors. Faut que je m’habitue. » |
| C02 | `chapitre3.js` | « Première fois que quelqu’un prononce son nom complet. » |
| C03 | `chapitre6.js` | « Elle ne l’a donné que trois fois : à Ishara, à Céleste, puis à Izzy, contre de l’argent. » |
| C04 | `chapitre4.js` | Les deux versions de la confrontation deviennent : « Hier, en sortant du 4B. L’araignée de cristal, niveau quarante et un. Je ne t’en ai jamais parlé. » |
| Précision sur le mana | `chapitre3.js`, `chapitre4.js` | Retrait des « sept pour cent de mana » dans la remarque initiale d’Ishara et dans le rappel de Yarden. Le jeu conserve l’anomalie du souvenir de l’araignée et de son niveau. |
| C05 | `chapitre6.js` | « Pendant mille ans, les couloirs se vidaient devant elle. » La récapitulation chien/homme/flaque proposée initialement n’est pas ajoutée. |
| C06 | `chapitre6.js` | « Elle repère la terrasse : une table vide au milieu des tables pleines… » |
| C07 | `chapitre6.js` | « Elles reviennent vers le salon… » |
| C08 | `chapitre3.js` | « L’escalier s’allège à mesure qu’elles descendent. » |
| C09 | `chapitre6.js` | « J’avais compris. » |
| C10 | `chapitre4.js` | « Et toi, plus lente qu’hier. » |
| C11 et S14 | `chapitre2b.js` | « Ishara ramasse quatre fragments et deux bourses. Le dernier gobelin n’a rien laissé. » Retrait de « Plusieurs loots, niveau 19 max, propre. » |
| C16 | `chapitre5.js` | « Elle passe devant la guilde du quartier sans entrer. » |
| C17 | `chapitre5.js` | Retrait de « Yarden a brisé sa propre règle du chapitre 3 sans s’en apercevoir. » Les paroles de Félix restent présentes. |

Les variantes courtes de C01, C05 et C16 suivent les ajustements de notre discussion. Pour C04, la précision de Jordan sur le mana prime sur la recommandation initiale de l’audit. Le rappel de la confrontation est conservé, sans ce chiffre.

Les passages marqués « à garder absolument » dans la proposition restent présents, notamment « Je suis un— », les paroles de Céleste, le faux souvenir et l’invitation d’Izzy. Aucun accord masculin n’a été remplacé en masse.

## Les fichiers d’accompagnement

- `index.html` : version `?v=80` pour les cinq scripts corrigés, afin que le navigateur recharge leurs textes.
- `docs/TEXTES.md` : copie de relecture régénérée depuis les sources corrigées.
- `PROJECT.md` : entrée de journal datée, sans réécriture des anciennes notes canoniques.
- `docs/audit-2026-11-04/` : rapports, inventaire et récapitulatif de cette branche.

## Ce qui reste proposé, sans application

Les autres observations du rapport restent des propositions : réécriture générale du style, restauration des échanges manquants avec Izzy, affichage des voix, correction de l’exporteur, mise à jour complète des anciens guides, archivage ou suppression de ressources et petits nettoyages du code.

Le générateur de `docs/TEXTES.md` répète encore les suites de chapitres : le document régénéré contient donc plusieurs occurrences des mêmes corrections. Le code des scènes n’a pas été dédoublé pour corriger un problème d’export.

## Vérification

Les 48 scénarios existants de `node tests/smoke.cjs` réussissent. La syntaxe des cinq scripts et les espaces du diff ont été contrôlés. Le rendu est simulé : aucune partie complète sur téléphone n’est revendiquée.

Pour relire : ouvrir [les textes mis à jour](../TEXTES.md), rechercher « Yarden Weiss, alors », « Hier, en sortant du 4B » et « quatre fragments et deux bourses ». Les anciennes phrases sont conservées dans les rapports historiques, pas dans les dialogues corrigés.

Pour tester sur téléphone après mise à disposition d’une version de cette branche : au point de passage « Le 4B », suivre la sortie de chez Félix et vérifier le nom complet et la remarque d’Ishara sans pourcentage de mana ; au point « Chapitre 4, 14 h », avancer jusqu’au soir et vérifier qu’une seule confrontation mentionne l’araignée ; au chapitre 6, examiner les trois faux trous et lire l’arrivée sur la terrasse. Le lien public habituel continue de montrer la version de `main` tant que cette branche n’est pas fusionnée.

Aucun fichier de ressource supprimé. Aucun push ni publication effectué pour cette préparation locale.
