import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import '../models/trip.dart';
import '../models/delivery_request.dart';
import '../models/user_profile.dart';

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

  Future<void> acceptRequest(String requestId) async {
    if (currentUser == null) return;
    await _db.collection('requests').doc(requestId).update({
      'status': 'accepted',
      'acceptedBy': currentUser!.uid,
      'acceptedByName': currentUser!.displayName,
      'acceptedAt': FieldValue.serverTimestamp(),
    });
  }

  Future<void> joinTrip(String tripId) async {
    if (currentUser == null) return;
    await _db.collection('trips').doc(tripId).update({
      'participants': FieldValue.arrayUnion([currentUser!.uid]),
    });
  }

  Future<void> signIn() async {
    // Google Sign In implementation would go here
    notifyListeners();
  }

  Future<void> signOut() async {
    await _auth.signOut();
    notifyListeners();
  }
}
