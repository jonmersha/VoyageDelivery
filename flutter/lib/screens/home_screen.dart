import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../l10n/translations.dart';
import '../services/firebase_service.dart';
import 'home_tab.dart';
import 'trips_tab.dart';
import 'requests_tab.dart';
import 'profile_tab.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    final firebase = Provider.of<FirebaseService>(context);

    final List<Widget> tabs = [
      HomeTab(lang: lang),
      TripsTab(lang: lang, firebase: firebase),
      RequestsTab(lang: lang, firebase: firebase),
      ProfileTab(lang: lang, firebase: firebase),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: IndexedStack(index: _selectedIndex, children: tabs),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (i) => setState(() => _selectedIndex = i),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF4F46E5),
        unselectedItemColor: Colors.grey,
        items: [
          BottomNavigationBarItem(icon: const Icon(LucideIcons.home), label: AppTranslations.t('home', lang)),
          BottomNavigationBarItem(icon: const Icon(LucideIcons.plane), label: AppTranslations.t('trips', lang)),
          BottomNavigationBarItem(icon: const Icon(LucideIcons.package), label: AppTranslations.t('requests', lang)),
          BottomNavigationBarItem(icon: const Icon(LucideIcons.user), label: AppTranslations.t('profile', lang)),
        ],
      ),
    );
  }
}
