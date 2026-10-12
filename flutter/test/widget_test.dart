import 'package:flutter_test/flutter_test.dart';
import 'package:pispi_sdk_exemple/main.dart';

void main() {
  testWidgets('affiche l\'écran de connexion au lancement', (tester) async {
    await tester.pumpWidget(const ExampleApp());
    await tester.pumpAndSettle();
    expect(find.text('Se connecter'), findsOneWidget);
  });

  testWidgets('la connexion mène à l\'accueil avec le bouton PI-SPI', (tester) async {
    await tester.pumpWidget(const ExampleApp());
    await tester.tap(find.text('Se connecter'));
    await tester.pumpAndSettle(const Duration(seconds: 1));
    expect(find.text('Bonjour Awa'), findsOneWidget);
    expect(find.text('Mes comptes'), findsOneWidget);
  });
}
