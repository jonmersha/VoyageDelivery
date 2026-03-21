import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../l10n/translations.dart';
import '../services/firebase_service.dart';
import '../models/trip.dart';
import '../models/delivery_request.dart';

class ProfileTab extends StatelessWidget {
  final String lang;
  final FirebaseService firebase;
  final Function(Locale) onLocaleChange;
  const ProfileTab({super.key, required this.lang, required this.firebase, required this.onLocaleChange});

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
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              StreamBuilder<List<Trip>>(
                stream: firebase.getUserTrips(user.uid),
                builder: (context, snapshot) {
                  final count = snapshot.data?.length ?? 0;
                  return _StatItem(
                    label: AppTranslations.t('yourActiveTrips', lang),
                    value: count.toString(),
                    color: const Color(0xFF4F46E5),
                  );
                },
              ),
              const SizedBox(width: 40),
              StreamBuilder<List<DeliveryRequest>>(
                stream: firebase.getUserRequests(user.uid),
                builder: (context, snapshot) {
                  final count = snapshot.data?.length ?? 0;
                  return _StatItem(
                    label: AppTranslations.t('yourRequests', lang),
                    value: count.toString(),
                    color: const Color(0xFFF59E0B),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 32),
          const Divider(),
          ListTile(
            leading: const Icon(LucideIcons.languages),
            title: const Text('Language / ቋንቋ / اللغة'),
            trailing: DropdownButton<String>(
              value: lang,
              underline: const SizedBox(),
              items: const [
                DropdownMenuItem(value: 'en', child: Text('English')),
                DropdownMenuItem(value: 'ar', child: Text('العربية')),
                DropdownMenuItem(value: 'am', child: Text('አማርኛ')),
                DropdownMenuItem(value: 'om', child: Text('Oromoo')),
              ],
              onChanged: (val) {
                if (val != null) onLocaleChange(Locale(val));
              },
            ),
          ),
          ListTile(leading: const Icon(LucideIcons.logOut, color: Colors.red), title: Text(AppTranslations.t('signOut', lang), style: const TextStyle(color: Colors.red)), onTap: () => firebase.signOut()),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatItem({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 28, fontWeight: FontWeight.black, color: color)),
        Text(label.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: Colors.grey)),
      ],
    );
  }
}
