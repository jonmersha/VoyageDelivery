import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:voyage_deliver/l10n/translations.dart';
import 'package:voyage_deliver/services/firebase_service.dart';
import 'package:lucide_icons/lucide_icons.dart';

class HomeScreen extends StatefulWidget {
  final Function(Locale) onLocaleChange;

  const HomeScreen({super.key, required this.onLocaleChange});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    final isRtl = lang == 'ar';

    final List<Widget> pages = [
      _HomeTab(onNavigate: (index) => setState(() => _selectedIndex = index)),
      const _TripsTab(),
      const _RequestsTab(),
      const _ProfileTab(),
    ];

    return Directionality(
      textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        appBar: AppBar(
          title: Text(
            AppTranslations.t('appName', lang),
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          actions: [
            DropdownButton<String>(
              value: lang,
              underline: const SizedBox(),
              items: const [
                DropdownMenuItem(value: 'en', child: Text('EN')),
                DropdownMenuItem(value: 'ar', child: Text('AR')),
                DropdownMenuItem(value: 'am', child: Text('AM')),
                DropdownMenuItem(value: 'om', child: Text('OM')),
              ],
              onChanged: (val) {
                if (val != null) widget.onLocaleChange(Locale(val));
              },
            ),
            const SizedBox(width: 16),
          ],
        ),
        body: pages[_selectedIndex],
        bottomNavigationBar: NavigationBar(
          selectedIndex: _selectedIndex,
          onDestinationSelected: (index) => setState(() => _selectedIndex = index),
          destinations: [
            NavigationDestination(
              icon: const Icon(LucideIcons.home),
              label: AppTranslations.t('appName', lang),
            ),
            NavigationDestination(
              icon: const Icon(LucideIcons.plane),
              label: AppTranslations.t('findTrips', lang),
            ),
            NavigationDestination(
              icon: const Icon(LucideIcons.package),
              label: AppTranslations.t('deliveryRequests', lang),
            ),
            NavigationDestination(
              icon: const Icon(LucideIcons.user),
              label: AppTranslations.t('profile', lang),
            ),
          ],
        ),
        floatingActionButton: _selectedIndex == 1 || _selectedIndex == 2
            ? FloatingActionButton.extended(
                onPressed: () => _showPostModal(context, _selectedIndex == 1),
                label: Text(AppTranslations.t(
                    _selectedIndex == 1 ? 'postTrip' : 'postRequest', lang)),
                icon: const Icon(LucideIcons.plus),
              )
            : null,
      ),
    );
  }

  void _showPostModal(BuildContext context, bool isTrip) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _PostModal(isTrip: isTrip),
    );
  }
}

class _HomeTab extends StatelessWidget {
  final Function(int) onNavigate;

  const _HomeTab({required this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const SizedBox(height: 24),
          Text(
            AppTranslations.t('heroTitle', lang),
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 40, fontWeight: FontWeight.bold, height: 1.1),
          ),
          const SizedBox(height: 16),
          Text(
            AppTranslations.t('heroDesc', lang),
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 16, color: Colors.grey),
          ),
          const SizedBox(height: 40),
          _FeatureCard(
            icon: LucideIcons.plane,
            title: AppTranslations.t('travelEarn', lang),
            color: const Color(0xFF4F46E5),
            onTap: () => onNavigate(1),
          ),
          const SizedBox(height: 16),
          _FeatureCard(
            icon: LucideIcons.package,
            title: AppTranslations.t('fastDelivery', lang),
            color: const Color(0xFFF59E0B),
            onTap: () => onNavigate(2),
          ),
          const SizedBox(height: 16),
          _FeatureCard(
            icon: LucideIcons.shieldCheck,
            title: AppTranslations.t('trustSafety', lang),
            color: const Color(0xFF10B981),
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final VoidCallback onTap;

  const _FeatureCard({
    required this.icon,
    required this.title,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
            const Icon(LucideIcons.chevronRight, color: Colors.grey),
          ],
        ),
      ),
    );
  }
}

class _TripsTab extends StatelessWidget {
  const _TripsTab();

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    final firebase = Provider.of<FirebaseService>(context);

