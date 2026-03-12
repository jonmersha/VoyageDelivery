import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/delivery_request.dart';
import '../l10n/translations.dart';
import 'location_info.dart';

class RequestCard extends StatelessWidget {
  final DeliveryRequest request;
  const RequestCard({super.key, required this.request});

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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: const Color(0xFFF59E0B).withOpacity(0.1),
                      child: Text(request.requesterName[0], style: const TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          request.items.isNotEmpty ? "${request.items[0].name}${request.items.length > 1 ? ' +${request.items.length - 1}' : ''}" : "",
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Text("${AppTranslations.t('by', lang)} ${request.requesterName}", style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                  child: Text("\$${request.commission}", style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...request.items.take(2).map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    if (item.imageUrl != null && item.imageUrl!.isNotEmpty)
                      ClipRRect(borderRadius: BorderRadius.circular(8), child: Image.network(item.imageUrl!, width: 40, height: 40, fit: BoxFit.cover))
                    else
                      Container(width: 40, height: 40, decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(8)), child: const Icon(LucideIcons.package, size: 20, color: Colors.grey)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          Text(item.description, style: const TextStyle(fontSize: 12, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis),
                        ],
                      ),
                    ),
                    Text("x${item.quantity}", style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFF59E0B))),
                  ],
                ),
              ),
            )),
            if (request.items.length > 2)
              Center(child: Text("+${request.items.length - 2} ${AppTranslations.t('items', lang)}...", style: const TextStyle(fontSize: 12, color: Colors.grey))),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: LocationInfo(label: AppTranslations.t('pickup', lang), city: request.origin)),
                const Icon(LucideIcons.arrowRight, size: 16, color: Color(0xFFF59E0B)),
                Expanded(child: LocationInfo(label: AppTranslations.t('dropoff', lang), city: request.destination)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
