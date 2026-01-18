# Visualisation des Boulangeries d'Île-de-France

Ce projet de data visualisation a été conçu par cinq étudiants en BUT MMI (Métiers du Multimédia et de l'Internet) dans le cadre d'une Situation d'Apprentissage et d'Évaluation (SAE).

L'application a pour but de valoriser le savoir-faire artisanal régional en transformant un jeu de données géographiques brutes en une interface d'exploration interactive. Elle permet d'analyser la répartition et la qualité des boulangeries sur huit départements franciliens.

## Expérience utilisateur et interactions

L'interface a été pensée pour offrir une lecture claire des données à travers plusieurs points d'entrée :

* **Exploration géographique :** Une carte dynamique permet de naviguer à travers plus de 90 points d'intérêt. Afin de garantir la lisibilité, un système de regroupement (clustering) rassemble automatiquement les marqueurs selon le niveau de zoom.
* **Recherche ciblée :** Un moteur de recherche avec autocomplétion permet à l'utilisateur de localiser instantanément les commerces d'une ville spécifique.
* **Analyse statistique :** Au-delà de la simple localisation, l'application propose une visualisation de la qualité des établissements via un graphique de distribution et des indicateurs chiffrés (compteurs dynamiques).
* **Système de notation visuel :** Chaque établissement dispose d'une fiche détaillée incluant un code couleur associé à son score de qualité, allant de "Moyenne" à "Excellente".

## Technologies et outils mobilisés

Le projet repose sur une architecture web standard, sans framework lourd, privilégiant la performance et la maîtrise du code natif.

* **Structure et Style :** HTML5 sémantique et CSS3. La mise en page exploite Flexbox et Grid pour assurer une compatibilité totale sur mobile, tablette et bureau (approche Responsive Design).
* **Logique applicative :** JavaScript (ES6+).
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
