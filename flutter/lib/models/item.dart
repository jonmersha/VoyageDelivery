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
