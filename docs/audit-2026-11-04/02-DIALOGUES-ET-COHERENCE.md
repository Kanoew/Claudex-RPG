# Rapport des textes et des raccords

Lecture du 4 novembre 2026 — dépôt `6ab6572`. Aucun texte du jeu n’a été modifié.

## Ce que j’en pense, simplement

Le problème principal est le montage. Certains passages conservent les informations et les réactions d’une ancienne version du roman. Ensuite vient une habitude d’écriture : montrer quelque chose, expliquer son sens, puis ajouter une jolie phrase qui réexplique ce sens.

Je commencerais par les raccords, puis je couperais quelques commentaires. Je garderais les répliques courtes et les gestes qui font avancer les relations. Je ne rendrais pas tout le texte plat : les dettes, les noms, les traces, les sorties et les silences sont des motifs de ton histoire.

« AI slop » désigne ici un **effet de lecture** : phrase passe-partout, explication trop insistante, belle formule sans prise sur la scène. Cela ne permet pas de savoir qui a écrit une phrase. Plusieurs passages ont été révisés par toi ; mes suggestions restent des options de lecture, pas des corrections obligatoires.

## Les six priorités

1. Raccorder le prénom déjà connu d’Ishara au nom complet choisi chez Félix (C01–C03).
2. Garder une seule confrontation sur l’araignée, au bon endroit (C04).
3. Retirer les masculins restés dans la narration actuelle et vérifier les accords de Tiamat sans effacer l’ancienne identité (C05–C10).
4. Restaurer les répliques auxquelles le chapitre 6 fait référence mais que le chapitre 5 ne montre pas (C18–C21, C25).
5. Enlever les notes de travail et les comptes inexacts : « chapitre 3 », « plusieurs loots », sept prises au lieu de six (C11, C16, C17, S14).
6. Alléger les explications du préau et de l’appartement d’Izzy en conservant les indices et les révélations (S36–S49).

## Ce que je garderais

- « Elle dit non. Bonne soirée. » : Yarden agit, pose une limite et n’en rajoute pas.
- « Le type qui coupe. » : une réponse sèche qui déclenche une inquiétude concrète chez Rémi.
- Le prix de Félix et « Un nom qu’on n’a pas fini de payer… » : l’image du lien appartient à son pouvoir et prépare la suite.
- « Reste derrière moi. Je gère. » et « Mes draps vont à la machine. » : Céleste existe par ce qu’elle fait et ce qu’elle exige.
- « Regarde-la. Elle ne ment pas. » puis le faux souvenir : c’est une anomalie précise, pas un mystère vague.
- « Le tableau dit ce qu’on lui a demandé de dire. » : l’ascenseur fournit immédiatement le contexte de la réplique.
- L’invitation d’Izzy, la boîte posée et « Ce n’est pas ce que je te demande. » : l’émotion peut rester dans l’échange, sans commentaire supplémentaire.

Les yeux violets, l’âge du dossier, les trois dons du prénom, les crédits et « monsieur Weiss » / « mademoiselle Weiss » sont des choix documentés. Je ne les traite pas comme des erreurs. « Je suis un— » peut aussi être un indice volontaire de l’ancienne identité : pas de correction automatique.

## 1. Raccords à relire avant de polir le style

Les propositions ci-dessous donnent une direction concrète. Quand une information du roman manque, je le dis : je ne complète pas le lore.


### C01 — Raccord certain

