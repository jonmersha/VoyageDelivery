import React, { useState, useEffect, useMemo, Component } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Plane, 
  Search, 
  Plus, 
  User, 
  MessageSquare, 
  LogOut, 
  MapPin, 
  Calendar, 
  Weight, 
  DollarSign,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  getDocFromServer
} from './firebase';
import { Trip, DeliveryRequest, UserProfile, OperationType } from './types';
import { cn, handleFirestoreError } from './utils';
import { translations, Language } from './translations';

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<any, any> {
  state: any;
  props: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error.includes("insufficient permissions")) {
          errorMessage = "You don't have permission to perform this action. Please check your account status.";
        }
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-stone-200">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Oops!</h2>
            <p className="text-stone-600 mb-6">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Components ---

const Navbar = ({ user, onLogin, onLogout, setPage, language, setLanguage, t }: { 
  user: any, 
  onLogin: () => void, 
  onLogout: () => void, 
  setPage: (p: string) => void,
  language: Language,
  setLanguage: (l: Language) => void,
  t: (key: keyof typeof translations['en']) => string
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
            <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-main">{t('appName')}</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setPage('trips')} className="text-sm font-medium text-text-muted hover:text-primary transition-colors">{t('findTrips')}</button>
            <button onClick={() => setPage('requests')} className="text-sm font-medium text-text-muted hover:text-primary transition-colors">{t('deliveryRequests')}</button>
            
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-sm font-medium text-text-muted bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary transition-colors"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="am">አማርኛ</option>
              <option value="om">Oromo</option>
            </select>

            {user ? (
              <div className="flex items-center gap-4">
                <button onClick={() => setPage('post-trip')} className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-hover transition-all shadow-md shadow-primary/20">
                  {t('postTrip')}
                </button>
                <div className="h-8 w-px bg-border-subtle" />
                <button onClick={() => setPage('profile')} className="flex items-center gap-2 text-sm font-medium text-text-main">
                  <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-border-subtle" />
                  <span>{user.displayName?.split(' ')[0]}</span>
                </button>
                <button onClick={onLogout} className="p-2 text-text-muted hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={onLogin} className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-hover transition-all shadow-md shadow-primary/20">
                {t('signIn')}
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-sm font-medium text-stone-600 bg-transparent border-none focus:ring-0 cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="am">AM</option>
              <option value="om">OM</option>
            </select>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-stone-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-stone-200 px-4 py-6 flex flex-col gap-4"
          >
            <button onClick={() => { setPage('trips'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">{t('findTrips')}</button>
            <button onClick={() => { setPage('requests'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">{t('deliveryRequests')}</button>
            {user ? (
              <>
                <button onClick={() => { setPage('post-trip'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">{t('postTrip')}</button>
                <button onClick={() => { setPage('post-request'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">{t('postRequest')}</button>
                <button onClick={() => { setPage('profile'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">{t('profile')}</button>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="text-left py-2 font-medium text-red-600">{t('signOut')}</button>
              </>
            ) : (
              <button onClick={() => { onLogin(); setIsOpen(false); }} className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium">{t('signIn')}</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface TripCardProps {
  trip: Trip;
  onAction: (t: Trip) => void;
  key?: React.Key;
  t: (key: keyof typeof translations['en']) => string;
}

const TripCard = ({ trip, onAction, t }: TripCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          {trip.travelerName[0]}
        </div>
        <div>
          <h3 className="font-semibold text-text-main">{trip.travelerName}</h3>
          <p className="text-xs text-text-muted">{t('traveler')}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-secondary">
        <Star className="w-4 h-4 fill-current" />
        <span className="text-sm font-bold">4.9</span>
      </div>
    </div>

    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">{t('from')}</p>
        <p className="font-semibold text-text-main truncate">{trip.origin}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
        <ArrowRight className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">{t('to')}</p>
        <p className="font-semibold text-text-main truncate">{trip.destination}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex items-center gap-2 text-text-muted">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{format(new Date(trip.travelDate), 'MMM d, yyyy')}</span>
      </div>
      <div className="flex items-center gap-2 text-text-muted">
        <Weight className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{trip.capacity}</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-6">
      {trip.itemTypes.map(type => (
        <span key={type} className="px-2 py-1 bg-primary/5 text-primary text-[10px] uppercase tracking-widest font-bold rounded-md border border-primary/10">
          {type}
        </span >
      ))}
    </div>

    <button 
      onClick={() => onAction(trip)}
      className="w-full py-3 bg-primary text-white rounded-xl font-bold transition-all shadow-md shadow-primary/10 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
    >
      {t('requestDelivery')}
    </button>
  </motion.div>
);

interface RequestCardProps {
  request: DeliveryRequest;
  onAction: (r: DeliveryRequest) => void;
  key?: React.Key;
  t: (key: keyof typeof translations['en']) => string;
}

const RequestCard = ({ request, onAction, t }: RequestCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-xl hover:border-secondary/20 transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
          {request.requesterName[0]}
        </div>
        <div>
          <h3 className="font-semibold text-text-main">{request.itemName}</h3>
          <p className="text-xs text-text-muted">{t('by')} {request.requesterName}</p>
        </div>
      </div>
      <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-bold">
        ${request.commission}
      </div>
    </div>

    <p className="text-sm text-text-muted mb-6 line-clamp-2 leading-relaxed">{request.itemDescription}</p>

    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">{t('pickup')}</p>
        <p className="font-semibold text-text-main truncate">{request.origin}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center">
        <ArrowRight className="w-4 h-4 text-secondary" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">{t('dropoff')}</p>
        <p className="font-semibold text-text-main truncate">{request.destination}</p>
      </div>
    </div>

    <div className="flex items-center gap-2 text-text-muted mb-6">
      <Calendar className="w-4 h-4 text-secondary" />
      <span className="text-sm font-medium">{t('deadline')}: {format(new Date(request.deadline), 'MMM d, yyyy')}</span>
    </div>

    <button 
      onClick={() => onAction(request)}
      className="w-full py-3 bg-secondary text-white rounded-xl font-bold transition-all shadow-md shadow-secondary/10 hover:bg-secondary-hover hover:shadow-lg hover:shadow-secondary/20"
    >
      {t('offerToCarry')}
    </button>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState('home');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  // --- Auth & Initial Setup ---

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        // Ensure user profile exists
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: u.uid,
            displayName: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
            createdAt: serverTimestamp(),
            rating: 5.0
          });
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
      setLoading(false);
    });

    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    return () => unsubscribe();
  }, []);

  // --- Data Fetching ---

  useEffect(() => {
    if (!isAuthReady) return;

    const tripsQuery = query(collection(db, 'trips'), where('status', '==', 'active'));
    const unsubTrips = onSnapshot(tripsQuery, (snapshot) => {
      const tripData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
      setTrips(tripData);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'trips'));

    const requestsQuery = query(collection(db, 'requests'), where('status', '==', 'pending'));
    const unsubRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DeliveryRequest));
      setRequests(requestData);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'requests'));

    return () => {
      unsubTrips();
      unsubRequests();
    };
  }, [isAuthReady]);

  // --- Handlers ---

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPage('home');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handlePostTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const tripData = {
      travelerId: user.uid,
      travelerName: user.displayName || 'Anonymous',
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      travelDate: formData.get('date') as string,
      capacity: formData.get('capacity') as string,
      itemTypes: (formData.get('types') as string).split(',').map(s => s.trim()),
      status: 'active',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'trips'), tripData);
      setPage('trips');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'trips');
    }
  };

  const handlePostRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const requestData = {
      requesterId: user.uid,
      requesterName: user.displayName || 'Anonymous',
      itemName: formData.get('itemName') as string,
      itemDescription: formData.get('description') as string,
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      deadline: formData.get('deadline') as string,
      commission: Number(formData.get('commission')),
      status: 'pending',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'requests'), requestData);
      setPage('requests');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'requests');
    }
  };

  // --- Render Helpers ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg-main font-sans text-text-main" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} setPage={setPage} language={language} setLanguage={setLanguage} t={t} />

        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {page === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-24"
              >
                {/* Hero Section */}
                <section className="text-center space-y-8 py-12">
                  <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-main leading-tight"
                  >
                    {t('heroTitle')} <br />
                    <span className="text-primary italic font-serif">{t('heroSubtitle')}</span>
                  </motion.h1>
                  <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                    {t('heroDesc')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setPage('trips')}
                      className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                    >
                      {t('findTraveler')} <ArrowRight className={cn("w-5 h-5", language === 'ar' && "rotate-180")} />
                    </button>
                    <button 
                      onClick={() => setPage('post-trip')}
                      className="px-8 py-4 bg-white text-text-main border border-border-subtle rounded-2xl font-bold text-lg hover:bg-bg-main transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      {t('postYourTrip')} <Plus className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                </section>

                {/* Features */}
                <section className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: Plane, title: t('travelEarn'), desc: t('travelEarnDesc'), color: 'bg-primary' },
                    { icon: Package, title: t('fastDelivery'), desc: t('fastDeliveryDesc'), color: 'bg-secondary' },
                    { icon: CheckCircle2, title: t('trustSafety'), desc: t('trustSafetyDesc'), color: 'bg-accent' }
                  ].map((f, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-border-subtle shadow-sm space-y-4 hover:shadow-md transition-all">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", f.color)}>
                        <f.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-text-main">{f.title}</h3>
                      <p className="text-text-muted leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </section>
              </motion.div>
            )}

            {page === 'trips' && (
              <motion.div 
                key="trips"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-text-main">{t('availableTrips')}</h2>
                    <p className="text-text-muted">{t('findHeading')}</p>
                  </div>
                  <div className="relative w-full md:w-96">
                    <Search className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted", language === 'ar' ? "right-4" : "left-4")} />
                    <input 
                      type="text" 
                      placeholder={t('searchPlaceholder')} 
                      className={cn("w-full py-3 bg-white border border-border-subtle rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm", language === 'ar' ? "pr-12 pl-4" : "pl-12 pr-4")}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip, idx) => (
                    <TripCard key={trip.id || idx} trip={trip} onAction={() => setPage('post-request')} t={t} />
                  ))}
                  {trips.length === 0 && (
                    <div className="col-span-full py-24 text-center space-y-4 bg-white rounded-3xl border border-dashed border-border-subtle">
                      <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto">
                        <Plane className="w-8 h-8 text-text-muted" />
                      </div>
                      <p className="text-text-muted font-medium">{t('noTrips')}</p>
                      <button onClick={() => setPage('post-trip')} className="text-primary font-bold hover:underline">{t('postTrip')}</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {page === 'requests' && (
              <motion.div 
                key="requests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-text-main">{t('deliveryRequests')}</h2>
                    <p className="text-text-muted">{t('fastDeliveryDesc')}</p>
                  </div>
                  <button 
                    onClick={() => setPage('post-request')}
                    className="px-6 py-3 bg-secondary text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-secondary/20 hover:bg-secondary-hover transition-all"
                  >
                    <Plus className="w-5 h-5" /> {t('postRequest')}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requests.map((request, idx) => (
                    <RequestCard key={request.id || idx} request={request} onAction={() => {}} t={t} />
                  ))}
                  {requests.length === 0 && (
                    <div className="col-span-full py-24 text-center space-y-4 bg-white rounded-3xl border border-dashed border-border-subtle">
                      <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto">
                        <Package className="w-8 h-8 text-text-muted" />
                      </div>
                      <p className="text-text-muted font-medium">{t('noRequests')}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {page === 'post-trip' && (
              <motion.div 
                key="post-trip"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-border-subtle shadow-xl"
              >
                <h2 className="text-3xl font-bold mb-8 text-text-main">{t('postTravelRoute')}</h2>
                <form onSubmit={handlePostTrip} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('originCity')}</label>
                      <input name="origin" required placeholder="e.g. London" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('destinationCity')}</label>
                      <input name="destination" required placeholder="e.g. New York" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('travelDate')}</label>
                      <input name="date" type="date" required className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('capacity')}</label>
                      <select name="capacity" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="Small">{t('small')}</option>
                        <option value="Medium">{t('medium')}</option>
                        <option value="Large">{t('large')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('itemTypes')}</label>
                    <input name="types" placeholder="e.g. Documents, Electronics, Gifts" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">
                    {t('publishTrip')}
                  </button>
                </form>
              </motion.div>
            )}

            {page === 'post-request' && (
              <motion.div 
                key="post-request"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-border-subtle shadow-xl"
              >
                <h2 className="text-3xl font-bold mb-8 text-text-main">{t('requestDeliveryTitle')}</h2>
                <form onSubmit={handlePostRequest} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('itemName')}</label>
                    <input name="itemName" required placeholder="e.g. MacBook Charger" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('description')}</label>
                    <textarea name="description" rows={3} placeholder="Tell the traveler about the item..." className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('pickupFrom')}</label>
                      <input name="origin" required placeholder="City" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('deliverTo')}</label>
                      <input name="destination" required placeholder="City" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('deadline')}</label>
                      <input name="deadline" type="date" required className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('commission')}</label>
                      <input name="commission" type="number" required placeholder="e.g. 25" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-secondary text-white rounded-2xl font-bold text-lg hover:bg-secondary-hover transition-all shadow-lg shadow-secondary/20">
                    {t('postRequestBtn')}
                  </button>
                </form>
              </motion.div>
            )}

            {page === 'profile' && user && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                <div className="bg-white rounded-3xl p-12 border border-border-subtle shadow-sm flex flex-col md:flex-row items-center gap-12">
                  <div className="relative">
                    <img src={user.photoURL || ''} alt="" className="w-48 h-48 rounded-full border-8 border-bg-main shadow-inner object-cover" />
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-accent rounded-full border-4 border-white flex items-center justify-center text-white">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-4xl font-extrabold text-text-main">{user.displayName}</h2>
                    <p className="text-text-muted font-medium">{user.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-1 text-secondary">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                      </div>
                      <span className="text-text-muted font-bold">5.0 <span className="font-normal text-stone-400">(0 reviews)</span></span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                      <Plane className="w-5 h-5 text-primary" /> {t('yourActiveTrips')}
                    </h3>
                    {trips.filter(t => t.travelerId === user.uid).map((trip, idx) => (
                      <TripCard key={trip.id || idx} trip={trip} onAction={() => {}} t={t} />
                    ))}
                    {trips.filter(t => t.travelerId === user.uid).length === 0 && (
                      <div className="p-8 bg-white rounded-2xl border border-dashed border-border-subtle text-center">
                        <p className="text-text-muted italic">{t('noActiveTrips')}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                      <Package className="w-5 h-5 text-secondary" /> {t('yourRequests')}
                    </h3>
                    {requests.filter(r => r.requesterId === user.uid).map((request, idx) => (
                      <RequestCard key={request.id || idx} request={request} onAction={() => {}} t={t} />
                    ))}
                    {requests.filter(r => r.requesterId === user.uid).length === 0 && (
                      <div className="p-8 bg-white rounded-2xl border border-dashed border-border-subtle text-center">
                        <p className="text-text-muted italic">{t('noActiveRequests')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-border-subtle py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <div className="bg-primary p-1.5 rounded-md">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-text-main">{t('appName')}</span>
            </div>
            <div className="flex justify-center gap-8 text-sm font-medium text-text-muted">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
            </div>
            <p className="text-text-muted text-xs">© 2026 {t('appName')}. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
