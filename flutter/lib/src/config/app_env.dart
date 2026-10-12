/// Configuration de l'exemple, lue au lancement via `--dart-define` ou
/// `--dart-define-from-file` (voir `config/*.json` et le README).
///
/// Par défaut, l'exemple tourne en **mode démo** : le SDK n'appelle aucun
/// backend (réponses simulées), aucune clé ni URL réelle n'est nécessaire.
class AppEnv {
  AppEnv._();

  /// `true` : le SDK simule toutes ses réponses (aucune requête réseau).
  /// `false` : le SDK appelle le backend PI-SPI de [apiBaseUrl].
  static const bool demoMode = bool.fromEnvironment(
    'PISPI_DEMO_MODE',
    defaultValue: true,
  );

  /// URL du backend PI-SPI du participant (ignorée en mode démo).
  static const String apiBaseUrl = String.fromEnvironment(
    'PISPI_API_BASE_URL',
    defaultValue: 'https://sandbox.pi-bceao.com/api',
  );

  /// Code membre du participant auprès de la BCEAO (communiqué lors de
  /// l'intégration). Le même pour tous les utilisateurs de l'application.
  static const String pspCodeMembre = String.fromEnvironment(
    'PISPI_PSP_CODE_MEMBRE',
    defaultValue: 'SNB000',
  );

  /// Nom et version affichés par le SDK (écran « À propos »).
  static const String appName = 'Ma Banque (exemple)';
  static const String appVersion = '1.0.0';
}
