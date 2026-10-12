import { PiSpiPush } from '@pi-spi/app';

/**
 * Pont entre les notifications push reçues par l'application hôte et le
 * SDK PI-SPI.
 *
 * Le SDK n'embarque aucun fournisseur de push : l'application hôte reçoit
 * les messages (Firebase, APNs, `expo-notifications`...) et transmet ceux
 * de PI-SPI à `PiSpiPush.handleIncoming`. Si l'écran du SDK est ouvert, il
 * affiche la notification (bannière ou boîte), joue le son et met à jour
 * le badge.
 *
 * Pour brancher Firebase Cloud Messaging (`@react-native-firebase/messaging`) :
 *
 * ```ts
 * messaging().onMessage(async (message) => {
 *   onPushMessage(message.data ?? {}, {
 *     title: message.notification?.title,
 *     body: message.notification?.body,
 *   });
 * });
 * ```
 *
 * N'oubliez pas d'enregistrer le token push de l'appareil auprès de votre
 * backend : le SDK ne le fait pas.
 */
export function onPushMessage(data: Record<string, unknown>, options: { title?: string; body?: string } = {}): void {
  // Ne transmettre que les messages PI-SPI (adaptez ce filtre au format de vos messages).
  if (data.type == null) return;
  PiSpiPush.handleIncoming(data, options);
}

/** Simule la réception d'un push « transfert reçu » (démo uniquement). */
export function simulateTransferReceived(): void {
  onPushMessage(
    { idObject: 'ESNB00120240105153554CancelpNvhUk9e', type: 'TRANSFERT_RECU', montant: '1500' },
    { title: 'Transfert reçu', body: 'Vous avez reçu 1 500 F CFA de Aïda Diop' },
  );
}
