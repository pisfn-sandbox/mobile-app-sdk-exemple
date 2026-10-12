import type { PiSpiSdkConfig, Themes } from '@pi-spi/app';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider, useSession } from './src/auth/SessionContext';
import { useStepUpAuth } from './src/auth/stepUpAuth';
import { buildPiSpiConfig } from './src/pispi/buildPiSpiConfig';
import { PiSpiScreen } from './src/pispi/PiSpiScreen';
import { simulateTransferReceived } from './src/push/pushBridge';
import { HomeScreen } from './src/ui/HomeScreen';
import { LoginScreen } from './src/ui/LoginScreen';

/**
 * Application hôte d'exemple : connexion, puis accueil avec le bouton
 * PI-SPI qui ouvre le SDK (voir `src/pispi/buildPiSpiConfig.ts`).
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <StatusBar style="dark" />
        <Root />
      </SessionProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const session = useSession();
  const stepUp = useStepUpAuth();
  const [sdkConfig, setSdkConfig] = useState<PiSpiSdkConfig | null>(null);
  const [theme, setTheme] = useState<Themes | undefined>(undefined);

  const closePiSpi = useCallback(() => setSdkConfig(null), []);

  const openPiSpi = useCallback(() => {
    const user = session.user;
    const accessToken = session.getAccessToken();
    // Le SDK ne s'ouvre que pour un utilisateur déjà connecté.
    if (user == null || accessToken == null) return;
    setSdkConfig(
      buildPiSpiConfig({
        user,
        accessToken,
        refreshAccessToken: session.refreshAccessToken,
        onSessionExpired: () => {
          closePiSpi();
          session.logout();
          Alert.alert('Session expirée', 'Reconnectez-vous.');
        },
        onClose: closePiSpi,
        requireStepUpIdentification: stepUp.request,
        theme,
      }),
    );
  }, [session, stepUp.request, theme, closePiSpi]);

  const openPiSpiAndSimulatePush = useCallback(() => {
    openPiSpi();
    // Laisse le temps à l'accueil du SDK de s'afficher.
    setTimeout(simulateTransferReceived, 3000);
  }, [openPiSpi]);

  if (session.user == null) return <LoginScreen />;

  return (
    <View style={styles.flex}>
      <HomeScreen theme={theme} onThemeChange={setTheme} onOpenPiSpi={openPiSpi} onSimulatePush={openPiSpiAndSimulatePush} />
      {sdkConfig != null && <PiSpiScreen config={sdkConfig} onClose={closePiSpi} />}
      {/* Saisie du PIN de repli, au-dessus des écrans du SDK */}
      {stepUp.overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
