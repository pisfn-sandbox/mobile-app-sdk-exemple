import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';

/// Vérification renforcée (« step-up ») demandée par le SDK avant chaque
/// action sensible (confirmer une transaction, supprimer un alias...).
///
/// Le SDK ne voit jamais le secret : il attend seulement un booléen.
/// Ici : biométrie de l'appareil si elle est disponible, sinon un code PIN
/// (simulé : le code de démo est [demoPin]).
class StepUpAuth {
  StepUpAuth({LocalAuthentication? localAuth})
      : _localAuth = localAuth ?? LocalAuthentication();

  final LocalAuthentication _localAuth;

  /// Code PIN accepté par la démo. En réel, le PIN est vérifié par votre
  /// backend (jamais stocké en clair dans l'application).
  static const demoPin = '1234';

  Future<bool> verify(BuildContext context) async {
    if (await _canUseBiometrics()) {
      try {
        return await _localAuth.authenticate(
          localizedReason: 'Confirmez votre identité pour valider l\'opération',
        );
      } on LocalAuthException catch (e) {
        debugPrint('[StepUp] biométrie indisponible (${e.code}), repli sur le PIN');
      }
    }
    if (!context.mounted) return false;
    return await PinDialog.show(context) ?? false;
  }

  Future<bool> _canUseBiometrics() async {
    try {
      return await _localAuth.isDeviceSupported() &&
          (await _localAuth.getAvailableBiometrics()).isNotEmpty;
    } catch (_) {
      return false;
    }
  }
}

/// Saisie d'un code PIN à 4 chiffres (repli quand la biométrie n'est pas
/// disponible).
class PinDialog extends StatefulWidget {
  const PinDialog({super.key});

  static Future<bool?> show(BuildContext context) => showDialog<bool>(
        context: context,
        barrierDismissible: false,
        builder: (_) => const PinDialog(),
      );

  @override
  State<PinDialog> createState() => _PinDialogState();
}

class _PinDialogState extends State<PinDialog> {
  final _controller = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    if (_controller.text == StepUpAuth.demoPin) {
      Navigator.of(context).pop(true);
    } else {
      setState(() => _error = 'Code incorrect');
      _controller.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Code PIN'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Saisissez votre code pour confirmer l\'opération.'),
          const SizedBox(height: 4),
          Text(
            'Démo : ${StepUpAuth.demoPin}',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _controller,
            autofocus: true,
            obscureText: true,
            maxLength: 4,
            keyboardType: TextInputType.number,
            textAlign: TextAlign.center,
            decoration: InputDecoration(errorText: _error, counterText: ''),
            onSubmitted: (_) => _submit(),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: const Text('Annuler'),
        ),
        FilledButton(onPressed: _submit, child: const Text('Valider')),
      ],
    );
  }
}
