import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../l10n/translations.dart';
import '../services/firebase_service.dart';

class PostModal extends StatefulWidget {
  final bool isTrip;
  const PostModal({super.key, required this.isTrip});

  @override
  State<PostModal> createState() => _PostModalState();
}

class _PostModalState extends State<PostModal> {
  final _formKey = GlobalKey<FormState>();
  final _originController = TextEditingController();
  final _destController = TextEditingController();
  final _dateController = TextEditingController();
  final _capacityController = TextEditingController(text: 'Small');
  final _typesController = TextEditingController();
  final _commissionController = TextEditingController();

  List<Map<String, dynamic>> _items = [{'name': '', 'description': '', 'quantity': 1, 'imageUrl': ''}];

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    final firebase = Provider.of<FirebaseService>(context, listen: false);

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(32))),
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(AppTranslations.t(widget.isTrip ? 'postTravelRoute' : 'requestDeliveryTitle', lang), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.x)),
                ],
              ),
              const SizedBox(height: 24),
              if (!widget.isTrip) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(AppTranslations.t('items', lang), style: const TextStyle(fontWeight: FontWeight.bold)),
                    TextButton.icon(
                      onPressed: () => setState(() => _items.add({'name': '', 'description': '', 'quantity': 1, 'imageUrl': ''})),
                      icon: const Icon(LucideIcons.plus, size: 16),
                      label: Text(AppTranslations.t('addItem', lang)),
                    ),
                  ],
                ),
                ..._items.asMap().entries.map((entry) {
                  int idx = entry.key;
                  return Card(
                    margin: const EdgeInsets.only(bottom: 16),
                    elevation: 0,
                    color: const Color(0xFFF8FAFC),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: Color(0xFFE2E8F0))),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                flex: 2,
                                child: TextFormField(
                                  decoration: InputDecoration(labelText: AppTranslations.t('itemName', lang)),
                                  onChanged: (v) => _items[idx]['name'] = v,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: TextFormField(
                                  decoration: InputDecoration(labelText: AppTranslations.t('quantity', lang)),
                                  keyboardType: TextInputType.number,
                                  initialValue: '1',
                                  onChanged: (v) => _items[idx]['quantity'] = int.tryParse(v) ?? 1,
                                ),
                              ),
                            ],
                          ),
                          TextFormField(
                            decoration: InputDecoration(labelText: AppTranslations.t('description', lang)),
                            onChanged: (v) => _items[idx]['description'] = v,
                          ),
                          TextFormField(
                            decoration: InputDecoration(labelText: AppTranslations.t('imageUrl', lang)),
                            onChanged: (v) => _items[idx]['imageUrl'] = v,
                          ),
                          if (_items.length > 1)
                            Align(
                              alignment: Alignment.centerRight,
                              child: TextButton(
                                onPressed: () => setState(() => _items.removeAt(idx)),
                                child: Text(AppTranslations.t('removeItem', lang), style: const TextStyle(color: Colors.red)),
                              ),
                            ),
                        ],
                      ),
                    ),
                  );
                }),
                const Divider(height: 48),
              ],
              TextFormField(controller: _originController, decoration: InputDecoration(labelText: AppTranslations.t('originCity', lang))),
              TextFormField(controller: _destController, decoration: InputDecoration(labelText: AppTranslations.t('destinationCity', lang))),
              TextFormField(
                controller: _dateController,
                readOnly: true,
                decoration: InputDecoration(labelText: AppTranslations.t(widget.isTrip ? 'travelDate' : 'deadline', lang)),
                onTap: () async {
                  DateTime? picked = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)));
                  if (picked != null) _dateController.text = DateFormat('yyyy-MM-dd').format(picked);
                },
              ),
              if (widget.isTrip) ...[
                DropdownButtonFormField<String>(
                  value: _capacityController.text,
                  decoration: InputDecoration(labelText: AppTranslations.t('capacity', lang)),
                  items: ['Small', 'Medium', 'Large'].map((s) => DropdownMenuItem(value: s, child: Text(AppTranslations.t(s.toLowerCase(), lang)))).toList(),
                  onChanged: (v) => _capacityController.text = v!,
                ),
                TextFormField(controller: _typesController, decoration: InputDecoration(labelText: AppTranslations.t('itemTypes', lang))),
              ] else ...[
                TextFormField(controller: _commissionController, decoration: InputDecoration(labelText: AppTranslations.t('commission', lang)), keyboardType: TextInputType.number),
              ],
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    if (widget.isTrip) {
                      await firebase.postTrip({
                        'travelerId': firebase.currentUser?.uid,
                        'travelerName': firebase.currentUser?.displayName,
                        'origin': _originController.text,
                        'destination': _destController.text,
                        'travelDate': DateTime.parse(_dateController.text),
                        'capacity': _capacityController.text,
                        'itemTypes': _typesController.text.split(',').map((e) => e.trim()).toList(),
                      });
                    } else {
                      await firebase.postRequest({
                        'requesterId': firebase.currentUser?.uid,
                        'requesterName': firebase.currentUser?.displayName,
                        'items': _items.where((i) => i['name'].isNotEmpty).toList(),
                        'origin': _originController.text,
                        'destination': _destController.text,
                        'deadline': DateTime.parse(_dateController.text),
                        'commission': double.tryParse(_commissionController.text) ?? 0,
                      });
                    }
                    Navigator.pop(context);
                  }
                },
                style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 56)),
                child: Text(AppTranslations.t(widget.isTrip ? 'publishTrip' : 'postRequestBtn', lang)),
              ),
              const SizedBox(height: 48),
            ],
          ),
        ),
      ),
    );
  }
}
