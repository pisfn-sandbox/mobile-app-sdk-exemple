import 'package:bceao_pispi_app/bceao_pispi_app.dart';
import 'package:flutter/material.dart';

import '../auth/session_controller.dart';
import '../auth/step_up_auth.dart';
import '../config/app_env.dart';

/// **Point d'entrée du SDK PI-SPI** : c'est le fichier à lire en premier.
///
/// Construit la configuration du SDK à partir de la session de
/// l'application hôte, puis l'ouvre en plein écran par-dessus l'application
/// (le SDK n'a pas son propre `MaterialApp`).
class PiSpiLauncher {
  PiSpiLauncher({required this.session, StepUpAuth? stepUpAuth})
      : _stepUpAuth = stepUpAuth ?? StepUpAuth();

  final SessionController session;
  final StepUpAuth _stepUpAuth;

  /// Ouvre le SDK. [theme] impose un thème (sinon l'utilisateur garde le
  /// sien et peut en changer dans les paramètres du SDK).
  Future<void> open(BuildContext context, {Themes? theme}) async {
    final user = session.user;
    final token = session.accessToken;
    // Le SDK ne s'ouvre que pour un utilisateur déjà connecté.
    if (user == null || token == null) return;

    final navigator = Navigator.of(context);
    final messenger = ScaffoldMessenger.of(context);

    void closeSdk() {
      if (navigator.canPop()) navigator.pop();
    }

    final config = PiSpiSdkConfig(
      // Identité du client connecté (jamais vérifiée ni stockée par le SDK).
      user: PiSpiUserIdentity(
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        pays: user.pays,
        // Jamais vide. Plusieurs comptes : le SDK propose de choisir le
        // compte à l'ouverture, puis un carrousel sur son accueil.
        comptes: user.comptes.map((c) => c.toPiSpi()).toList(),
      ),
      api: PiSpiApiConfig(
        apiBaseUrl: AppEnv.apiBaseUrl,
        // Token de la session hôte, envoyé par le SDK en « Bearer ».
        accessToken: token,
        // Requête en 401/403 : l'hôte rafraîchit son token (null si
        // impossible). Après 3 échecs, le SDK appelle onSessionExpired.
        onAccessTokenExpired: session.refreshAccessToken,
        // Session réellement expirée : on ferme le SDK et on déconnecte.
        onSessionExpired: () async {
          closeSdk();
          session.logout();
          messenger.showSnackBar(
            const SnackBar(content: Text('Session expirée, reconnectez-vous')),
          );
        },
        demoMode: AppEnv.demoMode,
      ),
      appConfig: PiSpiAppConfig(
        pspCodeMembre: AppEnv.pspCodeMembre,
        appName: AppEnv.appName,
        appVersion: AppEnv.appVersion,
        // Le SDK ne gère que fr, en et pt : l'hôte transmet sa langue.
        defaultLocale: const Locale('fr'),
        defaultTheme: theme,
        // Laisse l'utilisateur changer de thème dans le SDK même si un
        // thème est imposé à l'ouverture.
        canChangeTheme: true,
      ),
      identification: PiSpiIdentificationConfig(
        // Demandé par le SDK avant chaque action sensible.
        requireStepUpIdentification: () async {
          final ctx = navigator.context;
          if (!ctx.mounted) return false;
          return _stepUpAuth.verify(ctx);
        },
        // Méthode de confirmation envoyée à l'API (à valider avec la BCEAO).
        confirmationMethodLabel: 'external',
      ),
      log: PiSpiLogConfig(
        // "warning" ou "error" en production.
        logLevel: AppEnv.demoMode ? 'debug' : 'warning',
        // Branchez ici votre outil de crash reporting (Crashlytics, Sentry...).
        onFlutterError: (details) =>
            debugPrint('[PI-SPI] ${details.exceptionAsString()}'),
      ),
      // Fermeture volontaire du SDK par l'utilisateur.
      onClose: () async => closeSdk(),
    );

    await navigator.push(
      MaterialPageRoute<void>(builder: (_) => PiSpiSdkEntry(config: config)),
    );
  }
}