Source : [chapitre3.js:69](../../chapitre3.js#L69).

> Bon. Yarden. Faut que je m’habitue. Mais celui-là, je peux le dire à voix haute sans te griller, donc va pour Yarden.

**Pourquoi ça accroche :** Ishara connaît déjà ce prénom depuis la ruelle (scene.js:116). Cette réaction appartient à une version où elle connaissait un autre nom.

**Proposition :** « Yarden Weiss, alors. Faudra que je m’habitue au nom complet. » Garder le fait que le prénom a été donné à Ishara avant les papiers.

### C02 — Raccord certain

Source : [chapitre3.js:56](../../chapitre3.js#L56).

> Première fois que quelqu’un dit le nom à voix haute.

**Pourquoi ça accroche :** Plusieurs personnages ont déjà dit Yarden. Le nouveau fait est le nom complet, pas le prénom.

**Proposition :** « Première fois que quelqu’un prononce son nom complet. »

### C03 — Raccord certain

Source : [chapitre6.js:40](../../chapitre6.js#L40).

> à une fille en haut d’un escalier de métro, à une autre pieds nus sur un canapé

**Pourquoi ça accroche :** Dans le jeu, le prénom a été donné à Ishara dans la ruelle. La seconde scène ne place pas explicitement Céleste pieds nus sur un canapé. Le compte des trois dons est voulu (PROJECT.md, §38), les lieux viennent du roman.

**Proposition :** « Elle ne l’a donné que trois fois : à Ishara, à Céleste, puis à Izzy, contre de l’argent. » Garder le compte de trois, sans compter le choix chez Félix comme un don.

### C04 — Raccord certain

Source : [chapitre4.js:129](../../chapitre4.js#L129).

> L’araignée de niveau quarante et un. Hier soir, dans le métro. Tu l’as mentionnée. Je t’en ai jamais parlé.

**Pourquoi ça accroche :** Deux répliques successives font la même confrontation, avec deux localisations. Dans le jeu, Ishara donne ce détail dans la rue de Sous-gare avant de descendre vers le quai (chapitre3.js:65).

**Proposition :** Remplacer les deux versions par une seule : « Hier, en sortant du 4B. L’araignée de cristal, niveau quarante et un. Sept pour cent de mana. Je ne t’en ai jamais parlé. » « En sortant du 4B » évite de déplacer artificiellement la scène dans la cour.

### C05 — Raccord certain

Source : [chapitre6.js:21](../../chapitre6.js#L21).

> Pendant mille ans, il a été la chose devant laquelle les couloirs se vidaient. Il passe son après-midi à confondre ce qu’il cherche avec un labrador.

**Pourquoi ça accroche :** Le passage décrit le présent de Yarden au masculin. La phrase arrive après le troisième trou, qui est une flaque, alors que le labrador appartient au premier.

**Proposition :** « Pendant mille ans, les couloirs se vidaient devant elle. Cet après-midi, elle a suivi un chien, un homme au téléphone et une flaque. » Variante plus sobre : supprimer la seconde phrase, les trois essais viennent déjà d’être joués.

### C06 — Raccord certain

Source : [chapitre6.js:22](../../chapitre6.js#L22).

> Il le voit d’une passerelle

**Pourquoi ça accroche :** Yarden est le sujet, mais le texte brut garde « il ». La passerelle est un détail raconté ; la carte ne demande pas au joueur de monter dessus.

**Proposition :** « Elle repère la terrasse : une table vide au milieu des tables pleines… » Garder la description de l’anneau qui suit.

### C07 — Raccord certain

Source : [chapitre6.js:117](../../chapitre6.js#L117).

> Ils reviennent vers le salon quand Yarden voit

**Pourquoi ça accroche :** Les deux personnages sont Yarden et Izzy.

**Proposition :** « Elles reviennent vers le salon quand Yarden voit… »

### C08 — Raccord certain

Source : [chapitre3.js:60](../../chapitre3.js#L60).

> L’escalier s’allège à mesure qu’ils descendent.

**Pourquoi ça accroche :** Yarden et Ishara descendent ensemble.

**Proposition :** « L’escalier s’allège à mesure qu’elles descendent. »

### C09 — Accord à harmoniser

Source : [chapitre6.js:20](../../chapitre6.js#L20).

> J’avais compris tout seul.

**Pourquoi ça accroche :** Contraire à l’adaptation au féminin annoncée par le projet. Si cette phrase doit laisser volontairement filtrer l’ancienne identité, il faut le décider comme pour « Je suis un— ».

**Proposition :** Par défaut : « J’avais compris. » Cela garde le ton sec sans imposer un accord.

### C10 — Accord à harmoniser

Source : [chapitre4.js:69](../../chapitre4.js#L69).

> Et toi, tu es plus lent qu’hier.

**Pourquoi ça accroche :** Tiamat décrit ici les mouvements actuels de Yarden. L’ouverture dit aussi « trop grand » à propos de son ancienne vie : ce second cas peut être volontaire.

**Proposition :** Pour le combat : « Et toi, plus lente qu’hier. » Ne pas remplacer automatiquement tous les masculins de Tiamat : distinguer ancienne identité et corps présent.

### C11 — Raccord certain

Source : [chapitre2b.js:155](../../chapitre2b.js#L155).

> Les sept créatures ont laissé tomber du loot.

**Pourquoi ça accroche :** runDrops contient six objets et une entrée null : le dernier ennemi ne laisse rien. Le texte compte sept prises ; la scène et le sac en comptent six.

**Proposition :** « Ishara ramasse quatre fragments et deux bourses. Le dernier gobelin n’a rien laissé. » Puis garder « Aucune expérience gagnée. »

### C12 — Ambiguïté à trancher

Source : [chapitre2b.js:186](../../chapitre2b.js#L186).

> Rémi écrit 280 sur l’ardoise.

**Pourquoi ça accroche :** Le paiement total est de 560 et la part de Yarden de 280. L’ardoise affiche 280 sans préciser ce que ce nombre mesure. Le canon récapitulatif conserve aussi ce 280 : on ne peut pas simplement le doubler sans décision.

**Proposition :** Si l’ardoise montre le prix du lot : proposer « 560 » dans le texte ET dans ch2b.slate. Si elle montre une part : écrire « 280 chacune ». Choisir une lecture avant modification.

### C13 — Raccord à clarifier

Source : [chapitre2b.js:172](../../chapitre2b.js#L172).

> Cassé ? Non, il fonctionne.

**Pourquoi ça accroche :** Le narrateur conclut que l’interphone fonctionne. L’objet Porte dit ensuite « L’interphone ne fonctionne qu’à moitié. » Les deux peuvent coexister, mais ressemblent actuellement à deux versions non raccordées.

**Proposition :** Narration : « Ishara appuie deux fois sur l’interphone. » Objet : « L’interphone : il faut appuyer deux fois. »

### C14 — Raccord certain

Source : [chapitre5.js:27](../../chapitre5.js#L27).

> Je le range. C’est pas pareil.

**Pourquoi ça accroche :** Personne ne vient de dire qu’elle abandonne le sujet. « Pas pareil » répond à une réplique absente.

**Proposition :** Ajouter une amorce courte : Tiamat « Tu abandonnes ? » puis la réponse actuelle. Ou rester en narration : « Elle met la corde de côté. Pour l’instant. » La seconde solution évite d’inventer une nouvelle réplique.

### C15 — Raccord certain

Source : [chapitre6.js:128](../../chapitre6.js#L128).

> Elle n’a jamais posé quelque chose, depuis qu’elle a ouvert les yeux dans ce monde.

**Pourquoi ça accroche :** Elle a posé de l’argent chez Félix et vient de poser sa boîte par terre puis l’enveloppe sur la table (repayScene). L’idée forte est de laisser quelque chose derrière elle.

**Proposition :** « Pour la première fois depuis son réveil dans ce monde, elle laisse une affaire à elle quelque part. » Garder la boîte sur la commode et l’échange final avec Tiamat.

### C16 — Raccord et note de travail

Source : [chapitre5.js:41](../../chapitre5.js#L41).

> Elle examine la guilde du quartier, et la refuse : s’affilier ferait du « Personne. » du chapitre 4 un mensonge daté.

**Pourquoi ça accroche :** La narration cite son numéro de chapitre comme une note de travail. « Personne » était une réponse vraie à ce moment-là ; changer ensuite de situation ne la rend pas rétrospectivement fausse sans règle du monde supplémentaire.

**Proposition :** « La guilde du quartier ? Elle passe devant sans entrer. » Si le motif administratif du refus est essentiel, remettre l’explication exacte du roman avant de développer.

### C17 — Raccord et note de travail

Source : [chapitre5.js:63](../../chapitre5.js#L63).

> Yarden a brisé sa propre règle du chapitre 3 sans s’en apercevoir.

**Pourquoi ça accroche :** Autre numéro de chapitre resté dans l’histoire. Le lecteur ne sait pas quelle règle précise elle a brisée.

**Proposition :** Supprimer cette phrase provisoirement. Les paroles de Félix sur la laisse portent déjà l’idée. Si la règle doit revenir, la nommer avec ses mots exacts.

### C18 — Raccord à clarifier

Source : [chapitre6.js:88](../../chapitre6.js#L88).

> Un quatrième silence.

**Pourquoi ça accroche :** Les silences précédents ne sont pas présentés comme une série claire dans cette adaptation condensée. Le nombre suppose les étapes du roman.

**Proposition :** « Encore un silence. Celui-là, elle ne sait pas le lire. » Ne garder « quatrième » que si les trois précédents sont effectivement remis en scène et identifiables.

### C19 — Raccord certain

Source : [chapitre6.js:88](../../chapitre6.js#L88).

> Tiamat avait dit, ce matin : « Elle est une adresse. Va-t’en. »

**Pourquoi ça accroche :** Cette réplique n’apparaît pas dans la rencontre d’Izzy au chapitre 5. La narration demande au joueur de se souvenir d’une phrase jamais montrée. Elle est rappelée une seconde fois à Ouchy.

**Proposition :** Rétablir la réplique au premier « 70 », avant l’offre du studio, si elle appartient bien au texte canon. Sinon supprimer les deux rappels et conserver « Voilà une adresse » à l’arrivée dans l’appartement.

### C20 — Raccord certain

Source : [chapitre6.js:69](../../chapitre6.js#L69).

> Elle sait ce qu’ils veulent tous. Elle te l’a dit elle-même.

**Pourquoi ça accroche :** Le chapitre 5 affirme en narration qu’Izzy lit le désir, mais Izzy ne l’explique jamais elle-même dans les répliques présentes.

**Proposition :** « Elle sait ce qu’ils veulent tous. » suffit. Pour conserver « elle te l’a dit », restaurer d’abord l’échange manquant du roman.

### C21 — Raccord et phrase incomplète

Source : [chapitre6.js:72](../../chapitre6.js#L72).

> Yarden : « T’as pas contacté. »

**Pourquoi ça accroche :** La phrase coupe un complément qui paraît perdu lors de l’injection. Le passage présuppose aussi une promesse précise de contact ; le chapitre 5 montre surtout la menace de pouvoir la retrouver.

**Proposition :** « Tu ne m’as pas contactée. » Puis vérifier dans le roman si « J’avais dit que je te contactais » doit être précédé d’une promesse au chapitre 5.

### C22 — Raccord interface certain

Source : [stats.js:25](../../stats.js#L25).

>  (papiers dans 3 jours)

**Pourquoi ça accroche :** Ce suffixe reste affiché dès que identityName existe, y compris après récupération des papiers et paiement de la dette au chapitre 5. Il raconte alors un état dépassé.

**Proposition :** Avant remise : « papiers en préparation ». Après remise : « papiers reçus ». Le changement nécessite un état de remise fiable, y compris après rechargement ; ne pas se contenter d’un remplacement global du texte.

### C23 — Ambiguïté à trancher

Source : [chapitre6.js:128](../../chapitre6.js#L128).

> un bail à Renens

**Pourquoi ça accroche :** La boîte contient un bail alors que la conversation précédente insiste sur l’absence de bail et d’adresse. Le bail peut être une pièce de couverture fictive : le dossier ne permet pas d’affirmer que c’est une vraie location.

**Proposition :** Vérifier la nature du bail dans le roman. S’il est fictif, préciser sobrement « un bail de couverture à Renens » dans la liste. Ne pas supprimer la difficulté de logement ni transformer ce papier en vrai appartement.

### C24 — Lieu à confirmer

Source : [opening.js:19](../../opening.js#L19).

> Bienvenue à Helvara.

**Pourquoi ça accroche :** Le projet appelle Helvara une ville, puis le jeu situe la suite à Lausanne. Aucun passage lu n’explique leur relation. Cela peut être une terminologie du monde à confirmer plutôt qu’un changement de lieu.

**Proposition :** Faire préciser le rapport Helvara/Lausanne dans le canon, puis choisir les libellés. Ne pas remplacer les noms en masse ni inventer un voyage.

### C25 — Raccord de connaissance à vérifier

Source : [chapitre5.js:44](../../chapitre5.js#L44).

> Niveau 70. Déité Xochiquetzal.

**Pourquoi ça accroche :** La narration révèle immédiatement sa déité et sa lecture du désir. La scène ne montre pas comment Yarden obtient ces informations. « Tiamat arrive une demi-seconde trop tard » ne dit pas non plus ce qu’elle a tenté de dire.

**Proposition :** Restaurer l’avertissement et la découverte tels qu’ils existent dans le roman. Garder « Niveau 70 » comme perception immédiate ; différer le reste jusqu’à sa révélation.

### C26 — Raccord texte et affichage certain

Source : [chapitre3.js:39](../../chapitre3.js#L39).

> Yarden reste consciente, spectatrice de sa propre voix.

**Pourquoi ça accroche :** Tiamat parle ici par la bouche de Yarden devant Félix. Pourtant dialogue.js donne toujours à Tiamat le libellé « VOIX INTÉRIEURE ». Le texte dit une parole audible et la bulle dit l’inverse.

**Proposition :** Prévoir pour cette seule séquence une voix « Tiamat, par Yarden », ou une indication de parole audible équivalente. Conserver la voix intérieure dans les autres scènes. Le raccord touche l’affichage, pas les mots du roman.

### C27 — Raccord texte et affichage certain

Source : [chapitre3.js:49](../../chapitre3.js#L49).

> Ishara lève la main : « Non, c’est bon. Je voulais savoir. Je sais. C’est juste… beaucoup. »

**Pourquoi ça accroche :** Cette vraie réplique est incluse dans une ligne de narration. Le moteur ne reconnaît que les lignes qui commencent par un nom autorisé, suivi de « : ». Même problème avec « Félix tourne la feuille… », « Izzy, très bas… », « Le concierge » et « Le 4B », absents du format reconnu.

**Proposition :** Séparer le geste et la réplique : narration « Ishara lève la main. », puis Ishara « Non, c’est bon… ». Faire le même relevé pour Félix et Izzy ; prévoir les noms du concierge et du 4B si tu veux qu’ils aient une bulle de parole. Ne pas supprimer ces répliques sous prétexte qu’elles sont classées narration.

## 2. Formulations que je raccourcirais ou supprimerais

Ces remarques sont subjectives, sauf lorsqu’un raccord ou une règle canonique est explicitement indiqué. Il n’est pas nécessaire de toutes les appliquer. Les propositions ne sont pas une réécriture approuvée du roman.

### S01 — Style — proposition facultative

Source : [scene.js:104](../../scene.js#L104).

> C’est vous qui comprenez pas à qui vous parlez.

**Pourquoi ça accroche :** Menace de personnage tout-puissant assez générique. Elle annonce une démonstration que le geste du poignet donne déjà.

**Proposition :** Couper la réplique et laisser le geste, puis « Elle dit non. Bonne soirée. » Si tu tiens à un avertissement : « Recule. »

### S02 — Style — proposition facultative

Source : [scene.js:128](../../scene.js#L128).

> Tu es une Éveillée ? N’est-ce pas ?

**Pourquoi ça accroche :** Double question très scolaire dans la bouche d’Ishara, qui parle habituellement de façon directe.

**Proposition :** « T’es une Éveillée, hein ? »

### S03 — Style — proposition facultative

Source : [scene.js:128](../../scene.js#L128).

> Oui. Ceux qui ont reçu une bénédiction, ou qui ont été exposés à l’énergie des Abysses. Ils ont une interface, et ils voient ce que les autres ratent.

**Pourquoi ça accroche :** La définition est correcte dans l’idée, mais elle ressemble à une fiche de règles récitée.

**Proposition :** « Oui. Une bénédiction, ou l’énergie des Abysses. Après ça, t’as l’interface. Et tu vois les failles. » Garder l’explication des niveaux juste avant ; ne pas répéter tout le système.

### S04 — Style — proposition facultative

Source : [scene.js:129](../../scene.js#L129).

> J’en ai traversé une.

**Pourquoi ça accroche :** La première personne est une pensée de Yarden, mais le moteur l’affiche comme une narration sans nom. Le point de vue saute sans signal.

**Proposition :** « Yarden en a traversé une. » Ou conserver la pensée en la distinguant visuellement, si tu choisis ce traitement pour toutes les pensées.

### S05 — Style — proposition facultative

Source : [apartment.js:25](../../apartment.js#L25).

> Le robinet. Simple, efficace.

**Pourquoi ça accroche :** Formule générique de description de produit. Elle ne révèle ni l’appartement ni le regard de Yarden.

**Proposition :** « Le robinet met trente secondes à chauffer. » Ou supprimer le texte d’examen une fois la scène du miroir passée.

### S06 — Style — proposition facultative

Source : [apartment.js:20](../../apartment.js#L20).

> Elle voit la cour intérieure.

**Pourquoi ça accroche :** Le texte décrit seulement l’action de voir, sans donner quelque chose à lire.

**Proposition :** « La fenêtre donne sur la cour intérieure. » Même information, plus directe, sans nouveau décor.

### S07 — Style — proposition facultative

Source : [apartment.js:107](../../apartment.js#L107).

> Le lit est trop mou. Yarden ne semble pas habituée à ce genre de confort. Elle dort par terre, avec l’oreiller.

**Pourquoi ça accroche :** La phrase du milieu explique ce que le choix de dormir au sol raconte déjà.

**Proposition :** « Le lit est trop mou. Yarden prend l’oreiller et s’allonge sur le parquet. »

### S08 — Style — proposition facultative

Source : [apartment.js:111](../../apartment.js#L111).

> Tes tatouages portent la faux. C’est à toi.

**Pourquoi ça accroche :** « C’est à toi » peut viser la faux, les tatouages ou le pouvoir. La phrase donne une émotion vague au lieu d’une information précise.

**Proposition :** « La faux passe par tes tatouages. » Garder la lueur et le déblocage du pouvoir ; ne pas réintroduire le coût zéro retiré par décision antérieure.

### S09 — Style — proposition facultative

Source : [mirror.js:67](../../mirror.js#L67).

> comme de la cendre qui aurait décidé d’être belle

**Pourquoi ça accroche :** L’image attribue une intention à la cendre et cherche une jolie formule pendant une scène d’observation froide. Elle peut être un choix de ton assumé.

**Proposition :** « Les cheveux noirs sont traversés de mèches gris-lavande. » Variante plus proche : « Des mèches gris-lavande, couleur de cendre. »

### S10 — Style — proposition facultative

Source : [mirror.js:68](../../mirror.js#L68).

> Tu as l’air de quelqu’un qu’on remarque et qu’on ne questionne pas. Les humains rangent ce qu’ils voient. Ils te classeront dans "style assumé" et s’arrêteront là.

**Pourquoi ça accroche :** Plusieurs phrases expliquent la même stratégie de camouflage avant une bonne chute. Le côté démonstratif ralentit Tiamat.

**Proposition :** « Les humains verront une gothique. Ils s’arrêteront là. Personne ne cherche un boss de donjon sous du liner. » Proposition facultative : ce texte fait partie d’une version déjà révisée par toi.

### S11 — Style — proposition facultative

Source : [mirror.js:69](../../mirror.js#L69).

> Le visage est froid, difficile à lire, avec quelque chose d’affûté dans le regard qui n’appartient à aucune étudiante de vingt ans.

**Pourquoi ça accroche :** « Quelque chose » et l’étudiante abstraite ajoutent un halo de mystère là où le portrait est visible. La phrase suivante, « Un visage qu’elle respecterait », porte mieux le point de vue.

**Proposition :** Couper cette phrase et garder « Un visage qu’elle respecterait, en face. » Ne pas changer les âges : leur écart est voulu dans PROJECT.md.

### S12 — Style — proposition facultative

Source : [chapitre2b.js:141](../../chapitre2b.js#L141).

> Niveau estimé 16-17, il s’agit d’un espace restreint.

**Pourquoi ça accroche :** La seconde moitié sonne comme un compte rendu administratif, même pour Yarden. Sa compétence peut passer en moins de mots.

**Proposition :** « Seize, dix-sept. Petit espace. » Si la formulation technique est voulue et validée par toi, la garder : ce n’est pas une erreur de canon.

### S13 — Style — proposition facultative

Source : [chapitre2b.js:145](../../chapitre2b.js#L145).

> 24 Bordel ?! Je suis niveau 11, derrière toi !

**Pourquoi ça accroche :** La réaction mêle chiffre, surprise et consigne dans une phrase heurtée. « Derrière toi » paraît rattaché au niveau.

**Proposition :** « Vingt-quatre ? Bordel. Moi, je suis onze. Je reste derrière toi. »

### S14 — Style — proposition facultative

Source : [chapitre2b.js:155](../../chapitre2b.js#L155).

> Plusieurs loots, niveau 19 max, propre.

**Pourquoi ça accroche :** C’est une note de production restée dans la narration, avec un mélange de jargon et de fragments.

**Proposition :** Supprimer après la nouvelle phrase de C11. Si nécessaire : « Le plus gros fragment est de niveau dix-neuf. La coupe est nette. » Le comptoir reviendra déjà sur cette coupe.

### S15 — Style — proposition facultative

Source : [chapitre2b.js:186](../../chapitre2b.js#L186).

> La coupe du niveau 19 est propre. Bonne coupe, pas de brûlure, ni impact contondant. Un supplément pour une coupe à ce niveau.

**Pourquoi ça accroche :** La coupe et le niveau sont répétés trois fois. L’expertise de Rémi se perd dans la répétition.

**Proposition :** « Le dix-neuf est net. Ni brûlure ni écrasement. Ça vaut un supplément. » Garder la question sur la lame, qui prépare la trace.

### S16 — Style — proposition facultative

Source : [chapitre3.js:31](../../chapitre3.js#L31).

> La plupart des gens viennent ici avec un but, et repartent souvent sans rien. Vous avez l’air d’être venue avec un but précis. C’est plus poli que la moyenne.

**Pourquoi ça accroche :** « Un but » revient sans différence nette. La chute polie ne découle pas clairement de ce qu’elle vient de faire.

**Proposition :** « Vous savez ce que vous venez chercher. C’est déjà ça. » Proposition à comparer au roman : la scène est signalée comme reprise d’extraits fournis.

### S17 — Style — proposition facultative

Source : [chapitre3.js:34](../../chapitre3.js#L34).

> Je ne suis pas la plupart des gens.

**Pourquoi ça accroche :** Réplique de personnage exceptionnel très familière, suivie d’une confirmation qui la souligne.

**Proposition :** Supprimer « Je ne suis pas la plupart des gens » et « Non. Manifestement. » Le refus de toucher la plume établit déjà sa différence. Garder sa question sur le prix.

### S18 — Style — proposition facultative

Source : [chapitre3.js:47](../../chapitre3.js#L47).

> Ce n’est pas vous. Enfin, c’est vous, mais ce n’est pas que vous.

**Pourquoi ça accroche :** L’hésitation peut être humaine, mais Félix paraît soudain expliquer en se corrigeant sans préciser le lien.

**Proposition :** « Cet instinct vous appartient. Mais quelqu’un s’en sert pour vous orienter. » À valider contre le fonctionnement exact de la corde ; ne pas lui donner le pouvoir de commander Ishara.

### S19 — Style — proposition facultative

Source : [chapitre3.js:49](../../chapitre3.js#L49).

> Ce qui vous regarde à travers vous… regarde elle.

**Pourquoi ça accroche :** Empilement de pronoms et tournure « regarde elle » qui rendent le sens laborieux.

**Proposition :** « Celui qui voit par vos yeux regarde votre amie. » Ou, sans attribuer de genre à l’entité : « À travers vos yeux, c’est votre amie qu’on observe. »

### S20 — Style — proposition facultative

Source : [chapitre3.js:64](../../chapitre3.js#L64).

> Yarden comprend. Ce n’est pas de la maniaquerie, c’est de la méthode : un être qui tient par l’ordre extérieur, quand le reste a déménagé dans les murs.

**Pourquoi ça accroche :** La scène a déjà montré la cour impeccable et révélé que Félix est l’appartement. La narration livre ensuite l’interprétation entière.

**Proposition :** Garder la description symétrique de la cour et supprimer cette explication. Si un lien reste nécessaire : « Cette fois, l’ordre de la cour lui paraît moins étrange. »

### S21 — Style — proposition facultative

Source : [chapitre3.js:68](../../chapitre3.js#L68).

> Elle t’oriente. Tu marches quand même. Ce n’est pas la même chose d’être poussée vers une porte et de choisir de l’ouvrir.

**Pourquoi ça accroche :** Une explication courte vient déjà de distinguer orienter et décider. L’image de porte ajoute une petite leçon toute faite à Yarden, pourtant peu bavarde.

**Proposition :** Garder seulement « Elle t’oriente. Tu marches quand même. » Le réconfort reste dans ses actes et sa décision de rentrer.

### S22 — Style — proposition facultative

Source : [chapitre4.js:39](../../chapitre4.js#L39).

> Y’a une marque de pâtes, la supérieure. Je la reconnaîtrais les yeux fermés.

**Pourquoi ça accroche :** La marque est désignée sans être nommée, et « la supérieure » ressemble à un mot mal repris du chapitre. Le lecteur ne comprend pas la plaisanterie.

**Proposition :** Si l’idée est qu’Ishara reconnaît la marque : « C’est celles que j’achète. Je les reconnaîtrais les yeux fermés. » Vérifier la vraie plaisanterie dans le chapitre avant de figer la version.

### S23 — Style — proposition facultative

Source : [chapitre4.js:46](../../chapitre4.js#L46).

> Tiamat se tait. C’est son premier désaccord laissé passer, sans insister.

**Pourquoi ça accroche :** La narration explique le silence au moment où elle le montre. La phrase suivante interprète encore l’inquiétude.

**Proposition :** Garder « Tiamat se tait. » Puis passer au départ à l’aube. Si les silences doivent être comptés plus tard, les remettre en scène plutôt que les commenter.

### S24 — Style — proposition facultative

Source : [chapitre4.js:46](../../chapitre4.js#L46).

> Ishara suit. Son buff change les calculs.

**Pourquoi ça accroche :** On est encore dans la scène de nuit. Ishara surgit comme une donnée de combat, sans invitation ni décision de départ.

**Proposition :** Déplacer cette information après « Aube » et ajouter une transition sobre : « À l’aube, Ishara l’accompagne. Yarden compte sur sa présence. » Vérifier dans le roman pourquoi Ishara vient ; ne pas lui inventer une motivation.

### S25 — Style — proposition facultative

Source : [chapitre4.js:88](../../chapitre4.js#L88).

> Vous arrivez quatre minutes trop tard. J’ai fait courir les gens que vous auriez dû protéger. Et tout ce que vous avez à me demander, c’est mon nom ?

**Pourquoi ça accroche :** Discours de confrontation assez convenu et long pour Yarden. Le chef doit toujours obtenir une réaction qui lui apprend quelque chose : la couper sans raccord viderait la scène suivante.

**Proposition :** « Quatre minutes de retard. Et tu veux mon nom ? » Garder ensuite la fermeture du carnet et la compréhension de Yarden. Ou reprendre le refus exact du roman. Cette réplique est déjà marquée non canon dans PROJECT.md.

### S26 — Style — proposition facultative

Source : [chapitre4.js:90](../../chapitre4.js#L90).

> Yarden comprend une seconde trop tard : ils n’ont jamais voulu le nom. Ils voulaient voir ce qu’une Éveillée fait quand on le lui demande.

**Pourquoi ça accroche :** La conclusion psychologique est livrée immédiatement, puis « Premier échange perdu sans un coup » l’explique encore. Le mystère perd de sa force.

**Proposition :** Garder le carnet fermé, le départ et « Personne ne demande ses papiers ». Couper les deux commentaires, ou garder seulement « Premier échange perdu sans un coup » si tu veux une conclusion intérieure.

### S27 — Style — proposition facultative

Source : [chapitre4.js:111](../../chapitre4.js#L111).

> Céleste, niveau 22, la coloc d’Ishara, famille de guilde marchande, rentre d’un événement de guilde de onze heures.

**Pourquoi ça accroche :** Une fiche personnage entière précède son entrée. « De onze heures » désigne-t-il l’heure ou la durée ?

**Proposition :** « Céleste rentre. La colocataire d’Ishara. » Le niveau peut apparaître quand Yarden l’évalue ; la guilde et la tenue peuvent se découvrir dans la scène. Garder 14 h, qui place son retour.

### S28 — Style — proposition facultative

Source : [chapitre4.js:119](../../chapitre4.js#L119).

> …Elle t’aime bien. Genre. Statistiquement. Elle t’a pas mise dehors.

**Pourquoi ça accroche :** La succession « Genre. Statistiquement. » a un effet de chute comique fabriquée. Ishara peut plaisanter, mais le ton devient plus appuyé que nécessaire.

**Proposition :** « Elle t’a pas mise dehors. C’est déjà pas mal. » Facultatif : cette pointe peut aussi être une voix voulue pour Ishara.

### S29 — Style — proposition facultative

Source : [chapitre4.js:132](../../chapitre4.js#L132).

> La corde ne fait pas que regarder. Quelque chose écrit dans sa mémoire.

**Pourquoi ça accroche :** Après la réplique d’Ishara, la narration donne immédiatement une explication causale comme une certitude. Le faux souvenir est fort sans verdict.

**Proposition :** Finir sur « Je me souviens que tu me l’as dit. » Garder l’hypothèse de la mémoire pour une pensée ultérieure si le canon la confirme. Ne pas retirer le détail des sept pour cent, qui rend l’anomalie vérifiable.

### S30 — Style — proposition facultative

Source : [chapitre5.js:33](../../chapitre5.js#L33).

> Pour la première fois, elle n’achète pas de la puissance. Elle achète du temps.

**Pourquoi ça accroche :** Formule symétrique qui souligne une idée déjà donnée par le choix de VIT ; points.js répète encore « Une seule chose à acheter : du temps ». En plus, VIT ne modifie pas les PV dans cette version.

**Proposition :** Narration : « Les six points passent en VIT. Cinq devient onze. » Écran : « Place les six points en VIT. » Si l’image du temps est importante, la garder une seule fois et présenter clairement la limite du prototype.

### S31 — Style — proposition facultative

Source : [chapitre5.js:33](../../chapitre5.js#L33).

> Tiamat le remarque. Elle ne le dit pas.

**Pourquoi ça accroche :** Le narrateur affirme une pensée cachée sans signe observable. Ce procédé revient souvent et explique le silence de Tiamat.

**Proposition :** Supprimer. L’absence de réplique laisse déjà ce silence au lecteur.

### S32 — Style — proposition facultative

Source : [chapitre5.js:48](../../chapitre5.js#L48).

> Elle n’achète pas des réponses. Elle achète le droit de regarder.

**Pourquoi ça accroche :** La scène du contrat énonce déjà qu’elle ne demande pas de réponses. La narration transforme aussitôt le sous-texte en maxime.

**Proposition :** Supprimer après les conditions du contrat. Garder le regard d’Izzy et la gêne de Yarden dans la scène restaurée du roman.

### S33 — Style — proposition facultative

Source : [chapitre6.js:27](../../chapitre6.js#L27).

> Les deux autres ne suivent pas : leur travail n’est pas de la tenir. Leur travail est d’être trois.

**Pourquoi ça accroche :** La formule est frappante, mais explique la fonction menaçante d’un placement qui peut la montrer seul.

**Proposition :** « Les deux autres restent contre le mur. » Garder le chef qui avance seul. Option de resserrement, pas erreur de sens.

### S34 — Style — proposition facultative

Source : [chapitre6.js:30](../../chapitre6.js#L30).

> Il s’arrête à deux mètres, la distance de quelqu’un qui n’a rien à vendre.

**Pourquoi ça accroche :** L’image donne une signification universelle à une distance assez arbitraire. Elle ajoute une maxime à une scène déjà chargée de signes.

**Proposition :** « Il s’arrête à deux mètres. » Le bras tendu et l’enveloppe feront le travail.

### S35 — Raccord et style

Source : [chapitre6.js:31](../../chapitre6.js#L31).

> Tiamat ne dit rien d’autre. Elle veut juste qu’elle sache qu’elle a vu.

**Pourquoi ça accroche :** Aucune parole de Tiamat ne précède dans cette séquence du retour du chef. « Rien d’autre » manque d’amorce ; les trois « elle » brouillent qui sait quoi.

**Proposition :** Supprimer ici. Si une réplique de Tiamat a été perdue au montage, la restaurer d’après le roman avant de garder la réaction.

### S36 — Style — proposition facultative

Source : [chapitre6.js:52](../../chapitre6.js#L52).

> Un retrait a un compte. Un compte a un titulaire.

**Pourquoi ça accroche :** La déduction est ensuite expliquée encore par le tatouage, l’affiliation puis la phrase annonçant l’archive. L’accumulation retire au joueur le plaisir de comprendre.

**Proposition :** « Le retrait porte le nom d’Izzy. » Puis s’arrêter avant « Et une fille de niveau soixante-dix… ». Le roman demande précisément de laisser cette déduction implicite : solution préférable, garder seulement la machine qui écrit et le silence de Yarden.

### S37 — Écart explicite au canon résumé

Source : [chapitre6.js:53](../../chapitre6.js#L53).

> Et une fille de niveau soixante-dix qui vient, sans le savoir, d’entrer dans une archive.

**Pourquoi ça accroche :** La note canon de PROJECT.md §34 précise que l’entrée d’Izzy dans l’archive n’est jamais dite en texte. L’adaptation la révèle au lecteur.

**Proposition :** Supprimer cette phrase et la pensée explicative analogue de repayScene (« Elle pense aussi, brièvement… »). Conserver le retrait exact de 520, l’enveloppe et le dernier carnet : ils permettent de comprendre.

### S38 — Style — proposition facultative

Source : [chapitre6.js:54](../../chapitre6.js#L54).

> Il ne m’a pas payée. Il m’a montré ce qu’il pouvait lire.

**Pourquoi ça accroche :** Yarden résume la démonstration ; Tiamat ajoute une longue explication puis une nouvelle formule sur les deux hommes qui écrivent son nom. Trois conclusions se suivent.

**Proposition :** Garder la phrase de Yarden. Pour Tiamat, garder au maximum « Celui-là n’attaque pas. Il note, il archive… » si tu tiens à ce passage canon. Couper l’explication prolongée « parce qu’après un geste correct… » et éviter d’ajouter une autre conclusion immédiatement.

### S39 — Style — proposition facultative

Source : [chapitre6.js:61](../../chapitre6.js#L61).

> Il faut la trouver avant qu’elle trouve.

**Pourquoi ça accroche :** La symétrie semble recherchée mais le dernier verbe manque de complément : avant qu’Izzy trouve qui ou quoi ?

**Proposition :** « Il faut la retrouver avant qu’Izzy ne la retrouve. » Ou plus sec : « La retrouver avant qu’elle ne vienne. »

### S40 — Style — proposition facultative

Source : [chapitre6.js:63](../../chapitre6.js#L63).

> La méthode, elle l’a depuis mille ans : on ne cherche pas un prédateur, on cherche le comportement des proies.

**Pourquoi ça accroche :** Une bonne idée de recherche se transforme en leçon complète ; la phrase suivante la répète avec le trou, puis « Donc : chercher le trou ».

**Proposition :** « Elle regarde les passants : qui évitent-ils ? » Garder ensuite les trois essais et la différence entre trou et anneau, qui est le vrai déclic.

### S41 — Style — proposition facultative

Source : [chapitre6.js:69](../../chapitre6.js#L69).

> Elle n’a pas de bouton.

**Pourquoi ça accroche :** La métaphore arrive sans référent clair. Parle-t-on d’arrêter son pouvoir, d’un bouton sur son vêtement, ou d’une prise que les hommes auraient sur elle ?

**Proposition :** Si cela désigne la lecture permanente du désir : « Elle ne peut pas arrêter de les entendre. » Vérifier le sens dans le chapitre avant de choisir une formulation sensorielle : « entendre » ne doit pas inventer un autre pouvoir. Variante neutre : « Ça ne s’arrête jamais. »

### S42 — Style — proposition facultative

Source : [chapitre6.js:71](../../chapitre6.js#L71).

> Le menton d’Izzy bouge le premier. Puis les épaules, de deux centimètres. Le volet retombe une seconde entière plus tard. Elle la compte.

**Pourquoi ça accroche :** Plusieurs mesures minuscules et une nouvelle image de volet se succèdent. L’observation tactique de Yarden se change en chronométrage systématique.

**Proposition :** « Izzy relève le menton. Ses épaules se redressent. Son sourire revient avec un temps de retard. » Garder une seule mesure si elle a une fonction précise dans le roman.

### S43 — Style — proposition facultative

Source : [chapitre6.js:80](../../chapitre6.js#L80).

> Ce n’est ni de la colère ni de la déception : quelqu’un qui appuie sur un interrupteur, entend le clic, et ne voit pas la lumière s’allumer.

**Pourquoi ça accroche :** Une comparaison entière interprète la réaction entre des répliques déjà efficaces. Elle reprend la famille d’images du bouton et du volet.

**Proposition :** « Izzy attend une réponse. Son sourire ne bouge plus. » Ou couper le commentaire et enchaîner directement « T’as eu ça où. »

### S44 — Style — proposition facultative

Source : [chapitre6.js:85](../../chapitre6.js#L85).

> Elle le dit trop vite, un demi-ton trop haut, et elle s’entend. Rien ne bouge dans son visage, ce qui est en soi une information.

**Pourquoi ça accroche :** Le narrateur commente qu’un détail est une information au lieu de laisser le lecteur le percevoir.

**Proposition :** « Elle le dit trop vite. Puis elle reprend : “Grand. Très grand.” » Les répliques qui suivent suffisent à montrer qu’elle se rattrape.

### S45 — Style — proposition facultative

Source : [chapitre6.js:112](../../chapitre6.js#L112).

> Deux cages. Dans l’une, on compte les sorties d’une maison qui n’est pas la sienne. Dans l’autre, on habite la sienne sans en avoir jamais cherché une seule.

**Pourquoi ça accroche :** La scène des sorties raconte déjà la différence entre les deux femmes. Le narrateur inscrit ensuite le thème en toutes lettres.

**Proposition :** Supprimer ce bloc et passer de « J’ai jamais regardé » à la visite. Garder les sorties comptées : c’est elles qui portent le sens.

### S46 — Style — proposition facultative

Source : [chapitre6.js:118](../../chapitre6.js#L118).

> Tous les dépôts qu’un être humain laisse dans un endroit où il dort, ceux qui manquent à la chambre de la reine, sont là.

**Pourquoi ça accroche :** Le contraste a déjà été montré par le verre, le livre et le chargeur. Il est encore expliqué par « chambre de princesse / chambre de bonne » deux lignes plus loin.

**Proposition :** Supprimer ce commentaire. Choisir entre la liste concrète et la conclusion sur la chambre de bonne ; ne pas garder trois explications du même contraste.

### S47 — Style — proposition facultative

Source : [chapitre6.js:126](../../chapitre6.js#L126).

> Son estomac fait ce que font les estomacs qu’on oublie une journée entière. Elle le note comme la fissure d’un plafond : une donnée sans instruction attachée.

**Pourquoi ça accroche :** Le tour « fait ce que font » est vague, puis une comparaison et une abstraction expliquent son détachement.

**Proposition :** « Son estomac se contracte. Elle l’ignore. » Ou supprimer : Tiamat dit juste après qu’elle n’a rien mangé depuis hier.

### S48 — Style — proposition facultative

Source : [chapitre6.js:130](../../chapitre6.js#L130).

> une ville continue de faire ce que font les villes

**Pourquoi ça accroche :** Conclusion générique qui pourrait terminer beaucoup d’histoires. Elle ralentit l’arrivée du dernier plan, plus précis, sur le carnet.

**Proposition :** « Dehors, la lumière tombe derrière la crête. L’eau perd sa couleur. » Puis passer au carnet.

### S49 — Style — proposition facultative

Source : [chapitre6.js:130](../../chapitre6.js#L130).

> Elle ne dit pas qu’une fille de niveau soixante-dix a repris cet argent sur la terrasse d’un bar, sans compter, avant de rentrer chez elle avec l’anomalie. Elle n’a pas besoin de le dire.

**Pourquoi ça accroche :** Le sujet « elle » vise ici la ligne du carnet, après plusieurs phrases dont le sujet est Yarden. Le commentaire sur ce que le texte ne dit pas explique la menace au lieu de la laisser ouverte.

**Proposition :** Terminer sur « La seconde porte un numéro de carte, une borne, un montant. » Le raccord avec le retrait et le remboursement reste lisible.

### S50 — Style — proposition facultative

Source : [points.js:16](../../points.js#L16).

> Une seule chose à acheter : du temps.

**Pourquoi ça accroche :** L’écran reprend la métaphore d’une narration déjà proche. Un bouton d’attribution gagne à dire simplement l’action attendue.

**Proposition :** « Place les six points en VIT. » Après placement : « Tout est placé. » Conserver le choix forcé du canon, sans présenter les autres statistiques comme des options disponibles.

## 3. Liens entre les chapitres : ordre de travail proposé

| Passage | Ce que le joueur doit comprendre | Raccord à préserver |
|---|---|---|
| Réveil → Abysse → ruelle | Une ancienne puissance est enfermée dans un corps nouveau. | Garder la mémoire fragmentée ; ne pas inventer sa mort. |
| Ruelle → appartement | Ishara connaît le prénom Yarden et propose un refuge. | Le choix de Weiss ne doit pas effacer cette première présentation. |
| Miroir → douche → nuit | Elle découvre son corps, accepte une aide, retrouve le lien avec la faux. | Ne pas déplacer le miroir au matin sur la foi d’une vieille note. |
| Run → Rémi → Félix | Six objets deviennent 280 crédits, puis un acompte ; reste une dette de 520. | Clarifier l’ardoise ; garder la trace de la coupe et le prix du silence. |
| Félix → pâtes → square | Ishara connaît un détail impossible ; Yarden cherche du niveau pour la dette. | Garder les sept pour cent et situer la phrase dans la rue après le 4B. Ajouter seulement la transition nécessaire vers l’aube. |
| Square → Céleste → dîner | Le combat laisse une trace ; la question du faux souvenir reste ouverte. | Garder la réaction au chef et l’inquiétude d’Ishara ; ne pas résoudre trop vite la corde en narration. |
| Matin → Izzy → papiers | Yarden échange trois jours contre 520, puis paie Félix. | Restaurer les informations sur Izzy dont la suite se souvient ; ne pas transformer sa présence en simple distributeur d’argent. |
| Enveloppe → préau → remboursement | Le montant exact relie la dette, le retrait et la surveillance. | Laisser au joueur les indices ; ne pas annoncer l’archive d’Izzy à sa place. |
| Ouchy → chambre cachée → boîte | Une offre de logement devient un premier endroit où laisser une affaire. | Préserver l’invitation, le contraste des deux chambres et l’échange final ; vérifier le bail de couverture. |

Pour la scène d’Izzy du chapitre 5, une réduction mot à mot ne suffira pas. Le jeu passe presque directement du niveau 70 à l’offre de studio, puis au contrat. Le roman complet n’est pas dans ce dépôt : je peux signaler les liens absents, mais pas garantir une restauration fidèle de cet échange à partir des seules notes.

## 4. Périmètre et limites de la lecture

J’ai lu les textes dans leurs fichiers sources : `opening.js`, `scene.js`, `apartment.js`, `mirror.js`, `chapitre2b.js`, `chapitre3.js`, `chapitre4.js`, `chapitre5.js`, `chapitre6.js`, ainsi que les courts textes de combat, les objets et les libellés d’interface. Les sources donnent les mots, les mouvements et les enchaînements ; `PROJECT.md` donne les règles et les décisions connues.

`docs/TEXTES.md` contient 2 983 lignes, mais son export réinclut les suites des scènes. Le passage d’ouverture de l’appartement d’Izzy y figure huit fois. **Ce n’est pas la preuve que le jeu joue huit fois la scène.** Pour cette lecture, chaque scène source a été considérée une seule fois. Les pensées à la première personne et les répliques intégrées dans une narration demandent également une harmonisation d’affichage ; je les ai distinguées des simples maladresses de formulation.

Les 48 tests logiques existants réussissent. Ils ne jouent pas une lecture littéraire complète des chapitres 3 à 6, et le simulateur ne juge ni les pauses ni les voix. Aucun essai de lecture sur téléphone n’a été réalisé ici. Les romans intégraux ne sont pas présents : une proposition qui touche au canon doit être comparée au chapitre concerné avant application.

Aucune suppression, aucune réécriture dans le jeu, aucun commit, aucun push. Tous les remplacements ci-dessus sont à ta disposition pour lecture.
