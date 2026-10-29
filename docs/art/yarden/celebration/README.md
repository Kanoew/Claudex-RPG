# Yarden — petit saut de joie

[Ouvrir l’aperçu animé](index.html). Une bande de huit cases de **272 × 724 px**, vue de face, sans miroir : repos, impulsion, décollage, montée, sommet avec les yeux fermés souriants, descente, réception et retour au repos. Le poing gauche ganté est levé (droite de l’image) ; les plumes restent à droite anatomique et la marque au flanc gauche. Aucun confetti n’est dessiné : les particules restent gérées par le jeu.

`celebration.png` est une bande sur fond vert opaque. `animations.json` fournit les huit durées `[100, 90, 80, 90, 130, 90, 100, 140]` ms, soit **820 ms**, et un ancrage commun **(136, 631)**. Lecture unique (`loop: false`), puis retour au repos (`next: idle`, indication pour l’intégration future). La répétition de l’aperçu ajoute une pause de 650 ms, absente de la durée de l’action.

`source.png` conserve la planche originale (2171 × 724). La mise en cases utilise une découpe sans miroir ni redimensionnement et ajoute au maximum une colonne de fond par case, pour obtenir une bande de 2176 × 724. Les pixels des poses restent identiques. La hauteur des poses est conservée : ne pas recadrer chacune au plus serré ni ramener les pieds au sol pendant la phase aérienne.

Le fond vert présente de légères variations de couleur ; le détourage et l’export transparent léger restent à réaliser avant raccordement au jeu. La grande bande source ne doit pas être ajoutée au chargement du jeu sur téléphone. Aucun fichier du moteur ni confetti existant n’est modifié par cette livraison. Vérifier le raccord avec le repos et les détails visuels à la taille d’affichage retenue.

Pour examiner sur téléphone : ouvrir l’aperçu après fusion, appuyer sur Pause, puis Image suivante ; le poing doit monter à droite de l’image, les pieds quitter le sol puis revenir à la réception. Le bouton Rejouer recommence la séquence.
