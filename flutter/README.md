# Exemple Flutter — SDK PI-SPI (`bceao_pispi_app`)

Application hôte d'exemple (« Ma Banque ») qui intègre le SDK Flutter
[`bceao_pispi_app`](https://pub.dev/packages/bceao_pispi_app).

## Lancer l'exemple

Prérequis : Flutter 3.38+ (Dart 3.10+), un appareil ou un émulateur
Android / iOS.

```sh
flutter pub get
flutter run
```

Par défaut, l'exemple tourne en **mode démo** : le SDK n'appelle aucun
backend, toutes ses réponses sont simulées.

Pour appeler un vrai backend PI-SPI, copiez `config/sandbox.example.json`
en `config/sandbox.local.json` (ignoré par git), renseignez-le, puis :

```sh
flutter run --dart-define-from-file=config/sandbox.local.json
```

Connexion simulée : aucun identifiant n'est nécessaire. Code PIN de
démonstration (quand la biométrie n'est pas disponible) : `1234`.

## Où regarder

| Fichier | Rôle |
| --- | --- |
| [`lib/src/pispi/pispi_launcher.dart`](lib/src/pispi/pispi_launcher.dart) | **Point d'entrée du SDK** : construction de `PiSpiSdkConfig` et ouverture de `PiSpiSdkEntry`. À lire en premier. |
| [`lib/main.dart`](lib/main.dart) | Delegate de traductions du SDK (`AppLocalizations.delegate`), obligatoire. |
| [`lib/src/auth/session_controller.dart`](lib/src/auth/session_controller.dart) | Session de l'hôte : connexion, token d'accès, rafraîchissement (`onAccessTokenExpired`), déconnexion (`onSessionExpired`). |
| [`lib/src/auth/step_up_auth.dart`](lib/src/auth/step_up_auth.dart) | Vérification renforcée (`requireStepUpIdentification`) : biométrie avec `local_auth`, repli sur un code PIN. |
| [`lib/src/push/push_bridge.dart`](lib/src/push/push_bridge.dart) | Transmission des notifications push au SDK (`PiSpiPush.handleIncoming`), avec l'exemple Firebase. |
| [`lib/src/config/app_env.dart`](lib/src/config/app_env.dart) | Mode démo, URL du backend et code membre du participant. |
| [`android/app/src/main/AndroidManifest.xml`](android/app/src/main/AndroidManifest.xml), [`ios/Runner/Info.plist`](ios/Runner/Info.plist) | Permissions natives utilisées par le SDK. |
| [`android/app/src/main/kotlin/.../MainActivity.kt`](android/app/src/main/kotlin/com/bceao/pispi/pispi_sdk_exemple/MainActivity.kt) | `FlutterFragmentActivity`, requis par `local_auth`. |

## À adapter dans votre application

- **Connexion et token** : remplacez la session simulée par votre
  fournisseur d'identité. Le token transmis au SDK doit être accepté par
  le backend PI-SPI.
- **Code membre** : `PISPI_PSP_CODE_MEMBRE`, communiqué par la BCEAO.
- **Step-up** : la vérification du PIN doit être faite par votre backend.
- **Push** : branchez votre fournisseur dans `PushBridge` et enregistrez
  le token de l'appareil auprès de votre backend.

## Note sur les dépendances

`pubspec.yaml` limite `image` à `< 4.11.0` : la version 4.11.0 de ce
package, utilisée indirectement par le SDK (reçus PDF), ne compile pas
avec la version d'`archive` imposée par `pdf`.
