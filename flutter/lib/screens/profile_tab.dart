import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../l10n/translations.dart';
import '../services/firebase_service.dart';

class ProfileTab extends StatelessWidget {
  final String lang;
  final FirebaseService firebase;
  const ProfileTab({super.key, required this.lang, required this.firebase});

  @override
  Widget build(BuildContext context) {
    final user = firebase.currentUser;
    if (user == null) return Center(child: ElevatedButton(onPressed: () => firebase.signIn(), child: Text(AppTranslations.t('signIn', lang))));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const SizedBox(height: 48),
          CircleAvatar(radius: 60, backgroundImage: user.photoURL != null ? NetworkImage(user.photoURL!) : null),
          const SizedBox(height: 16),
          Text(user.displayName ?? 'Anonymous', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          Text(user.email ?? '', style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 32),
          ListTile(leading: const Icon(LucideIcons.logOut, color: Colors.red), title: Text(AppTranslations.t('signOut', lang), style: const TextStyle(color: Colors.red)), onTap: () => firebase.signOut()),
        ],
      ),
    );
  }
}
