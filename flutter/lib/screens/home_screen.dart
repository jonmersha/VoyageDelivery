import 'package:flutter/material.dart';
import 'package:voyage_deliver/l10n/translations.dart';

class HomeScreen extends StatelessWidget {
  final Function(Locale) onLocaleChange;

  const HomeScreen({super.key, required this.onLocaleChange});

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    final isRtl = lang == 'ar';

    return Directionality(
      textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        appBar: AppBar(
          title: Text(AppTranslations.t('appName', lang), style: const TextStyle(fontWeight: FontWeight.bold)),
          actions: [
            DropdownButton<String>(
              value: lang,
              underline: const SizedBox(),
              items: const [
                DropdownMenuItem(value: 'en', child: Text('EN')),
                DropdownMenuItem(value: 'ar', child: Text('AR')),
                DropdownMenuItem(value: 'am', child: Text('AM')),
                DropdownMenuItem(value: 'om', child: Text('OM')),
              ],
              onChanged: (val) {
                if (val != null) onLocaleChange(Locale(val));
              },
            ),
            const SizedBox(width: 16),
          ],
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 48),
              Text(
                AppTranslations.t('heroTitle', lang),
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, height: 1.1),
              ),
              const SizedBox(height: 16),
              Text(
                AppTranslations.t('heroDesc', lang),
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 18, color: Colors.grey),
              ),
              const SizedBox(height: 48),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 64),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 8,
                  shadowColor: Theme.of(context).colorScheme.primary.withOpacity(0.4),
                ),
                child: Text(AppTranslations.t('findTraveler', lang), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 64),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  side: BorderSide(color: Theme.of(context).colorScheme.primary.withOpacity(0.2), width: 2),
                ),
                child: Text(AppTranslations.t('postTrip', lang), style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.primary)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
