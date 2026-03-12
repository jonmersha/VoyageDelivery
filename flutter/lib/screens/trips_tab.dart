import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../l10n/translations.dart';
import '../services/firebase_service.dart';
import '../models/trip.dart';
import '../widgets/trip_card.dart';

class TripsTab extends StatelessWidget {
  final String lang;
  final FirebaseService firebase;
  const TripsTab({super.key, required this.lang, required this.firebase});

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
              Text(AppTranslations.t('availableTrips', lang), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              IconButton(onPressed: () {}, icon: const Icon(LucideIcons.search)),
            ],
          ),
        ),
        Expanded(
          child: StreamBuilder<List<Trip>>(
            stream: firebase.getTrips(),
            builder: (context, snapshot) {
              if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
              final trips = snapshot.data!;
              if (trips.isEmpty) return Center(child: Text(AppTranslations.t('noTrips', lang)));
              return ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: trips.length,
                itemBuilder: (context, i) => TripCard(trip: trips[i]),
              );
            },
          ),
        ),
      ],
    );
  }
}
