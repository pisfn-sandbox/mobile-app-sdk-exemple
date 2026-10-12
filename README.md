# Exemples d'intégration du SDK PI-SPI

Ce dépôt contient deux applications mobiles d'exemple qui intègrent le SDK
PI-SPI de la BCEAO dans une application hôte (« Ma Banque ») :

| Dossier | Technologie | SDK |
| --- | --- | --- |
| [`flutter/`](flutter/) | Flutter | [`bceao_pispi_app`](https://pub.dev/packages/bceao_pispi_app) (pub.dev) |
| [`react-native/`](react-native/) | React Native (Expo) | [`@pi-spi/app`](https://www.npmjs.com/package/@pi-spi/app) (npm) |

Les deux exemples ont le même parcours et la même structure :

1. **Connexion** à l'application hôte (simulée) : le SDK n'implémente
   aucune authentification, c'est l'hôte qui connecte l'utilisateur et
   détient le token d'accès.
2. **Accueil** de l'hôte avec les comptes du client et le **bouton PI-SPI**,
   point d'entrée du SDK.
3. **Ouverture du SDK** avec la session de l'hôte : identité, comptes
   (un ou plusieurs), token et son rafraîchissement, expiration de session,
   langue, thème, journalisation.
4. **Vérification renforcée** avant chaque action sensible : biométrie de
   l'appareil, avec repli sur un code PIN.
5. **Notifications push** : point d'entrée prêt à brancher sur votre
   fournisseur (exemple Firebase), et simulation d'un push.

Les exemples tournent par défaut en **mode démo** : le SDK n'appelle aucun
backend, aucune clé ni URL réelle n'est nécessaire.

## Documentation

- API du backend PI-SPI attendue par les SDK :
  [developers.pi-bceao.com/api-reference/mob-sdk](https://developers.pi-bceao.com/api-reference/mob-sdk/index.html)
- SDK Flutter : [pub.dev/packages/bceao_pispi_app](https://pub.dev/packages/bceao_pispi_app)
- SDK React Native : [npmjs.com/package/@pi-spi/app](https://www.npmjs.com/package/@pi-spi/app)
- Logos π et PI-SPI pour le bouton d'entrée :
  [variante_logo_pi_et_pispi](https://github.com/pisfn-sandbox/mobile-app-flutter-sdk-assets/tree/main/variante_logo_pi_et_pispi)

## Licence

Le code de ces exemples est sous licence [MIT](LICENSE) : vous pouvez le
reprendre librement dans votre application. Les SDK eux-mêmes restent
soumis à leur propre licence (voir leur page pub.dev / npm).
