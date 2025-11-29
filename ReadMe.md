# Flutter SDK by Azeoo

> **Projet d'Alternance - Intégration Hybride React Native / Flutter**

Ce dépôt contient la réalisation du test technique pour l'alternance Flutter chez Azeoo.
Il démontre l'intégration d'un module Flutter complet (SDK) au sein d'une application hôte React Native existante, avec communication bidirectionnelle via un pont natif Android (Java).

---

## 📹 Démonstration

Une vidéo de démonstration du flux complet (Configuration ID -> Navigation -> Appel Module Natif -> Affichage Flutter) est disponible ci-dessous :

[https://github.com/user-attachments/assets/dfee4cec-3453-42df-9936-e97a96108453-42df-9936-e97a9610840c](https://github.com/user-attachments/assets/dfee4cec-3453-42df-9936-e97a96108453-42df-9936-e97a9610840c)

---

## ✅ Fonctionnalités Implémentées

| Critère | État | Détails |
| :--- | :---: | :--- |
| **SDK Flutter** | ✅ | Récupération API, Modèles de données, Gestion d'état, UI soignée. |
| **React Native** | ✅ | Navigation par Onglets (Tabs), Persistance locale (AsyncStorage). |
| **Intégration** | ✅ | Flutter intégré en tant que module (Add-to-App) dans le projet Android. |
| **Pont Natif** | ✅ | Module Java personnalisé (`FlutterModule`) pour lancer le moteur. |
| **Communication** | ✅ | Passage dynamique de l'`userId` de JS vers Dart via `MethodChannel`. |

---

## 📂 Structure du Projet

```text
/C:/Azeoo/
  ├── flutter_profile_sdk/   # Le module Flutter (Gestion du profil)
  └── react_native_app/      # L'application Hôte React Native (Intégration)
```

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

5.  Lancer sur iOS (dans un autre terminal) :
    ```bash
    npm run ios
    ```

---

## 🌉 Partie 3 : Le Pont Natif (Native Bridge)

Pour permettre à React Native de lancer le moteur Flutter, un module natif personnalisé a été développé en Java (intégré au projet Kotlin par défaut).

### 🛠 Architecture du Module
* **`FlutterModule.java`** : Étend `ReactContextBaseJavaModule`.
    * Expose la méthode `@ReactMethod openProfile(String userId)`.
    * Initialise le moteur Flutter (`FlutterEngine`) et le met en cache pour des performances optimales (Warm-up).
    * Lance l'`Activity` Flutter par-dessus l'application React Native.
* **`FlutterPackage.java`** : Enregistre le module auprès du pont React Native.
* **`MainApplication.kt`** : Ajoute le package à la liste des modules chargés au démarrage.

### 🔄 Flux de Données
1. **React Native (TS)** : L'utilisateur clique sur le bouton "Ouvrir Profil".
2. **Bridge (Java)** : La méthode `openProfile` est appelée avec l'ID utilisateur.
3. **Flutter (Dart)** : L'activité Flutter se lance et récupère le contexte.

---

## ⚔️ Challenges Techniques & Résolutions

Ce projet a nécessité une configuration avancée pour faire cohabiter React Native 0.76 et Flutter sous Windows.

### 1. Conflit de Cycle de Vie Gradle (`afterEvaluate`)
* **Problème :** Erreur `Cannot run Project.afterEvaluate...` lors du build.
* **Cause :** Les optimisations de React Native 0.76 ("Configure on Demand") verrouillaient le projet avant l'initialisation du plugin Flutter.
* **Solution :** Désactivation explicite des caches et du parallélisme dans `gradle.properties` et réorganisation de l'ordre d'évaluation dans `settings.gradle`.

### 2. Incompatibilité de Script Groovy
* **Problème :** Erreur `unable to resolve class Binding` avec le script d'intégration standard.
* **Solution :** Utilisation du nom de classe complet qualifié `groovy.lang.Binding` et inclusion manuelle du dépôt Maven de Flutter.

### 3. Verrouillage de Fichiers Windows (`UncheckedIOException`)
* **Problème :** Erreur `Could not move temporary workspace` due aux verrous posés par l'OS/Antivirus sur les dossiers temporaires `.gradle`.
* **Solution :** Scripts de nettoyage des processus Java ("Zombies") et exclusions Windows Defender.

### 4. Gestion des Plugins Flutter (`Package not found`)
* **Problème :** Le code natif généré ne trouvait pas les modules dépendants (`sqflite`, `path_provider`) car le format JSON des plugins Flutter récents n'était pas lu par défaut.
* **Solution :** Implémentation d'un script `settings.gradle` personnalisé utilisant une Regex robuste pour parser `.flutter-plugins-dependencies` et inclure les modules natifs dynamiquement.

### 5. Erreurs d'Environnement (NDK & Kotlin)
* **Problème :** Conflits de versions NDK et erreurs `Insets` dans `react-native-screens`.
* **Solution :** Forçage de la version `react-native-screens: ^3.35.0` et réinstallation propre du NDK 26.1.10909125.

--- 