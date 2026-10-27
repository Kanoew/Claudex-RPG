# Bilan du prototype — Chapitre 1

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

