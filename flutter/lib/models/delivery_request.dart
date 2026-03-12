import 'package:cloud_firestore/cloud_firestore.dart';
import 'item.dart';

class DeliveryRequest {
  final String id;
  final String requesterId;
  final String requesterName;
  final List<Item> items;
  final String origin;
  final String destination;
  final DateTime deadline;
  final double commission;
  final String status;

  DeliveryRequest({
    required this.id,
    required this.requesterId,
    required this.requesterName,
    required this.items,
    required this.origin,
    required this.destination,
    required this.deadline,
    required this.commission,
    required this.status,
  });

  factory DeliveryRequest.fromMap(String id, Map<String, dynamic> map) {
    return DeliveryRequest(
      id: id,
      requesterId: map['requesterId'] ?? '',
      requesterName: map['requesterName'] ?? '',
      items: (map['items'] as List<dynamic>?)
              ?.map((i) => Item.fromMap(i as Map<String, dynamic>))
              .toList() ??
          [],
      origin: map['origin'] ?? '',
      destination: map['destination'] ?? '',
      deadline: (map['deadline'] as Timestamp).toDate(),
      commission: (map['commission'] ?? 0).toDouble(),
      status: map['status'] ?? 'pending',
    );
  }
}
