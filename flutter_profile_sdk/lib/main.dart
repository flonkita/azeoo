import 'package:flutter/material.dart';
import 'features/profile/presentation/profile_screen.dart';

// Point d'entrée pour l'exécution standalone (pour tester sans React Native)
void main() {
  runApp(const MyApp());
}

// Point d'entrée spécifique pour quand le module sera appelé
// C'est une bonne pratique de prévoir ça pour l'intégration future
@pragma('vm:entry-point')
void mainModule() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Azeoo SDK Profile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.blue, useMaterial3: true),
      // POUR LE TEST: On hardcode l'ID '1' ici.
      // Plus tard, on récupérera ça dynamiquement.
      home: const ProfileScreen(userId: '1'),
    );
  }
}
