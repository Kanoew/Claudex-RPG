# Araignée de cristal — actions et raccordement

La bande du jeu est `assets/monsters/spider.png`, neuf cases de **224 × 168 px**, ancrées au sol en **(112, 158)**. Le contrôleur la dessine au même grossissement que les autres monstres ; le dessin est orienté vers la gauche et retourné vers la droite.

| Cases (indices à partir de zéro) | Action |
|---|---|
| 0–3 | Déplacement |
| 4 | Préparation du tir de venin |
| 5 | Émission du venin ; le projectile est dessiné séparément par le jeu |
| 6 | Réaction aux dégâts |
| 7 | Aveuglement |
| 8 | Incapacitation vivante |

Le découpage isole chaque silhouette, conserve les pieds au même repère et ajoute des marges transparentes. Les grandes planches de travail ne sont pas chargées par le jeu. Vérifier sur Android les huit pattes et huit yeux, la stabilité des volumes, la lisibilité de la préparation et du tir, et le passage à la pose immobilisée.

Les durées de déplacement sont dans `monster-sprite.js`. Préparation et émission suivent l’attaque du jeu. La réaction est prioritaire pendant le flash ; l’aveuglement et l’incapacitation utilisent leur pose propre. Si la bande échoue à charger, la forme simple et les annonces du jeu restent disponibles.

La mécanique de l’antre est décrite dans la section 10 de `PROJECT.md`. La neutralisation par cristal et Fauchage est une simplification jouable, à ajuster avec le scénario détaillé.
