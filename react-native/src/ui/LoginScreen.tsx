import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../auth/SessionContext';
import { AppEnv } from '../config/env';
import { Colors } from './colors';

/**
 * Connexion à l'application hôte (simulée). Le SDK PI-SPI ne s'ouvre
 * qu'une fois l'utilisateur connecté ici.
 */
export function LoginScreen() {
  const session = useSession();
  const [multiComptes, setMultiComptes] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      await session.login({ multiComptes });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <MaterialIcons name="account-balance" size={56} color={Colors.primary} />
        <Text style={styles.title}>{AppEnv.appName}</Text>
        <Text style={styles.subtitle}>Application hôte d'exemple pour le SDK PI-SPI.</Text>

        <Text style={styles.label}>Identifiant</Text>
        <TextInput defaultValue="awa.diop" autoCapitalize="none" style={styles.input} />
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput defaultValue="motdepasse" secureTextEntry style={styles.input} />
        <Text style={styles.hint}>Connexion simulée : aucun identifiant n'est nécessaire.</Text>

        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <Text style={styles.switchTitle}>Client avec plusieurs comptes</Text>
            <Text style={styles.hint}>Le SDK propose alors de choisir le compte</Text>
          </View>
          <Switch value={multiComptes} onValueChange={setMultiComptes} trackColor={{ true: Colors.primary }} />
        </View>

        <Pressable accessibilityRole="button" onPress={login} disabled={loading} style={styles.button}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Se connecter</Text>}
        </Pressable>
        {AppEnv.demoMode && <Text style={[styles.hint, styles.center]}>Mode démo : le SDK n'appelle aucun backend.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingTop: 64 },
  title: { fontSize: 28, color: Colors.text, marginTop: 16 },
  subtitle: { fontSize: 15, color: Colors.textMuted, marginTop: 8, marginBottom: 32 },
  label: { fontSize: 13, color: Colors.textMuted, marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  hint: { fontSize: 12, color: Colors.textMuted, marginTop: 6 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  switchTitle: { fontSize: 16, color: Colors.text },
  button: {
    marginTop: 32,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  center: { textAlign: 'center', marginTop: 24 },
});
