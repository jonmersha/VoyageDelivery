import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/trip.dart';
import '../l10n/translations.dart';
import 'icon_info.dart';
import 'location_info.dart';

class TripCard extends StatelessWidget {
  final Trip trip;
  const TripCard({super.key, required this.trip});

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: const Color(0xFF4F46E5).withOpacity(0.1),
                  child: Text(trip.travelerName[0], style: const TextStyle(color: Color(0xFF4F46E5), fontWeight: FontWeight.bold)),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(trip.travelerName, style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text(AppTranslations.t('traveler', lang), style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(child: LocationInfo(label: AppTranslations.t('from', lang), city: trip.origin)),
                const Icon(LucideIcons.arrowRight, size: 16, color: Color(0xFF4F46E5)),
                Expanded(child: LocationInfo(label: AppTranslations.t('to', lang), city: trip.destination)),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconInfo(icon: LucideIcons.calendar, text: DateFormat('MMM d, yyyy').format(trip.travelDate)),
                IconInfo(icon: LucideIcons.weight, text: trip.capacity),
              ],
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              children: trip.itemTypes.map((type) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF4F46E5).withOpacity(0.05),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFF4F46E5).withOpacity(0.1)),
                ),
                child: Text(type.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5), letterSpacing: 0.5)),
              )).toList(),
            ),
          ],
        ),
      ),
    );
  }
}
