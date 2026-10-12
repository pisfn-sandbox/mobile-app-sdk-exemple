import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

import type { BankUser } from './bankUser';

/**
 * Session de l'utilisateur dans l'application hôte.
 *
 * Le SDK PI-SPI n'implémente **aucune authentification** : c'est
 * l'application hôte qui connecte l'utilisateur, détient le token d'accès,
 * le rafraîchit et le transmet au SDK (voir `src/pispi/buildPiSpiConfig.ts`).
 *
 * Ici la connexion est simulée. Remplacez `login`, `refreshAccessToken` et
 * `logout` par les appels à votre propre fournisseur d'identité.
 */
type Session = {
  user: BankUser | null;
  /** Token d'accès courant (lu au moment d'ouvrir le SDK). */
  getAccessToken: () => string | null;
  login: (options: { multiComptes: boolean }) => Promise<void>;
  /**
   * Rafraîchit le token d'accès. Appelé par le SDK quand une requête échoue
   * en 401/403. Renvoie `null` si la session ne peut pas être prolongée :
   * le SDK appelle alors `onSessionExpired`.
   */
  refreshAccessToken: () => Promise<string | null>;
  logout: () => void;
};

const SessionContext = createContext<Session | null>(null);

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BankUser | null>(null);
  const token = useRef<string | null>(null);
  const tokenVersion = useRef(0);

  const login = useCallback(async ({ multiComptes }: { multiComptes: boolean }) => {
    // Connexion simulée. En réel : appel à votre IDP / backend, qui renvoie
    // le profil, les comptes et un token d'accès accepté par le backend PI-SPI.
    await delay(600);
    token.current = `DEMO_ACCESS_TOKEN_${++tokenVersion.current}`;
    setUser({
      firstName: 'Awa',
      lastName: 'Diop',
      pays: 'SN',
      comptes: [
        { numero: 'SNB0000000000000000001', libelle: 'Courant', solde: 4240320 },
        ...(multiComptes
          ? [
              { numero: 'SNB0000000000000000002', libelle: 'Chèque', solde: 240000 },
              { numero: 'SNB0000000000000000003', libelle: 'Épargne', solde: 32240320 },
            ]
          : []),
      ],
    });
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (token.current == null) return null;
    await delay(300);
    token.current = `DEMO_ACCESS_TOKEN_${++tokenVersion.current}`;
    return token.current;
  }, []);

  const logout = useCallback(() => {
    token.current = null;
    setUser(null);
  }, []);

  const value = useMemo<Session>(
    () => ({ user, getAccessToken: () => token.current, login, refreshAccessToken, logout }),
    [user, login, refreshAccessToken, logout],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (session == null) throw new Error('useSession doit être utilisé sous <SessionProvider>.');
  return session;
}
