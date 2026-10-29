# Bilan du prototype — Chapitre 1

## Point actuel — relecture du 29 octobre 2026

Le jeu comprend une ouverture dans la ruelle, un premier donjon (gobelin, ogre, Troll), l’antre de cristal et sa victoire par la ruse, le réveil au niveau 24 (7 PV, 40 mana et saut de joie), puis la rencontre avec Ishara et les deux hommes. Il s’arrête quand Ishara propose un hébergement. Le trajet, l’appartement, le miroir, le run du chapitre 2 et le 4B sont du canon préparé, pas encore du contenu jouable.

Le moteur reste en HTML/JavaScript/Canvas, sans dépendances. Il sépare désormais état, commandes, collisions, combat, scènes, rendu et sauvegarde. Écran titre, pause et trois points de passage sont présents. Les sauvegardes restent locales au navigateur ; le retour à un point de passage reconstruit un état déterminé, il ne restaure pas un combat au milieu.

La relecture a reproduit puis corrigé deux défauts : le retour au point de passage gardait des ennemis vaincus, des blessures et des récupérations de la partie courante ; le cristal et le récit pouvaient encore être activés sous le menu Pause. Deux scénarios de régression couvrent ces cas, dont les trois points de passage repris dans une même partie.

Confirmation de Jordan pour la suite « D. Miroir et tatouages » : invocation et coup de base de la faux gratuits, même à zéro mana ; Fauchage reste à 20 mana. Un troisième scénario vérifie la gratuité, les dégâts uniques et la récupération du coup de base. Le portrait rapproché est préparé dans `docs/art/yarden/miroir/`, sans nouvelle scène ni réplique inventée.

**Vérification : 31 scénarios logiques réussis.** Dans Chromium, vérification en 412 × 915 et 915 × 412 : ouverture, reprise depuis le menu, coup gratuit, Fauchage payant, blocage du cristal en pause, résolution de l’antre, montée au niveau 24 et fin de la scène de rue. Les transitions ont été exercées avec des états de combat contrôlés : cela ne constitue pas une partie complète pour juger l’équilibrage. Les 12 bandes de Yarden, 4 monstres et 9 bandes de PNJ se chargent, sans exception JavaScript ni ressource du jeu manquante.

Points à traiter ensuite : convertir et raccorder les courses verticales d’Ishara et les poses immobiles des hommes (leurs sources existent, le jeu emploie encore les poses de remplacement) ; poursuivre le trajet puis l’appartement avant d’introduire le miroir ; valider les répliques provisoires de Tiamat ; mesurer la fluidité et l’équilibrage sur Android. Les PNG/SVG de `assets/` totalisent environ 658 Kio, y compris des anciennes ressources non chargées. Aucune migration Godot engagée.

Les sections suivantes sont l’historique du prototype initial ; leurs valeurs et limites ne décrivent pas toutes la version actuelle.

## État

Les dix étapes sont implémentées. La boucle du donjon est raccordée : entrée, prise gratuite de la faux, deux gardes, boss, porte et écran de fin. La validation finale sur Android reste à faire après relecture et fusion.

La version reste en HTML, JavaScript et Canvas 2D, sans dépendances, sans build et avec des formes provisoires. Une seule salle, deux types d’ennemis et un boss : le périmètre du test est conservé.

## Ce qui est vérifié automatiquement

`node tests/smoke.cjs` couvre sept scénarios : entrée et prise de l’arme ; mana et dégâts sur plusieurs cibles ; esquive et collisions ; charge et dégagement après choc ; boss et annonce de son attaque ; progression jusqu’à la sortie et redémarrage ; défaite et pause à la perte de focus. Les scripts sont évalués dans l’ordre de chargement de la page.

Des simulations complémentaires ont vérifié la poursuite autour des blocs et près des limites de la salle. Aucun résultat de fluidité ou de consommation mémoire sur téléphone n’a été mesuré. Le rendu Canvas des tests est simulé.

## Essai final sur téléphone

1. Après publication, actualiser le jeu : l’objectif initial doit demander de prendre la faux. Vérifier que le joystick et les trois boutons restent visibles en portrait et paysage.
2. Prendre la faux sans dépense de mana, puis bouger et attaquer avec deux pouces. Vérifier les coûts, la régénération et le refus d’un coup sans mana suffisant.
3. Attirer le chargeur contre les blocs, éviter sa ligne orange et vérifier qu’il reprend la poursuite après un choc. Les murs doivent arrêter Yarden même pendant l’esquive.
4. Vaincre les gardes. Le Gardien doit apparaître loin de Yarden, annoncer son attaque par un cercle, puis accélérer son annonce à mi-vie. Vérifier qu’une esquive bien placée protège du coup.
5. Vaincre le Gardien. La porte verte au nord doit s’ouvrir ; la traverser doit afficher la fin, le temps de jeu et les PV restants.
6. Recommencer après une victoire puis après une défaite : faux à reprendre, gardes vivants, boss en attente, porte scellée, 5 PV et 30 mana.
7. Changer d’onglet ou quitter le jeu quelques secondes pendant un combat : au retour, pas de déplacement bloqué ni de dégâts subis pendant l’absence.

## Limites et décision

Les noms et valeurs du Gardien et de Fauchage sont provisoires ; l’équilibrage et le confort tactile nécessitent les essais de Jordan. Les statistiques FOR/DEX/AGI/VIT restent du contexte de conception, sans système de progression ajouté. Pas de sauvegarde : actualiser recommence la partie.

La structure technique du petit donjon fonctionne dans les simulations. La faisabilité sur l’appareil cible ne peut être conclue qu’après un parcours complet et un retour sur la fluidité et les contrôles. Le bilan final reste donc à compléter avec cet essai, avant toute extension du jeu.

## Conclusion du test (retour de Jordan)

Le donjon a été joué en entier deux fois sur Android. Deux blocages ont été trouvés puis corrigés : le joystick relâché à l'apparition du Gardien et à sa défaite, et la pause de 1,2 s pendant laquelle Yarden était figée. La sortie et la fin fonctionnent. Verdict : jouable, avec une interface et un décor à améliorer. Le test de changement d'onglet n'a pas été fait sur téléphone, la fluidité n'a pas été mesurée, et l'équilibrage reste à juger. La suite est décrite en section 9 de `PROJECT.md`.

## Phase 2 — étapes 11 et 12

Interface : barres de vie/mana, objectif court, boutons avec coûts et récupérations, barre fixe et repère hors champ pour le Gardien. Décor : dalles et maçonnerie en deux SVG CC0 originaux (1 276 octets), piliers et portes dessinés, voile sombre sous les personnages et les annonces. Aucun sprite ni changement des collisions.

Dix scénarios logiques passent, y compris le chargement des textures, leur échec avec affichage de secours, les barres et le repère du boss, ainsi que le maintien du joystick pendant les transitions. Le rendu est simulé : le navigateur local ne démarre pas dans le sandbox. Aucune mesure de fluidité Android ni validation visuelle n’est donc revendiquée.

Après fusion, actualiser puis vérifier sur téléphone : barres lisibles en portrait et paysage ; boutons atteignables avec deux pouces ; Gardien identifiable dès son apparition sans relâcher le joystick ; salle en pierre et portes reconnaissables ; annonces orange et esquive verte lisibles dans la pénombre ; parcours complet toujours possible. La mesure de fluidité reste à l’étape 17. Les sprites de Yarden et des ennemis restent réservés aux étapes 13 et 14.
