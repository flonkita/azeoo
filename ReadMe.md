# Flutter DSK by Azeoo

Ce dépôt contient la réalisation du test technique pour l'alternance Flutter chez Azeoo.
Le projet est divisé en deux parties principales : un module Flutter (SDK) et une application hôte React Native.

## 📋 Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé et configuré les outils suivants sur votre machine.

### Environnement Général
* **Git** : Pour cloner le projet.
* **Node.js** (Version LTS recommandée, v18+) : Nécessaire pour React Native.
* **JDK (Java Development Kit)** : Version 11 ou 17 (Requis pour la compilation Android).

### Flutter (Module SDK)
* **Flutter SDK** : Version stable récente (3.x).
* Vérifiez votre installation avec la commande :
    ```bash
    flutter doctor
    ```
    *Assurez-vous qu'il n'y a aucune erreur critique concernant Android toolchain.*

### React Native (Application Hôte)
* **React Native CLI** :
    ```bash
    npm install -g react-native-cli
    ```
* **Yarn** (Optionnel mais recommandé) : `npm install -g yarn`

### Configuration Mobile (Android)
* **Android Studio** : Installé avec le SDK Android standard.
* **Variables d'environnement** :
    * `ANDROID_HOME` doit pointer vers votre dossier SDK.
    * `JAVA_HOME` doit pointer vers votre dossier JDK.
* **Émulateur** : Un appareil virtuel (AVD) configuré via le *Device Manager* d'Android Studio, ou un appareil physique avec le *Débogage USB* activé.

---

## Structure du Projet
- `flutter_profile_sdk/` : Contient le SDK Flutter qui gère la récupération et l'affichage des profils utilisateurs.
- `react_native_app/` : Contient l'application React Native qui intègre le SDK Flutter.

## Fonctionnalités du SDK Flutter
L'objectif était de créer un module capable de récupérer et d'afficher un profil utilisateur via l'API Azeoo.

### 🛠 Choix Techniques

* **Architecture :** Feature-based (inspiré de Clean Architecture).
    * Séparation claire entre la *Data* (Repository), le *Domain* (Models) et la *Presentation* (Widgets).
    * Cela rend le code testable et maintenable.
* **Dio :** Utilisé pour les requêtes HTTP.
    * Choisi pour sa gestion robuste des Headers (nécessaires pour l'authentification Azeoo) et des intercepteurs si besoin.
* **CachedNetworkImage :**
    * Utilisé pour l'avatar utilisateur afin d'améliorer les performances et l'expérience utilisateur (cache local).

### ⚙️ Installation et Test (Module seul)

Pour tester le module Flutter indépendamment de React Native :

1.  Se placer dans le dossier :
    ```bash
    cd flutter_profile_sdk
    ```
2.  Installer les dépendances :
    ```bash
    flutter pub get
    ```
3.  Lancer sur un émulateur ou device :
    ```bash
    flutter run
    ```
    *Note : L'ID utilisateur est temporairement fixé à "1" dans le `main.dart` pour les besoins du test autonome.*

## 🐛 Problèmes rencontrés et Solutions

### 1. Erreur de stockage sur l'émulateur Android
**Problème :** Lors du lancement du module Flutter (`flutter run`), échec de l'installation avec l'erreur :
`[INSTALL_FAILED_INSUFFICIENT_STORAGE: Failed to override installation location]`

**Cause :** L'espace disque alloué par défaut à l'émulateur Android était saturé par les installations précédentes ou les fichiers temporaires.

**Solution :**
* Arrêt de l'émulateur.
* Utilisation de la fonction **"Wipe Data"** dans le *Device Manager* d'Android Studio pour réinitialiser l'émulateur à son état d'usine.
* Relance de l'installation.
    ---

## 📱 Partie 2 : L'Application Hôte React Native (`react_native_app`)

Cette application sert de conteneur ("Host") pour le test. Elle gère la navigation principale et la persistance des données avant d'invoquer le module Flutter.

### 🛠 Choix Techniques

* **React Navigation v6 :**
    * Utilisation de `BottomTabNavigator` pour répondre à la contrainte des deux onglets (Entrée ID / Affichage Profil).
    * Standard de facto pour la navigation en React Native.
* **AsyncStorage :**
    * Utilisé pour persister l'`userId` localement.
    * Permet de conserver l'ID même si l'application est redémarrée (bonus UX) et de le partager entre les écrans.
* **TypeScript :**
    * Le projet est initialisé en TypeScript pour garantir le typage et éviter les erreurs courantes lors de l'interfaçage avec les modules natifs.

### ⚙️ Installation et Lancement

1.  Se placer dans le dossier de l'application :
    ```bash
    cd react_native_app
    ```
2.  Installer les dépendances JavaScript :
    ```bash
    npm install ou npi i
    ```
3.  Lancer le serveur de développement (Metro Bundler) :
    ```bash
    npm start
    ```
4.  Lancer sur Android (dans un autre terminal) :
    ```bash
    npm run android
    ```

---
*(À suivre : Intégration Native & Communication React Native <-> Flutter)*
