import { PiSpiSdkEntry, type PiSpiSdkConfig } from '@pi-spi/app';
import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

/**
 * Affiche le SDK en plein écran, par-dessus l'application hôte.
 *
 * - Le SDK gère sa propre navigation, son thème et ses traductions.
 * - Bouton retour Android : le SDK dépile d'abord ses propres écrans ;
 *   quand il n'a plus rien à dépiler, l'événement remonte ici et l'hôte
 *   ferme le SDK.
 * - N'affichez pas le SDK dans un `<Modal>` React Native sur Android : le
 *   bouton retour y déclencherait `onRequestClose` au lieu de la navigation
 *   interne du SDK.
 */
export function PiSpiScreen({ config, onClose }: { config: PiSpiSdkConfig; onClose: () => void }) {
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [onClose]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <PiSpiSdkEntry config={config} />
    </View>
  );
}