    return StreamBuilder<List<Trip>>(
      stream: firebase.getTrips(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        final trips = snapshot.data ?? [];
        if (trips.isEmpty) {
          return Center(child: Text(AppTranslations.t('noTrips', lang)));
        }
        return ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: trips.length,
          separatorBuilder: (_, __) => const SizedBox(height: 16),
          itemBuilder: (context, index) => _TripCard(trip: trips[index]),
        );
      },
    );
  }
}

class _TripCard extends StatelessWidget {
  final Trip trip;
  const _TripCard({required this.trip});

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                CircleAvatar(backgroundColor: const Color(0xFF4F46E5).withOpacity(0.1), child: Text(trip.travelerName[0])),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(trip.travelerName, style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text(AppTranslations.t('traveler', lang), style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(child: _LocationInfo(label: AppTranslations.t('from', lang), city: trip.origin)),
                const Icon(LucideIcons.arrowRight, size: 16, color: Color(0xFF4F46E5)),
                Expanded(child: _LocationInfo(label: AppTranslations.t('to', lang), city: trip.destination)),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _IconInfo(icon: LucideIcons.calendar, text: DateFormat('MMM d, yyyy').format(trip.travelDate)),
                _IconInfo(icon: LucideIcons.weight, text: trip.capacity),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _RequestsTab extends StatelessWidget {
  const _RequestsTab();

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    final firebase = Provider.of<FirebaseService>(context);

    return StreamBuilder<List<DeliveryRequest>>(
      stream: firebase.getRequests(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        final requests = snapshot.data ?? [];
        if (requests.isEmpty) {
          return Center(child: Text(AppTranslations.t('noRequests', lang)));
        }
        return ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: requests.length,
          separatorBuilder: (_, __) => const SizedBox(height: 16),
          itemBuilder: (context, index) => _RequestCard(request: requests[index]),
        );
      },
    );
  }
}

class _RequestCard extends StatelessWidget {
  final DeliveryRequest request;
  const _RequestCard({required this.request});

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    return Card(
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
                    CircleAvatar(backgroundColor: const Color(0xFFF59E0B).withOpacity(0.1), child: Text(request.requesterName[0])),
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
                decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE2E8F0))),
                child: Row(
                  children: [
                    if (item.imageUrl != null)
                      ClipRRect(borderRadius: BorderRadius.circular(8), child: Image.network(item.imageUrl!, width: 40, height: 40, fit: BoxImage.cover))
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
                Expanded(child: _LocationInfo(label: AppTranslations.t('pickup', lang), city: request.origin)),
                const Icon(LucideIcons.arrowRight, size: 16, color: Color(0xFFF59E0B)),
                Expanded(child: _LocationInfo(label: AppTranslations.t('dropoff', lang), city: request.destination)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileTab extends StatelessWidget {
  const _ProfileTab();

  @override
  Widget build(BuildContext context) {
    final lang = Localizations.localeOf(context).languageCode;
    final firebase = Provider.of<FirebaseService>(context);
    final user = firebase.currentUser;

    if (user == null) {
      return Center(
        child: ElevatedButton(
          onPressed: () => firebase.signIn(),
          child: Text(AppTranslations.t('signIn', lang)),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          CircleAvatar(radius: 60, backgroundImage: NetworkImage(user.photoURL ?? '')),
          const SizedBox(height: 16),
          Text(user.displayName ?? '', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          Text(user.email ?? '', style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 32),
          ListTile(
            leading: const Icon(LucideIcons.logOut, color: Colors.red),
            title: Text(AppTranslations.t('signOut', lang), style: const TextStyle(color: Colors.red)),
            onTap: () => firebase.signOut(),
          ),
        ],
      ),
    );
  }
}

class _LocationInfo extends StatelessWidget {
  final String label;
  final String city;
  const _LocationInfo({required this.label, required this.city});

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

class _IconInfo extends StatelessWidget {
  final IconData icon;
  final String text;
  const _IconInfo({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: const Color(0xFF4F46E5)),
        const SizedBox(width: 8),
        Text(text, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
      ],
    );
  }
}

class _PostModal extends StatefulWidget {
  final bool isTrip;
  const _PostModal({required this.isTrip});

  @override
  State<_PostModal> createState() => _PostModalState();
}

class _PostModalState extends State<_PostModal> {
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
                    color: const Color(0xFFF8FAFC),
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
