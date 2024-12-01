# EventSportify

## Table des matières
1. [Description du projet](#description-du-projet)
2. [Architecture globale](#architecture-globale)
3. [Backend](#backend)
   - [Technologies utilisées](#technologies-utilisées-backend)
   - [Installation](#installation-backend)
   - [Configuration](#configuration-backend)
   - [API Endpoints](#api-endpoints)
4. [Frontend](#frontend)
   - [Technologies utilisées](#technologies-utilisées-frontend)
   - [Installation](#installation-frontend)
   - [Configuration](#configuration-frontend)
   - [Gestion des états](#gestion-des-états)
   - [Routing](#routing)
   - [Composants principaux](#composants-principaux)
5. [Authentification](#authentification)
6. [Tests](#tests)
7. [Déploiement](#déploiement)
8. [Sécurité](#sécurité)
9. [Liens utiles](#Liens-utiles)

## Description du projet

EventSportify est une application web de gestion d'événements sportifs. Elle permet aux organisateurs de :
- Créer, modifier et supprimer des événements sportifs
- Gérer les inscriptions des participants
- Générer des listes d'inscrits
- Contrôler l'accès via un système d'authentification sécurisé

## Architecture globale

L'application est construite avec une architecture moderne basée sur :
- Backend : Node.js avec Express.js
- Frontend : React.js avec Vite
- Base de données : MongoDB
- Authentification : JSON Web Tokens (JWT)

## Backend

### Technologies utilisées Backend
- Node.js
- Express.js
- Mongoose
- bcrypt
- jsonwebtoken

### Installation Backend
1. Cloner le repository
```bash
git clone https://github.com/CHERKAOUIfatimazahra/EventSportify
cd eventSportify/backend_Eventsportify
```

2. Installer les dépendances
```bash
npm install
```

### Configuration Backend
Créer un fichier `.env` avec les variables suivantes :
```
MONGODB_URI=mongodb://localhost:27017/eventsportify
JWT_SECRET=votre_secret_jwt_ultra_securise
PORT=5000
EMAIL_USER=votre_email
EMAIL_PASS=votre_mot_de_passe
```

### API Endpoints

#### Authentification
- `POST /auth/register` : Inscription
- `POST /auth/login` : Connexion

#### Événements
- `GET /events` : Lister tous les événements
- `GET /events/:id` : Récupérer un événement par son ID
- `POST /events` : Créer un événement
- `PUT /events/:id` : Modifier un événement
- `DELETE /events/:id` : Supprimer un événement

#### Participants
- `POST /events/:eventId/register` : S'inscrire à un événement
- `GET /events/:eventId/participants` : Lister les participants
- `GET /participants/:id` : Récupérer un participant par son ID
- `PUT /participants/update/:id` : Mettre à jour un participant

## Frontend

### Technologies utilisées Frontend
- **React.js** : Bibliothèque d'interface utilisateur
- **Vite** : Bundler et outil de développement
- **React Router** : Routing
- **Axios** : Requêtes HTTP
- **React Toastify** : Notifications
- **Tailwind CSS** : Styles
- **jsPDF** : Génération de PDF
- **Lucide React** : Icônes

### Installation Frontend
1. Naviguer dans le dossier frontend
```bash
cd ../frontend_eventsportify
```

2. Installer les dépendances
```bash
npm install
```

### Configuration Frontend
Créer un fichier `.env` :
```
VITE_API_URL=http://localhost:5000/auth
```

## Authentification

Processus d'authentification :
1. L'utilisateur se connecte avec email/mot de passe
2. Le backend vérifie les credentials
3. Génération d'un token JWT
4. Stockage du token côté client

## Tests

### Tests Backend (Jest)
```bash
cd backend
npm test
```

## Déploiement

### Configuration Docker
```yaml
version: '3.8'

services:
  front-react:
    build:
      context: ./frontend_Eventsportify
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./frontend_Eventsportify:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - back-express

  back-express:
    build:
      context: ./backend_Eventsportify
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    volumes:
      - ./backend_Eventsportify:/usr/src/app
      - /usr/src/app/node_modules
    env_file:
      - ./backend_Eventsportify/.env
```

## Sécurité
- Mots de passe hachés avec bcrypt
- Authentification JWT
- Validation des entrées utilisateur
- Protection contre les attaques XSS
- Middlewares de sécurité Express
- CORS configuré

## Liens utiles
- Documentation des API
Pour une documentation détaillée de tous les endpoints de l'API, consultez :
https://documenter.getpostman.com/view/33203681/2sAYBXCrKd

- Gestion de projet
Suivi des tâches et des sprints sur Jira :
https://cherkaouifatimazahra97.atlassian.net/jira/software/projects/EP/boards/1

