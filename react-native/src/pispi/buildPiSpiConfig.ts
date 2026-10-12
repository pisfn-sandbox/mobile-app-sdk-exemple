import {
  PiSpiApiConfig,
  PiSpiAppConfig,
  PiSpiIdentificationConfig,
  PiSpiLogConfig,
  PiSpiSdkConfig,
  PiSpiUserIdentity,
  type Themes,
} from '@pi-spi/app';

import { fullName, toPiSpiCompte, type BankUser } from '../auth/bankUser';
import { AppEnv } from '../config/env';

/**
 * **Configuration du SDK PI-SPI** : c'est le fichier à lire en premier.
 *
 * Construit la configuration du SDK à partir de la session de
 * l'application hôte. Elle est passée à `<PiSpiSdkEntry config={...} />`
 * (voir `PiSpiScreen.tsx`).
 */
export function buildPiSpiConfig(params: {
  user: BankUser;
  accessToken: string;
  refreshAccessToken: () => Promise<string | null>;
  /** Session réellement expirée : fermer le SDK et déconnecter. */
  onSessionExpired: () => void;
  /** Fermeture volontaire du SDK par l'utilisateur. */
  onClose: () => void;
  /** Vérification renforcée (biométrie ou PIN), voir `useStepUpAuth`. */
  requireStepUpIdentification: () => Promise<boolean>;
  /** Thème imposé (sinon l'utilisateur garde le sien). */
  theme?: Themes;
}): PiSpiSdkConfig {
  const { user } = params;
  return new PiSpiSdkConfig({
    // Identité du client connecté (jamais vérifiée ni stockée par le SDK).
    user: new PiSpiUserIdentity({
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: fullName(user),
      pays: user.pays,
      // Jamais vide. Plusieurs comptes : le SDK propose de choisir le compte
      // à l'ouverture, puis un carrousel sur son accueil.
      comptes: user.comptes.map(toPiSpiCompte),
    }),
    api: new PiSpiApiConfig({
      apiBaseUrl: AppEnv.apiBaseUrl,
      // Token de la session hôte, envoyé par le SDK en « Bearer ».
      accessToken: params.accessToken,
      // Requête en 401/403 : l'hôte rafraîchit son token (null si
      // impossible). Après 3 échecs, le SDK appelle onSessionExpired.
      onAccessTokenExpired: params.refreshAccessToken,
      onSessionExpired: async () => params.onSessionExpired(),
      demoMode: AppEnv.demoMode,
    }),
    appConfig: new PiSpiAppConfig({
      pspCodeMembre: AppEnv.pspCodeMembre,
      appName: AppEnv.appName,
      appVersion: AppEnv.appVersion,
      // Le SDK ne gère que fr, en et pt : l'hôte transmet sa langue.
      defaultLocale: 'fr',
      defaultTheme: params.theme,
      // Laisse l'utilisateur changer de thème dans le SDK même si un thème
      // est imposé à l'ouverture.
      canChangeTheme: true,
    }),
    identification: new PiSpiIdentificationConfig({
      // Demandé par le SDK avant chaque action sensible.
      requireStepUpIdentification: params.requireStepUpIdentification,
      // Méthode de confirmation envoyée à l'API (à valider avec la BCEAO).
      confirmationMethodLabel: 'external',
    }),
    log: new PiSpiLogConfig({
      // "warning" ou "error" en production.
      logLevel: AppEnv.demoMode ? 'debug' : 'warning',
      // Branchez ici votre outil de crash reporting (Crashlytics, Sentry...).
      onError: (error) => console.log('[PI-SPI]', error),
    }),
    onClose: async () => params.onClose(),
  });
}
