/**
 * Configuration de l'exemple, lue au lancement depuis les variables
 * `EXPO_PUBLIC_*` (fichier `.env`, voir `.env.example` et le README).
 *
 * Par défaut, l'exemple tourne en **mode démo** : le SDK n'appelle aucun
 * backend (réponses simulées), aucune clé ni URL réelle n'est nécessaire.
 */
export const AppEnv = {
  /**
   * `true` : le SDK simule toutes ses réponses (aucune requête réseau).
   * `false` : le SDK appelle le backend PI-SPI de `apiBaseUrl`.
   */
  demoMode: process.env.EXPO_PUBLIC_PISPI_DEMO_MODE !== 'false',

  /** URL du backend PI-SPI du participant (ignorée en mode démo). */
  apiBaseUrl: process.env.EXPO_PUBLIC_PISPI_API_BASE_URL ?? 'https://sandbox.pi-bceao.com/api',

  /**
   * Code membre du participant auprès de la BCEAO (communiqué lors de
   * l'intégration). Le même pour tous les utilisateurs de l'application.
   */
  pspCodeMembre: process.env.EXPO_PUBLIC_PISPI_PSP_CODE_MEMBRE ?? 'SNB000',

  /** Nom et version affichés par le SDK. */
  appName: 'Ma Banque (exemple)',
  appVersion: '1.0.0',
} as const;
