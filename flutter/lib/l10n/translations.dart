class AppTranslations {
  static String t(String key, String lang) {
    return _data[lang]?[key] ?? _data['en']?[key] ?? key;
  }

  static final Map<String, Map<String, String>> _data = {
    'en': {
      'appName': "VoyageDeliver",
      'findTrips': "Find Trips",
      'deliveryRequests': "Delivery Requests",
      'postTrip': "Post Trip",
      'signIn': "Sign In",
      'heroTitle': "Logistics, Human-Powered.",
      'heroDesc': "Connect with travelers to send items anywhere in the world.",
      'findTraveler': "Find a Traveler",
      'traveler': "Traveler",
      'from': "From",
      'to': "To",
      'capacity': "Capacity",
      'requestDelivery': "Request Delivery",
    },
    'ar': {
      'appName': "فوياج ديليفر",
      'findTrips': "البحث عن رحلات",
      'deliveryRequests': "طلبات التوصيل",
      'postTrip': "نشر رحلة",
      'signIn': "تسجيل الدخول",
      'heroTitle': "الخدمات اللوجستية، بلمسة إنسانية.",
      'heroDesc': "تواصل مع المسافرين لإرسال العناصر إلى أي مكان في العالم.",
      'findTraveler': "ابحث عن مسافر",
      'traveler': "مسافر",
      'from': "من",
      'to': "إلى",
      'capacity': "السعة",
      'requestDelivery': "طلب توصيل",
    },
    'am': {
      'appName': "ቮያጅ ዴሊቨር",
      'findTrips': "ጉዞዎችን ፈልግ",
      'deliveryRequests': "የማድረስ ጥያቄዎች",
      'postTrip': "ጉዞ መዝግብ",
      'signIn': "ግባ",
      'heroTitle': "ሎጅስቲክስ፣ በሰው ኃይል የሚመራ።",
      'heroDesc': "ዕቃዎችን ወደ የትኛውም የዓለም ክፍል ለመላክ ከመንገደኞች ጋር ይገናኙ።",
      'findTraveler': "መንገደኛ ፈልግ",
      'traveler': "መንገደኛ",
      'from': "ከ",
      'to': "ወደ",
      'capacity': "አቅም",
      'requestDelivery': "ማድረስ ይጠይቁ",
    },
    'om': {
      'appName': "VoyageDeliver",
      'findTrips': "Imala Barbaadi",
      'deliveryRequests': "Gaaffii Geessituu",
      'postTrip': "Imala Galmeessi",
      'signIn': "Seeni",
      'heroTitle': "Loojistiiksii, Humna Namaatiin.",
      'heroDesc': "Meeshaalee gara addunyaa kamittuu erguuf imaltoota waliin wal qunnamaa.",
      'findTraveler': "Imaltuu Barbaadi",
      'traveler': "Imaltuu",
      'from': "Irraa",
      'to': "Gara",
      'capacity': "Hamma",
      'requestDelivery': "Geessituu Gaafadhu",
    }
  };
}
