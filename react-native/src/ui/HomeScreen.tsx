import { MaterialIcons } from '@expo/vector-icons';
import { Themes } from '@pi-spi/app';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { maskNumero } from '../auth/bankUser';
import { useSession } from '../auth/SessionContext';
import { AppEnv } from '../config/env';
import { Colors } from './colors';
import { PiSpiButton } from './PiSpiButton';

const THEMES: { value: Themes | undefined; label: string }[] = [
  { value: undefined, label: "Choix de l'utilisateur" },
  { value: Themes.system, label: 'Système' },
  { value: Themes.light, label: 'Clair' },
  { value: Themes.dark, label: 'Sombre' },
  { value: Themes.yellow, label: 'Jaune' },
  { value: Themes.green, label: 'Vert' },
  { value: Themes.blue, label: 'Bleu' },
  { value: Themes.red, label: 'Rouge' },
  { value: Themes.orange, label: 'Orange' },
  { value: Themes.purple, label: 'Violet' },
  { value: Themes.pink, label: 'Rose' },
];

const formatMontant = (montant: number) => `${new Intl.NumberFormat('fr-FR').format(montant)} F CFA`;

/** Accueil de l'application hôte : comptes du client et bouton PI-SPI. */
export function HomeScreen({
  theme,
  onThemeChange,
  onOpenPiSpi,
  onSimulatePush,
}: {
  /** Thème imposé au SDK (démo). `undefined` : celui choisi par l'utilisateur. */
  theme: Themes | undefined;
  onThemeChange: (theme: Themes | undefined) => void;
  onOpenPiSpi: () => void;
  onSimulatePush: () => void;
}) {
  const session = useSession();
  const user = session.user!;

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>{AppEnv.appName}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Se déconnecter" hitSlop={12} onPress={session.logout}>
          <MaterialIcons name="logout" size={24} color={Colors.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.hello}>Bonjour {user.firstName}</Text>
        {/* Entrée vers le SDK PI-SPI */}
        <PiSpiButton onPress={onOpenPiSpi} />

        <Text style={styles.section}>Mes comptes</Text>
        {user.comptes.map((compte) => (
          <View key={compte.numero} style={styles.card}>
            <MaterialIcons name="account-balance-wallet" size={24} color={Colors.textMuted} />
            <View style={styles.accountText}>
              <Text style={styles.accountName}>{compte.libelle}</Text>
              <Text style={styles.muted}>{maskNumero(compte.numero)}</Text>
            </View>
            <Text style={styles.amount}>{formatMontant(compte.solde)}</Text>
          </View>
        ))}

        {/* Options propres à la démo (absentes d'une vraie application) */}
        <View style={[styles.card, styles.demo]}>
          <Text style={styles.demoTitle}>Options de démo</Text>
          <Text style={styles.muted}>Thème du SDK</Text>
          <View style={styles.chips}>
            {THEMES.map((item) => {
              const selected = item.value === theme;
              return (
                <Pressable
                  key={item.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onThemeChange(item.value)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable accessibilityRole="button" onPress={onSimulatePush} style={styles.outlined}>
            <MaterialIcons name="notifications-active" size={20} color={Colors.primary} />
            <Text style={styles.outlinedText}>Ouvrir PI-SPI et simuler un push</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  appBarTitle: { fontSize: 22, color: Colors.text },
  content: { padding: 20, paddingTop: 4 },
  hello: { fontSize: 24, color: Colors.text, marginBottom: 20 },
  section: { fontSize: 16, fontWeight: '600', color: Colors.text, marginTop: 28, marginBottom: 8 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  accountText: { flex: 1, marginLeft: 16 },
  accountName: { fontSize: 16, color: Colors.text },
  muted: { fontSize: 13, color: Colors.textMuted },
  amount: { fontSize: 15, fontWeight: '600', color: Colors.text },
  demo: { flexDirection: 'column', alignItems: 'stretch', marginTop: 20 },
  demoTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, marginBottom: 16 },
  chip: { borderWidth: 1, borderColor: Colors.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.text },
  chipTextSelected: { color: 'white' },
  outlined: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
  },
  outlinedText: { color: Colors.primary, fontWeight: '600' },
});
