import 'package:flutter/foundation.dart';

import 'bank_user.dart';

/// Session de l'utilisateur dans l'application hôte.
///
/// Le SDK PI-SPI n'implémente **aucune authentification** : c'est
/// l'application hôte qui connecte l'utilisateur, détient le token d'accès,
/// le rafraîchit et le transmet au SDK (voir `PiSpiLauncher`).
///
/// Ici la connexion est simulée. Remplacez [login], [refreshAccessToken] et
/// [logout] par les appels à votre propre fournisseur d'identité.
class SessionController extends ChangeNotifier {
  BankUser? _user;
  String? _accessToken;
  int _tokenVersion = 0;

  BankUser? get user => _user;
  String? get accessToken => _accessToken;
  bool get isLoggedIn => _user != null && _accessToken != null;

  /// Connexion simulée. En réel : appel à votre IDP / backend, qui renvoie
  /// le profil, les comptes et un token d'accès accepté par le backend
  /// PI-SPI.
  Future<void> login({required bool multiComptes}) async {
    await Future<void>.delayed(const Duration(milliseconds: 600));
    _user = BankUser(
      firstName: 'Awa',
      lastName: 'Diop',
      pays: 'SN',
      comptes: [
        const BankAccount(
          numero: 'SNB0000000000000000001',
          libelle: 'Courant',
          solde: 4240320,
        ),
        if (multiComptes) ...const [
          BankAccount(
            numero: 'SNB0000000000000000002',
            libelle: 'Chèque',
            solde: 240000,
          ),
          BankAccount(
            numero: 'SNB0000000000000000003',
            libelle: 'Épargne',
            solde: 32240320,
          ),
        ],
      ],
    );
    _accessToken = 'DEMO_ACCESS_TOKEN_${++_tokenVersion}';
    notifyListeners();
  }

  /// Rafraîchit le token d'accès. Appelé par le SDK quand une requête
  /// échoue en 401/403. Renvoie `null` si la session ne peut pas être
  /// prolongée : le SDK appelle alors `onSessionExpired`.
  Future<String?> refreshAccessToken() async {
    if (_user == null) return null;
    await Future<void>.delayed(const Duration(milliseconds: 300));
    _accessToken = 'DEMO_ACCESS_TOKEN_${++_tokenVersion}';
    return _accessToken;
  }

  void logout() {
    _user = null;
    _accessToken = null;
    notifyListeners();
  }
}
