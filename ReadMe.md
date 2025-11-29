# Flutter DSK by Azeoo

Ce dépôt contient la réalisation du test technique pour l'alternance Flutter chez Azeoo.
Le projet est divisé en deux parties principales : un module Flutter (SDK) et une application hôte React Native.

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

## 🐛 Problèmes rencontrés et Solutions (Troubleshooting)

### 1. Erreur de stockage sur l'émulateur Android
**Problème :** Erreur `[INSTALL_FAILED_INSUFFICIENT_STORAGE...]`.
**Solution :** Utilisation de la fonction "Wipe Data" dans le *Device Manager* d'Android Studio.

### 2. Erreur Gradle "Could not move temporary workspace" (Windows)
**Problème :** Erreur `java.io.UncheckedIOException...`.
**Solution :** Suppression manuelle du dossier caché `.gradle` et redémarrage pour libérer les fichiers verrouillés.

### 3. Erreur NDK "Missing source.properties"
**Problème :** Erreur `[CXX1101] NDK at ... did not have a source.properties file`.
**Solution :** Réinstallation manuelle de la version spécifique du NDK (26.1.10909125) via Android Studio.

### 4. Conflit de version Kotlin (Insets != EdgeInsets)
**Problème :** Erreur de compilation dans `react-native-screens`.
**Solution :** Forçage de la version `react-native-screens: ^3.35.0` et nettoyage complet (`npm install` propre).

### 5. Problème de réseau Gradle (Hôte inconnu)
**Problème :** Gradle n'arrive pas à télécharger les dépendances (`Hôte inconnu repo.maven.apache.org`).
**Solution :** Flush du DNS Windows via `ipconfig /flushdns`.
**Problème :** Lors du lancement du module Flutter (`flutter run`), échec de l'installation avec l'erreur :
`[INSTALL_FAILED_INSUFFICIENT_STORAGE: Failed to override installation location]`

**Cause :** L'espace disque alloué par défaut à l'émulateur Android était saturé par les installations précédentes ou les fichiers temporaires.

**Solution :**
* Arrêt de l'émulateur.
* Utilisation de la fonction **"Wipe Data"** dans le *Device Manager* d'Android Studio pour réinitialiser l'émulateur à son état d'usine.
* Relance de l'installation.
## 🔧 Challenges Techniques Surmontés (Intégration Windows/Gradle)

L'intégration d'un module Flutter (Add-to-App) dans un projet React Native 0.76 sous Windows a présenté plusieurs défis complexes liés à l'écosystème Gradle et au verrouillage de fichiers. Voici les solutions techniques mises en place :

### 1. Conflit de Cycle de Vie Gradle (`afterEvaluate`)
* **Symptôme :** Erreur `Cannot run Project.afterEvaluate(Action) when the project is already evaluated`.
* **Cause :** Les optimisations de React Native 0.76 ("Configure on Demand") verrouillent le projet avant que le plugin Flutter n'ait pu s'initialiser.
* **Solution :** Désactivation explicite des caches et du parallélisme dans `gradle.properties` :
    ```properties
    org.gradle.configureondemand=false
    org.gradle.configuration-cache=false
    org.gradle.parallel=false
    ```

### 2. Incompatibilité de Script Groovy (`Binding`)
* **Symptôme :** Erreur `unable to resolve class Binding` dans `settings.gradle`.
* **Cause :** Le script d'intégration automatique de Flutter utilise une syntaxe Groovy implicite que les versions récentes de Gradle ne supportent plus dans ce contexte.
* **Solution :** Utilisation du nom de classe complet qualifié :
    ```gradle
    // Au lieu de setBinding(new Binding(...))
    setBinding(new groovy.lang.Binding([gradle: this]))
    ```

### 3. Verrouillage de Fichiers Windows (`UncheckedIOException`)
* **Symptôme :** Erreur `Could not move temporary workspace` lors du build.
* **Cause :** Le système de fichiers Windows, couplé à l'antivirus ou à l'indexation, verrouille les dossiers temporaires `.gradle` pendant la compilation.
* **Solution :**
    * Exclusion du dossier du projet dans Windows Defender.
    * Script de nettoyage manuel des processus `OpenJDK` et `GradleDaemon` avant les builds critiques.

### 4. Gestion des Plugins Flutter (`Package not found`)
* **Symptôme :** Le code Java généré (`GeneratedPluginRegistrant`) ne trouvait pas les modules `sqflite` ou `path_provider`.
* **Cause :** L'intégration manuelle initiale omettait l'inclusion dynamique des plugins dépendants.
* **Solution :** Retour à l'utilisation du script officiel `include_flutter.groovy` (une fois patché avec le fix `groovy.lang.Binding`), qui gère automatiquement la résolution des plugins via le fichier `.flutter-plugins-dependencies`.

---