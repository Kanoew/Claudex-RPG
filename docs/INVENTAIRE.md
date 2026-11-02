# Inventaire et gel — étape 1 du cahier des charges (2 novembre 2026)

Une ligne par chantier commencé mais pas fini. **Décision proposée** : à finir, à geler ou à jeter. Jordan valide ou corrige chaque ligne ; rien n'est touché avant.

## À finir (dans la V1)

| Chantier | État | Qui |
|---|---|---|
| Essai Android des chapitres 4 à 6, du texte progressif, de la ruelle peinte et de l'image de tête de Yarden (correctif d'inversion de couleurs) | codé, jamais confirmé sur téléphone | Jordan |
| Liste de corrections après essai Android | attendue | Jordan |
| Musiques `titre`, `ville`, `abysse`, `fete` (`assets/musique/`) | la musique en code joue en attendant | Jordan (fichiers en cours) |
| Relecture des textes, chapitre par chapitre (étape 6) | `docs/TEXTES.md` généré ; lignes inventées à valider (`docs/TOPO-TEST.md` section 9) | Jordan, puis correction |
| Mode libre : butin, vente, XP (décision du 30 octobre à lever, levée le 2 novembre) | pas fait | étapes 2 à 4 |
| Couleur des noms et narration en italique dans les dialogues (retour d'un testeur) | pas fait, petit chantier | à placer après l'étape 2 |

## À geler (hors V1, `CAHIER-DES-CHARGES.md` section 5)

| Chantier | Où c'est rangé |
|---|---|
| Combat au tour par tour | `combat-tour.js`, `tests/combat-tour.cjs`, `docs/COMBAT-TOUR-PAR-TOUR.md` ; réglage retiré des paramètres, mode forcé en temps réel |
| Chapitres 7 à 9 (code non écrit) et pack d'images converti mais non branché | `docs/art/ch7-9/`, `assets/npcs/ch7-9/`, `assets/objets/`, 11 portraits ; texte dans `PROJECT.md` sections 37 à 38 |
| Décors peints des autres zones (quartier, appartement d'Ishara, chapitres 4 à 6) | seule la ruelle est peinte (`assets/decors/`) ; briefs à refaire au besoin ; générateur d'images disponible à partir du 16 |
| Scène d'ouverture « Jordan boss de donjon » | idée, aucun canon fourni |
| Renforcer la voix intérieure de Tiamat (son, texte par à-coups) | proposé, non décidé |
| Banc scellé du chapitre 4 ; scène d'Izzy condensée au chapitre 5 | notés dans `PROJECT.md` (points ouverts) |
| Nouvelles scènes, personnages, sprites | tout ajout passe par un jalon du cahier |

## À vérifier avant de jeter

| Chantier | Question |
|---|---|
| Branches Codex non fusionnées : `codex/combat-tour-ruelle` (ruelle plate), `codex/hommes-ruelle-animations`, `codex/izzy-celeste-mouvements`, `codex/izzy-celeste-premier-pack` | Leur contenu est-il déjà dans `main` sous d'autres commits ? La ruelle plate n'est pas reprise (décision du 2 novembre). À examiner une par une, jamais fusionnées sans Jordan. |

## À jeter

Rien de sûr pour l'instant. Les propositions de jeter se font ici, pas dans le code.

## Rappel de la décision de moteur

On reste sur HTML, JavaScript et Canvas 2D (Godot jugé trop lourd pour un premier jeu, Jordan, 2 novembre 2026). `PROJECT.md` section 1 parlait seulement de rouvrir la question à la fin de la phase 2 ; la date du 28 octobre citée dans le cahier n'y est pas retrouvée.
