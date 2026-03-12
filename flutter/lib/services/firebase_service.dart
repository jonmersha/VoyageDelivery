import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

class UserProfile {
  final String uid;
  final String? displayName;
  final String? email;
  final String? photoURL;
  final double rating;
  final DateTime createdAt;

  UserProfile({
    required this.uid,
    this.displayName,
    this.email,
    this.photoURL,
    required this.rating,
    required this.createdAt,
  });

  factory UserProfile.fromMap(Map<String, dynamic> map) {
    return UserProfile(
      uid: map['uid'] ?? '',
      displayName: map['displayName'],
      email: map['email'],
      photoURL: map['photoURL'],
      rating: (map['rating'] ?? 5.0).toDouble(),
      createdAt: (map['createdAt'] as Timestamp).toDate(),
    );
  }
}

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

class Item {
  final String name;
  final String description;
  final String? imageUrl;
  final int quantity;

  Item({
    required this.name,
    required this.description,
    this.imageUrl,
    required this.quantity,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'description': description,
      'imageUrl': imageUrl,
      'quantity': quantity,
    };
  }

  factory Item.fromMap(Map<String, dynamic> map) {
    return Item(
      name: map['name'] ?? '',
      description: map['description'] ?? '',
      imageUrl: map['imageUrl'],
      quantity: map['quantity'] ?? 1,
    );
  }
}

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

class FirebaseService extends ChangeNotifier {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  User? get currentUser => _auth.currentUser;

  Stream<List<Trip>> getTrips() {
    return _db
        .collection('trips')
        .where('status', isEqualTo: 'active')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Trip.fromMap(doc.id, doc.data()))
            .toList());
  }

  Stream<List<DeliveryRequest>> getRequests() {
    return _db
        .collection('requests')
        .where('status', isEqualTo: 'pending')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => DeliveryRequest.fromMap(doc.id, doc.data()))
            .toList());
  }

  Future<void> postTrip(Map<String, dynamic> data) async {
    await _db.collection('trips').add({
      ...data,
      'createdAt': FieldValue.serverTimestamp(),
      'status': 'active',
    });
  }

  Future<void> postRequest(Map<String, dynamic> data) async {
    await _db.collection('requests').add({
      ...data,
      'createdAt': FieldValue.serverTimestamp(),
      'status': 'pending',
    });
  }

  Future<void> signIn() async {
    // Implement Google Sign In here
    // For now, we'll just notify listeners
    notifyListeners();
  }

  Future<void> signOut() async {
    await _auth.signOut();
    notifyListeners();
  }
}
