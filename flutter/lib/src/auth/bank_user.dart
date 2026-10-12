import 'package:bceao_pispi_app/bceao_pispi_app.dart';

/// Client de la banque hôte, tel que l'application le connaît après la
/// connexion. Dans une vraie application, ces données viennent de votre
/// propre backend.
class BankUser {
  const BankUser({
    required this.firstName,
    required this.lastName,
    required this.pays,
    required this.comptes,
  });

  final String firstName;
  final String lastName;

  /// Pays UEMOA de domiciliation des comptes (BJ, BF, CI, GW, ML, NE, SN, TG).
  final String pays;
  final List<BankAccount> comptes;

  String get fullName => '$firstName $lastName';
}

/// Compte bancaire du client.
class BankAccount {
  const BankAccount({
    required this.numero,
    required this.libelle,
    required this.solde,
  });

  final String numero;
  final String libelle;
  final double solde;

  /// Numéro masqué pour l'affichage (« SNB0 **** 0001 »).
  String get numeroMasque => numero.length > 8
      ? '${numero.substring(0, 4)} **** ${numero.substring(numero.length - 4)}'
      : numero;

  /// Conversion vers le modèle du SDK.
  PiSpiCompte toPiSpi() =>
      PiSpiCompte(numero: numero, libelle: libelle, solde: solde);
}
