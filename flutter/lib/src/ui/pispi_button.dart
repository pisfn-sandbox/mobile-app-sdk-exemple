import 'package:flutter/material.dart';

/// Bouton d'entrée vers PI-SPI, avec le logo officiel.
///
/// Toutes les variantes de couleurs des logos π et PI-SPI sont disponibles
/// ici : https://github.com/pisfn-sandbox/mobile-app-flutter-sdk-assets/tree/main/variante_logo_pi_et_pispi
class PiSpiButton extends StatelessWidget {
  const PiSpiButton({super.key, required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFF5F0E8),
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: onPressed,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
          child: Row(
            children: [
              Image.asset('assets/images/logo_maron_jaune.png', height: 40),
              const Spacer(),
              const Icon(Icons.arrow_forward, color: Color(0xFF542D00)),
            ],
          ),
        ),
      ),
    );
  }
}
