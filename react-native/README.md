# Exemple React Native — SDK PI-SPI (`@pi-spi/app`)

Application hôte d'exemple (« Ma Banque ») qui intègre le SDK React Native
[`@pi-spi/app`](https://www.npmjs.com/package/@pi-spi/app).

## Lancer l'exemple

Prérequis : Node.js 20+, Android Studio (Android) ou Xcode (iOS). Le SDK
utilise des modules natifs : l'exemple tourne dans un *development build*
(`expo run:*`), **pas dans Expo Go**.

```sh
npm install
npx expo run:android   # ou : npx expo run:ios
```

Par défaut, l'exemple tourne en **mode démo** : le SDK n'appelle aucun
backend, toutes ses réponses sont simulées.

Pour appeler un vrai backend PI-SPI, copiez `.env.example` en `.env`
(ignoré par git), renseignez-le et relancez l'application.

Connexion simulée : aucun identifiant n'est nécessaire. Code PIN de
démonstration (quand la biométrie n'est pas disponible) : `1234`.

## Où regarder

| Fichier | Rôle |
| --- | --- |
| [`src/pispi/buildPiSpiConfig.ts`](src/pispi/buildPiSpiConfig.ts) | **Configuration du SDK** (`PiSpiSdkConfig`). À lire en premier. |
| [`src/pispi/PiSpiScreen.tsx`](src/pispi/PiSpiScreen.tsx) | Affichage plein écran de `PiSpiSdkEntry` et bouton retour Android. |
| [`App.tsx`](App.tsx) | Ouverture et fermeture du SDK depuis l'application hôte. |
| [`src/auth/SessionContext.tsx`](src/auth/SessionContext.tsx) | Session de l'hôte : connexion, token d'accès, rafraîchissement (`onAccessTokenExpired`), déconnexion (`onSessionExpired`). |
| [`src/auth/stepUpAuth.tsx`](src/auth/stepUpAuth.tsx) | Vérification renforcée (`requireStepUpIdentification`) : biométrie avec `expo-local-authentication`, repli sur un code PIN. |
| [`src/push/pushBridge.ts`](src/push/pushBridge.ts) | Transmission des notifications push au SDK (`PiSpiPush.handleIncoming`), avec l'exemple Firebase. |
| [`src/config/env.ts`](src/config/env.ts) | Mode démo, URL du backend et code membre du participant. |
| [`app.json`](app.json) | Plugins Expo et messages des permissions natives utilisées par le SDK. |

## À adapter dans votre application

- **Connexion et token** : remplacez la session simulée par votre
  fournisseur d'identité. Le token transmis au SDK doit être accepté par
  le backend PI-SPI.
- **Code membre** : `EXPO_PUBLIC_PISPI_PSP_CODE_MEMBRE`, communiqué par la
  BCEAO.
- **Step-up** : la vérification du PIN doit être faite par votre backend.
- **Push** : branchez votre fournisseur dans `pushBridge.ts` et
  enregistrez le token de l'appareil auprès de votre backend.
- **Application React Native sans Expo** : installez les modules Expo
  (`npx install-expo-modules@latest`) et déclarez les permissions dans
  `AndroidManifest.xml` / `Info.plist` (voir le README du SDK).
