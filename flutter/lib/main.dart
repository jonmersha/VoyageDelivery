import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:voyage_deliver/services/firebase_service.dart';
import 'package:voyage_deliver/l10n/translations.dart';
import 'package:voyage_deliver/screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Note: You must initialize Firebase with your own options locally
  // await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const VoyageDeliverApp());
}

class VoyageDeliverApp extends StatefulWidget {
  const VoyageDeliverApp({super.key});

  @override
  State<VoyageDeliverApp> createState() => _VoyageDeliverAppState();
}

class _VoyageDeliverAppState extends State<VoyageDeliverApp> {
  Locale _locale = const Locale('en');

  void setLocale(Locale locale) {
    setState(() {
      _locale = locale;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => FirebaseService()),
      ],
      child: MaterialApp(
        title: 'VoyageDeliver',
        debugShowCheckedModeBanner: false,
        locale: _locale,
        supportedLocales: const [
          Locale('en'),
          Locale('ar'),
          Locale('am'),
          Locale('om'),
        ],
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF1C1917),
            primary: const Color(0xFF1C1917),
            surface: const Color(0xFFFAFAF9),
          ),
          textTheme: GoogleFonts.interTextTheme(),
          cardTheme: CardTheme(
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: const BorderSide(color: Color(0xFFE7E5E4)),
            ),
            color: Colors.white,
          ),
        ),
        home: HomeScreen(onLocaleChange: setLocale),
      ),
    );
  }
}
