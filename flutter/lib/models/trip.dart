import 'package:cloud_firestore/cloud_firestore.dart';

class Trip {
  final String id;
  final String travelerId;
  final String travelerName;
  final String origin;
  final String destination;
  final DateTime travelDate;
  final String capacity;
  final List<String> itemTypes;
  final String status;

  Trip({
    required this.id,
    required this.travelerId,
    required this.travelerName,
    required this.origin,
    required this.destination,
    required this.travelDate,
    required this.capacity,
    required this.itemTypes,
    required this.status,
  });

  factory Trip.fromMap(String id, Map<String, dynamic> map) {
    return Trip(
      id: id,
      travelerId: map['travelerId'] ?? '',
      travelerName: map['travelerName'] ?? '',
      origin: map['origin'] ?? '',
      destination: map['destination'] ?? '',
      travelDate: (map['travelDate'] as Timestamp).toDate(),
      capacity: map['capacity'] ?? '',
      itemTypes: List<String>.from(map['itemTypes'] ?? []),
      status: map['status'] ?? 'active',
    );
  }
}
