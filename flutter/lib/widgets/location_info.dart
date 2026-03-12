import 'package:flutter/material.dart';

class LocationInfo extends StatelessWidget {
  final String label;
  final String city;
  const LocationInfo({super.key, required this.label, required this.city});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1)),
        Text(city, style: const TextStyle(fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
      ],
    );
  }
}
