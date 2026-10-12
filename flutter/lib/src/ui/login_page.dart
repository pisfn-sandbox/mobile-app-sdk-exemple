import 'package:flutter/material.dart';

import '../auth/session_controller.dart';
import '../config/app_env.dart';

/// Connexion à l'application hôte (simulée). Le SDK PI-SPI ne s'ouvre
/// qu'une fois l'utilisateur connecté ici.
class LoginPage extends StatefulWidget {
  const LoginPage({super.key, required this.session});

  final SessionController session;

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _multiComptes = false;
  bool _loading = false;

  Future<void> _login() async {
    setState(() => _loading = true);
    try {
      await widget.session.login(multiComptes: _multiComptes);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const SizedBox(height: 48),
            Icon(Icons.account_balance, size: 56, color: theme.colorScheme.primary),
            const SizedBox(height: 16),
            Text(AppEnv.appName, style: theme.textTheme.headlineMedium),
            const SizedBox(height: 8),
            Text(
              'Application hôte d\'exemple pour le SDK PI-SPI.',
              style: theme.textTheme.bodyMedium,
            ),
            const SizedBox(height: 40),
            TextFormField(
              initialValue: 'awa.diop',
              decoration: const InputDecoration(
                labelText: 'Identifiant',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              initialValue: 'motdepasse',
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Mot de passe',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Connexion simulée : aucun identifiant n\'est nécessaire.',
              style: theme.textTheme.bodySmall,
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Client avec plusieurs comptes'),
              subtitle: const Text('Le SDK propose alors de choisir le compte'),
              value: _multiComptes,
              onChanged: (v) => setState(() => _multiComptes = v),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _loading ? null : _login,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 14),
                child: _loading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Se connecter'),
              ),
            ),
            const SizedBox(height: 24),
            if (AppEnv.demoMode)
              Text(
                'Mode démo : le SDK n\'appelle aucun backend.',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodySmall,
              ),
          ],
        ),
      ),
    );
  }
}
