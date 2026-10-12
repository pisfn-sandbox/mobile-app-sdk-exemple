import 'package:bceao_pispi_app/bceao_pispi_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'src/auth/session_controller.dart';
import 'src/pispi/pispi_launcher.dart';
import 'src/ui/home_page.dart';
import 'src/ui/login_page.dart';

void main() {
  runApp(const ExampleApp());
}

/// Application hôte d'exemple : connexion, puis accueil avec le bouton
/// PI-SPI qui ouvre le SDK (voir `src/pispi/pispi_launcher.dart`).
class ExampleApp extends StatefulWidget {
  const ExampleApp({super.key});

  @override
  State<ExampleApp> createState() => _ExampleAppState();
}

class _ExampleAppState extends State<ExampleApp> {
  final _session = SessionController();
  late final _launcher = PiSpiLauncher(session: _session);

  @override
  void dispose() {
    _session.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ma Banque (exemple)',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF542D00)),
        useMaterial3: true,
      ),
      // Obligatoire : le delegate de traductions du SDK (fr, en, pt).
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        AppLocalizations.delegate,
      ],
      supportedLocales: AppLocalizations.supportedLocales,
      locale: const Locale('fr'),
      home: ListenableBuilder(
        listenable: _session,
        builder: (context, _) => _session.isLoggedIn
            ? HomePage(session: _session, launcher: _launcher)
            : LoginPage(session: _session),
      ),
    );
  }
}
