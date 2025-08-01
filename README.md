# FunGames - Une Arcade de Mini-Jeux Web

FunGames est une application web légère et dynamique conçue pour offrir une expérience de jeu instantanée et amusante. Elle propose une collection de mini-jeux addictifs, une interface colorée et une expérience utilisateur fluide, le tout directement dans votre navigateur.

## 🎨 UI/UX : Une Approche Ludique

L'application est construite autour d'une philosophie de "Playful UI" (interface utilisateur ludique) pour maximiser l'engagement et le plaisir.

- **Design Moderne et Coloré :** Utilisation d'une palette de couleurs vives, de dégradés et de polices modernes pour créer une atmosphère joyeuse.
- **Micro-interactions :** Des animations subtiles sur les boutons, les cartes et les transitions de page rendent la navigation plus agréable.
- **Feedback Visuel :** Des icônes (FontAwesome), des spinners de chargement et des effets de célébration (Canvas Confetti) sont utilisés pour fournir un retour clair et satisfaisant à l'utilisateur.
- **Responsive Design :** L'interface est conçue en "mobile-first" et s'adapte parfaitement aux smartphones, tablettes et ordinateurs de bureau grâce à Bootstrap 5.

## 🕹️ Fonctionnalités

- **Accueil Dynamique :** Une page d'accueil accueillante avec une blague de développeur aléatoire et les statistiques du site.
- **Système de Pseudo :** Les utilisateurs peuvent définir un pseudo, qui est conservé en session pour une expérience personnalisée.
- **Salle d'Arcade :** Une page centrale pour sélectionner l'un des cinq mini-jeux disponibles.
- **Chargement de Jeu Dynamique :** Les jeux sont chargés de manière asynchrone sans recharger la page pour une expérience fluide.
- **Contrôles Audio :** Un bouton permet d'activer ou de désactiver les effets sonores globaux.
- **Dashboard :** Un tableau de bord affichant les statistiques de visite et les records personnels du joueur.

### Les Mini-Jeux

1.  **Clicker Fou :** Un test de vitesse où le joueur doit cliquer sur un bouton le plus de fois possible en 10 secondes.
2.  **Jeu de Réflexe :** Le joueur doit cliquer sur une zone dès qu'elle change de couleur. Le temps de réaction est mesuré.
3.  **Vitesse Cérébrale (Simon) :** Un jeu de mémoire classique où le joueur doit mémoriser et reproduire une séquence de couleurs de plus en plus longue.
4.  **Mini Puzzle :** Un jeu de correspondance où le joueur doit trouver toutes les paires d'icônes identiques.
5.  **Dactylo Rapide :** Un jeu de vitesse de frappe où le joueur doit taper correctement le plus de mots possible en 30 secondes.

## 🛠️ Stack Technologique Actuelle

- **Backend :** **Flask (Python)**
- **Frontend :** HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS :** **Bootstrap 5**
- **Librairies JavaScript :**
    - **FontAwesome** (pour les icônes)
    - **Canvas Confetti** (pour les animations de victoire)
- **Stockage des Scores :** **`localStorage`** du navigateur pour une persistance côté client.

## 🚀 Installation et Lancement

1.  **Clonez le dépôt :**
    ```bash
    git clone <url-du-repo>
    cd flask-exemple
    ```

2.  **Créez un environnement virtuel et activez-le :**
    ```bash
    # Pour Windows
    python -m venv .venv
    .venv\Scripts\activate

    # Pour macOS/Linux
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Installez les dépendances :**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Lancez l'application Flask :**
    ```bash
    python app.py
    ```

L'application sera accessible à l'adresse `http://127.0.0.1:5000`.

---

## 🔮 Feuille de Route : Future Refactorisation

Pour moderniser l'architecture, améliorer la maintenabilité et les performances, une refactorisation est prévue avec la stack suivante.

### **Backend : FastAPI**

- **Pourquoi ?** FastAPI offre des performances nettement supérieures à Flask, une validation des données intégrée grâce à Pydantic, et une génération automatique de la documentation API (Swagger UI), ce qui est idéal pour une architecture découplée.
- **Plan de migration :**
    1.  Remplacer `app.py` (Flask) par `main.py` (FastAPI).
    2.  Supprimer complètement le rendu des templates (`render_template`). FastAPI ne servira que des données JSON.
    3.  Créer des routes API claires (ex: `/api/v1/config`, `/api/v1/jokes`) pour fournir le contenu nécessaire au frontend.
    4.  La gestion des statistiques (nombre de visites) restera en mémoire ou pourra être déplacée vers une solution plus robuste si nécessaire.

### **Frontend : React (avec Vite)**

- **Pourquoi ?** React est la librairie de référence pour construire des interfaces utilisateur interactives et complexes. Son approche basée sur les composants facilitera grandement la gestion des différents jeux et de l'état de l'application. **Vite** sera utilisé comme outil de build pour sa rapidité exceptionnelle en développement.
- **Plan de migration :**
    1.  Initialiser un nouveau projet React avec Vite dans un sous-dossier `frontend/`.
    2.  Recréer les composants de l'UI (Layout, Navbar, Card, etc.) en tant que composants React.
    3.  Chaque jeu deviendra un composant React à part entière, avec sa propre logique d'état (`useState`, `useEffect`).
    4.  Utiliser `fetch` ou `axios` pour communiquer avec le backend FastAPI.
    5.  Le routage sera géré côté client avec `react-router-dom`.

### **Gestion de l'État : `localStorage`**

- **Pourquoi ?** `localStorage` reste une solution simple et efficace pour la persistance des meilleurs scores côté client, ce qui correspond bien à l'esprit "léger" du projet. Aucune base de données n'est requise.
- **Plan d'intégration :**
    1.  Créer un "hook" React personnalisé (ex: `useLocalStorage`) pour lire et écrire les scores de manière réutilisable.
    2.  Les composants de jeu utiliseront ce hook pour mettre à jour les records, et les composants d'affichage (Dashboard, cartes de jeu) l'utiliseront pour afficher les scores actuels.
