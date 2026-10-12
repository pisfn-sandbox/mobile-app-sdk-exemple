import 'package:bceao_pispi_app/bceao_pispi_app.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../auth/session_controller.dart';
import '../config/app_env.dart';
import '../pispi/pispi_launcher.dart';
import '../push/push_bridge.dart';
import 'pispi_button.dart';

/// Accueil de l'application hôte : comptes du client et bouton PI-SPI.
class HomePage extends StatefulWidget {
  const HomePage({super.key, required this.session, required this.launcher});

  final SessionController session;
  final PiSpiLauncher launcher;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  /// Thème imposé au SDK (démo). `null` : celui choisi par l'utilisateur.
  Themes? _theme;

  final _amount = NumberFormat.decimalPattern('fr');

  Future<void> _openPiSpi({bool simulatePush = false}) async {
    final opening = widget.launcher.open(context, theme: _theme);
    if (simulatePush) {
      // Laisse le temps à l'accueil du SDK de s'afficher.
      await Future<void>.delayed(const Duration(seconds: 3));
      PushBridge.simulateTransferReceived();
    }
    await opening;
  }

  @override
  Widget build(BuildContext context) {
    final user = widget.session.user!;
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppEnv.appName),
        actions: [
          IconButton(
            tooltip: 'Se déconnecter',
            icon: const Icon(Icons.logout),
            onPressed: widget.session.logout,
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('Bonjour ${user.firstName}', style: theme.textTheme.headlineSmall),
            const SizedBox(height: 20),
            // Entrée vers le SDK PI-SPI
            PiSpiButton(onPressed: _openPiSpi),
            const SizedBox(height: 28),
            Text('Mes comptes', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            for (final compte in user.comptes)
              Card(
                child: ListTile(
                  leading: const Icon(Icons.account_balance_wallet_outlined),
                  title: Text(compte.libelle),
                  subtitle: Text(compte.numeroMasque),
                  trailing: Text(
                    '${_amount.format(compte.solde)} F CFA',
                    style: theme.textTheme.titleSmall,
                  ),
                ),
              ),
            const SizedBox(height: 28),
            _DemoOptions(
              theme: _theme,
              onThemeChanged: (t) => setState(() => _theme = t),
              onSimulatePush: () => _openPiSpi(simulatePush: true),
            ),
          ],
        ),
      ),
    );
  }
}

/// Options propres à la démo (absentes d'une vraie application).
class _DemoOptions extends StatelessWidget {
  const _DemoOptions({
    required this.theme,
    required this.onThemeChanged,
    required this.onSimulatePush,
  });

  final Themes? theme;
  final ValueChanged<Themes?> onThemeChanged;
  final VoidCallback onSimulatePush;

  static const _labels = {
    Themes.system: 'Système',
    Themes.light: 'Clair',
    Themes.dark: 'Sombre',
    Themes.yellow: 'Jaune',
    Themes.green: 'Vert',
    Themes.blue: 'Bleu',
    Themes.red: 'Rouge',
    Themes.orange: 'Orange',
    Themes.purple: 'Violet',
    Themes.pink: 'Rose',
  };

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Options de démo', style: textTheme.titleMedium),
            const SizedBox(height: 12),
            DropdownButtonFormField<Themes?>(
              initialValue: theme,
              decoration: const InputDecoration(
                labelText: 'Thème du SDK',
                border: OutlineInputBorder(),
              ),
              items: [
                const DropdownMenuItem(
                  value: null,
                  child: Text('Choix de l\'utilisateur'),
                ),
                for (final entry in _labels.entries)
                  DropdownMenuItem(value: entry.key, child: Text(entry.value)),
              ],
              onChanged: onThemeChanged,
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: onSimulatePush,
              icon: const Icon(Icons.notifications_active_outlined),
              label: const Text('Ouvrir PI-SPI et simuler un push'),
            ),
          ],
        ),
      ),
    );
  }
}
