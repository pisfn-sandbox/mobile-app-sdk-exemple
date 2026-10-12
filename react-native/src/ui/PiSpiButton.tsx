import { MaterialIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet } from 'react-native';

import { Colors } from './colors';

/**
 * Bouton d'entrée vers PI-SPI, avec le logo officiel.
 *
 * Toutes les variantes de couleurs des logos π et PI-SPI sont disponibles
 * ici : https://github.com/pisfn-sandbox/mobile-app-flutter-sdk-assets/tree/main/variante_logo_pi_et_pispi
 */
export function PiSpiButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ouvrir PI-SPI"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Image source={require('../../assets/images/logo_maron_jaune.png')} style={styles.logo} resizeMode="contain" />
      <MaterialIcons name="arrow-forward" size={24} color={Colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.piSpiTile,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: { opacity: 0.8 },
  logo: { height: 40, width: 120 },
});
