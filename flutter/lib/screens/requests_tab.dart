import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../l10n/translations.dart';
import '../services/firebase_service.dart';
import '../models/delivery_request.dart';
import '../widgets/request_card.dart';
import '../widgets/post_modal.dart';

class RequestsTab extends StatelessWidget {
  final String lang;
  final FirebaseService firebase;
  const RequestsTab({super.key, required this.lang, required this.firebase});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 64),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(AppTranslations.t('deliveryRequests', lang), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              IconButton(onPressed: () => showModalBottomSheet(context: context, isScrollControlled: true, builder: (_) => const PostModal(isTrip: false)), icon: const Icon(LucideIcons.plus)),
            ],
          ),
        ),
        Expanded(
          child: StreamBuilder<List<DeliveryRequest>>(
            stream: firebase.getRequests(),
            builder: (context, snapshot) {
              if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
              final requests = snapshot.data!;
              if (requests.isEmpty) return Center(child: Text(AppTranslations.t('noRequests', lang)));
              return ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: requests.length,
                itemBuilder: (context, i) => RequestCard(request: requests[i]),
              );
            },
          ),
        ),
      ],
    );
  }
}
