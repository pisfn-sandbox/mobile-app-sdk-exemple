import { PiSpiCompte } from '@pi-spi/app';

/**
 * Client de la banque hôte, tel que l'application le connaît après la
 * connexion. Dans une vraie application, ces données viennent de votre
 * propre backend.
 */
export type BankUser = {
  firstName: string;
  lastName: string;
  /** Pays UEMOA de domiciliation des comptes (BJ, BF, CI, GW, ML, NE, SN, TG). */
  pays: string;
  comptes: BankAccount[];
};

/** Compte bancaire du client. */
export type BankAccount = { numero: string; libelle: string; solde: number };

export const fullName = (user: BankUser) => `${user.firstName} ${user.lastName}`;

/** Conversion vers le modèle du SDK. */
export const toPiSpiCompte = (compte: BankAccount) => new PiSpiCompte(compte);

/** Numéro de compte masqué pour l'affichage (« SNB0 **** 0001 »). */
export const maskNumero = (numero: string) =>
  numero.length > 8 ? `${numero.slice(0, 4)} **** ${numero.slice(-4)}` : numero;
