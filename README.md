# Primal Kepler - Immo-Avatar

Application de génération de vidéos immobilières avec jumeaux numériques (HeyGen integration).

## 🚀 Guide de démarrage rapide pour Jules

### 1. Prérequis
- Node.js (version 16+)
- npm ou yarn

### 2. Installation
Clonez le dépôt et installez les dépendances :
```bash
git clone https://github.com/sgregoire300/primal-kepler.git
cd primal-kepler
npm install
```

### 3. Configuration (Crucial)
Le projet utilise Firebase, PayPal et Make.com. Les clés ne sont pas sur GitHub.
- Copiez le fichier `.env.example` et renommez-le en `.env`.
- Demandez à Sylvain les valeurs pour remplir le fichier `.env`.

### 4. Lancement
Pour lancer le serveur de développement local :
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

## 🛠️ Structure du Projet
- `src/contexts/AuthContext.jsx` : Gestion de l'authentification et des crédits utilisateur.
- `src/components/forms/` : Formulaire en 3 étapes pour la création d'annonces.
- `src/pages/Library.jsx` : Bibliothèque des vidéos, avatars et voix.
- `src/components/ui/VoiceRecorder.jsx` : Système d'enregistrement vocal personnalisé.

## 🔗 Intégration Make.com / HeyGen
L'envoi des données se fait dans `src/components/forms/Step3Review.jsx` vers un Webhook Make.com qui pilote ensuite HeyGen.
