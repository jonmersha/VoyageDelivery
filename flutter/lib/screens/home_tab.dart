import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../l10n/translations.dart';
import '../widgets/feature_card.dart';
import '../widgets/post_modal.dart';

class HomeTab extends StatelessWidget {
  final String lang;
  const HomeTab({super.key, required this.lang});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 48),
          Text(AppTranslations.t('heroTitle', lang), style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, height: 1.2)),
          Text(AppTranslations.t('heroSubtitle', lang), style: const TextStyle(fontSize: 24, color: Color(0xFF4F46E5), fontStyle: FontStyle.italic)),
          const SizedBox(height: 16),
          Text(AppTranslations.t('heroDesc', lang), style: const TextStyle(fontSize: 16, color: Colors.grey)),
          const SizedBox(height: 40),
          FeatureCard(
            icon: LucideIcons.plane,
            title: AppTranslations.t('postYourTrip', lang),
            color: const Color(0xFF4F46E5),
            onTap: () => showModalBottomSheet(context: context, isScrollControlled: true, builder: (_) => const PostModal(isTrip: true)),
          ),
          const SizedBox(height: 16),
          FeatureCard(
            icon: LucideIcons.package,
            title: AppTranslations.t('postRequest', lang),
            color: const Color(0xFFF59E0B),
            onTap: () => showModalBottomSheet(context: context, isScrollControlled: true, builder: (_) => const PostModal(isTrip: false)),
          ),
        ],
      ),
    );
  }
}
