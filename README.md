# Visualisation des Boulangeries proposant la "Baguette des Franciliens"

Ce projet de visualisation de données a été réalisé par cinq étudiants en deuxième année de BUT MMI (Métiers du Multimédia et de l'Internet) à CY Cergy Paris Université, dans le cadre d'une Situation d'Apprentissage et d'Évaluation (SAE).

L'objectif de cette application est de valoriser le savoir-faire artisanal local en transformant un jeu de données géographiques brutes en une interface interactive. Elle permet de localiser les boulangeries proposant la "Baguette des Franciliens" (farine issue de blés locaux) et d'analyser leur répartition sur le territoire.

## Fonctionnalités principales

L'application propose plusieurs outils pour explorer les données :

* **Cartographie interactive :** Une carte dynamique permet de naviguer à travers les huit départements d'Île-de-France. Afin d'assurer la lisibilité des nombreux points d'intérêt, un système de regroupement (clustering) rassemble automatiquement les marqueurs selon le niveau de zoom.
* **Système de recherche :** Un moteur de recherche interne avec autocomplétion permet à l'utilisateur de localiser rapidement les commerces d'une ville spécifique et de centrer la carte sur les résultats.
* **Tableau de bord statistique :** L'interface affiche des indicateurs clés (nombre total d'établissements, couverture géographique) ainsi qu'un graphique analysant la distribution des scores des établissements.
* **Fiches détaillées :** Chaque point sur la carte est interactif et affiche, au clic, les informations essentielles de la boulangerie (nom, adresse, évaluation).

## Outils utilisés

* **Structure et Style :** HTML5 et CSS3. La mise en page exploite Flexbox et Grid pour assurer une compatibilité totale sur mobile, tablette et bureau (Responsive Design).
* **Langage de programmation :** JavaScript.
* **Bibliothèques tierces :**
    * **Leaflet & MarkerCluster :** Gestion du fond de carte et agrégation des points.
    * **Chart.js :** Génération des graphiques statistiques interactifs.

## Équipe de réalisation

Projet réalisé par les étudiants du BUT MMI 2 (Promotion 2024-2027) de CY Cergy Paris Université :

* Bouchra CHELALI
* Ilan BAZONNET
* Aliya CAMARA
* Adam ALALOUCHE
* Oscar ASSOGBA

---
*Données cartographiques © OpenStreetMap contributors. Interface propulsée par Leaflet, MarkerCluster & Chart.js.*
