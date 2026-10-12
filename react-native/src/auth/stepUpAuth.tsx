import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

/** Code PIN accepté par la démo. En réel, le PIN est vérifié par votre backend. */
export const DEMO_PIN = '1234';

/**
 * Vérification renforcée (« step-up ») demandée par le SDK avant chaque
 * action sensible (confirmer une transaction, supprimer un alias...).
 *
 * Le SDK ne voit jamais le secret : il attend seulement un booléen.
 * Ici : biométrie de l'appareil si elle est disponible, sinon un code PIN.
 *
 * `request` est à passer à `requireStepUpIdentification` ; `overlay` est à
 * afficher par-dessus le SDK (le PIN doit apparaître au-dessus de ses écrans).
 */
export function useStepUpAuth() {
  const [pinVisible, setPinVisible] = useState(false);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const askPin = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setPinVisible(true);
      }),
    [],
  );

  const request = useCallback(async (): Promise<boolean> => {
    const canUseBiometrics =
      (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
    if (canUseBiometrics) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirmez votre identité pour valider l'opération",
        cancelLabel: 'Annuler',
      });
      if (result.success) return true;
      // Annulation volontaire : l'opération est abandonnée.
      if (result.error === 'user_cancel' || result.error === 'system_cancel') return false;
      // Autre échec (verrouillage, biométrie indisponible...) : repli sur le PIN.
    }
    return askPin();
  }, [askPin]);

  const complete = useCallback((ok: boolean) => {
    setPinVisible(false);
    resolver.current?.(ok);
    resolver.current = null;
  }, []);

  const overlay = pinVisible ? <PinOverlay onDone={complete} /> : null;
  return { request, overlay };
}

/** Saisie d'un code PIN à 4 chiffres (repli quand la biométrie n'est pas disponible). */
function PinOverlay({ onDone }: { onDone: (ok: boolean) => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (pin === DEMO_PIN) return onDone(true);
    setError('Code incorrect');
    setPin('');
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.dialog}>
        <Text style={styles.title}>Code PIN</Text>
        <Text style={styles.text}>Saisissez votre code pour confirmer l'opération.</Text>
        <Text style={styles.hint}>Démo : {DEMO_PIN}</Text>
        <TextInput
          value={pin}
          onChangeText={setPin}
          onSubmitEditing={submit}
          autoFocus
          secureTextEntry
          keyboardType="number-pad"
          maxLength={4}
          style={styles.input}
        />
        {error != null && <Text style={styles.error}>{error}</Text>}
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={() => onDone(false)} style={styles.button}>
            <Text style={styles.cancel}>Annuler</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={submit} style={[styles.button, styles.primary]}>
            <Text style={styles.primaryText}>Valider</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: { backgroundColor: 'white', borderRadius: 20, padding: 24 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  text: { fontSize: 15, color: '#333' },
  hint: { fontSize: 13, color: '#777', marginTop: 4 },
  input: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderColor: '#542D00',
    fontSize: 24,
    letterSpacing: 12,
    textAlign: 'center',
    paddingVertical: 8,
  },
  error: { color: '#C62828', marginTop: 8, textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, gap: 8 },
  button: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  primary: { backgroundColor: '#542D00' },
  cancel: { color: '#542D00', fontWeight: '600' },
  primaryText: { color: 'white', fontWeight: '600' },
});
