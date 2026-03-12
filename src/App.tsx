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

const Navbar = ({ user, onLogin, onLogout, setPage }: { user: any, onLogin: () => void, onLogout: () => void, setPage: (p: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
            <div className="bg-stone-900 p-2 rounded-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">VoyageDeliver</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setPage('trips')} className="text-sm font-medium text-stone-600 hover:text-stone-900">Find Trips</button>
            <button onClick={() => setPage('requests')} className="text-sm font-medium text-stone-600 hover:text-stone-900">Delivery Requests</button>
            {user ? (
              <div className="flex items-center gap-4">
                <button onClick={() => setPage('post-trip')} className="px-4 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-all">
                  Post Trip
                </button>
                <div className="h-8 w-px bg-stone-200" />
                <button onClick={() => setPage('profile')} className="flex items-center gap-2 text-sm font-medium text-stone-900">
                  <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-stone-200" />
                  <span>{user.displayName?.split(' ')[0]}</span>
                </button>
                <button onClick={onLogout} className="p-2 text-stone-400 hover:text-stone-900">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={onLogin} className="px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-all">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
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
            <button onClick={() => { setPage('trips'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">Find Trips</button>
            <button onClick={() => { setPage('requests'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">Delivery Requests</button>
            {user ? (
              <>
                <button onClick={() => { setPage('post-trip'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">Post Trip</button>
                <button onClick={() => { setPage('post-request'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">Post Request</button>
                <button onClick={() => { setPage('profile'); setIsOpen(false); }} className="text-left py-2 font-medium text-stone-900">Profile</button>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="text-left py-2 font-medium text-red-600">Sign Out</button>
              </>
            ) : (
              <button onClick={() => { onLogin(); setIsOpen(false); }} className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium">Sign In</button>
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
}

const TripCard = ({ trip, onAction }: TripCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold">
          {trip.travelerName[0]}
        </div>
        <div>
          <h3 className="font-semibold text-stone-900">{trip.travelerName}</h3>
          <p className="text-xs text-stone-500">Traveler</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-amber-500">
        <Star className="w-4 h-4 fill-current" />
        <span className="text-sm font-medium">4.9</span>
      </div>
    </div>

    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider text-stone-400 font-bold mb-1">From</p>
        <p className="font-medium text-stone-900 truncate">{trip.origin}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-stone-300" />
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider text-stone-400 font-bold mb-1">To</p>
        <p className="font-medium text-stone-900 truncate">{trip.destination}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex items-center gap-2 text-stone-600">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">{format(new Date(trip.travelDate), 'MMM d, yyyy')}</span>
      </div>
      <div className="flex items-center gap-2 text-stone-600">
        <Weight className="w-4 h-4" />
        <span className="text-sm">{trip.capacity}</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-6">
      {trip.itemTypes.map(type => (
        <span key={type} className="px-2 py-1 bg-stone-50 text-stone-600 text-[10px] uppercase tracking-widest font-bold rounded border border-stone-100">
          {type}
        </span >
      ))}
    </div>

    <button 
      onClick={() => onAction(trip)}
      className="w-full py-3 bg-stone-50 text-stone-900 rounded-xl font-medium group-hover:bg-stone-900 group-hover:text-white transition-all border border-stone-200 group-hover:border-stone-900"
    >
      Request Delivery
    </button>
  </motion.div>
);

interface RequestCardProps {
  request: DeliveryRequest;
  onAction: (r: DeliveryRequest) => void;
  key?: React.Key;
}

const RequestCard = ({ request, onAction }: RequestCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold">
          {request.requesterName[0]}
        </div>
        <div>
          <h3 className="font-semibold text-stone-900">{request.itemName}</h3>
          <p className="text-xs text-stone-500">by {request.requesterName}</p>
        </div>
      </div>
      <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
        ${request.commission}
      </div>
    </div>

    <p className="text-sm text-stone-600 mb-6 line-clamp-2">{request.itemDescription}</p>

    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider text-stone-400 font-bold mb-1">Pickup</p>
        <p className="font-medium text-stone-900 truncate">{request.origin}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-stone-300" />
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider text-stone-400 font-bold mb-1">Dropoff</p>
        <p className="font-medium text-stone-900 truncate">{request.destination}</p>
      </div>
    </div>

    <div className="flex items-center gap-2 text-stone-600 mb-6">
      <Calendar className="w-4 h-4" />
      <span className="text-sm">Deadline: {format(new Date(request.deadline), 'MMM d, yyyy')}</span>
    </div>

    <button 
      onClick={() => onAction(request)}
      className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
    >
      Offer to Carry
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
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} setPage={setPage} />

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
                    className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 leading-tight"
                  >
                    Logistics, <br />
                    <span className="text-stone-400 italic font-serif">Human-Powered.</span>
                  </motion.h1>
                  <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                    Connect with travelers to send items anywhere in the world. 
                    Faster, cheaper, and more personal than traditional shipping.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setPage('trips')}
                      className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-semibold text-lg hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-2"
                    >
                      Find a Traveler <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setPage('post-trip')}
                      className="px-8 py-4 bg-white text-stone-900 border border-stone-200 rounded-2xl font-semibold text-lg hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                    >
                      Post Your Trip <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </section>

                {/* Features */}
                <section className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: Plane, title: "Travel & Earn", desc: "Monetize your extra luggage space and offset your travel costs." },
                    { icon: Package, title: "Fast Delivery", desc: "Get items delivered in days, not weeks, by leveraging existing travel routes." },
                    { icon: CheckCircle2, title: "Trust & Safety", desc: "Verified profiles and community ratings ensure a secure experience." }
                  ].map((f, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-4">
                      <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-white">
                        <f.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold">{f.title}</h3>
                      <p className="text-stone-500 leading-relaxed">{f.desc}</p>
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
                    <h2 className="text-3xl font-bold mb-2">Available Trips</h2>
                    <p className="text-stone-500">Find a traveler heading your way.</p>
                  </div>
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input 
                      type="text" 
                      placeholder="Search destination..." 
                      className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip, idx) => (
                    <TripCard key={trip.id || idx} trip={trip} onAction={() => setPage('post-request')} />
                  ))}
                  {trips.length === 0 && (
                    <div className="col-span-full py-24 text-center space-y-4 bg-white rounded-3xl border border-dashed border-stone-200">
                      <Plane className="w-12 h-12 text-stone-200 mx-auto" />
                      <p className="text-stone-400 font-medium">No active trips found. Be the first to post one!</p>
                      <button onClick={() => setPage('post-trip')} className="text-stone-900 font-bold underline">Post a Trip</button>
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
                    <h2 className="text-3xl font-bold mb-2">Delivery Requests</h2>
                    <p className="text-stone-500">Help someone out and earn extra income.</p>
                  </div>
                  <button 
                    onClick={() => setPage('post-request')}
                    className="px-6 py-3 bg-stone-900 text-white rounded-2xl font-bold flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Post Request
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requests.map((request, idx) => (
                    <RequestCard key={request.id || idx} request={request} onAction={() => {}} />
                  ))}
                  {requests.length === 0 && (
                    <div className="col-span-full py-24 text-center space-y-4 bg-white rounded-3xl border border-dashed border-stone-200">
                      <Package className="w-12 h-12 text-stone-200 mx-auto" />
                      <p className="text-stone-400 font-medium">No pending requests. Check back later!</p>
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
                className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-stone-200 shadow-xl"
              >
                <h2 className="text-3xl font-bold mb-8">Post Your Travel Route</h2>
                <form onSubmit={handlePostTrip} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Origin City</label>
                      <input name="origin" required placeholder="e.g. London" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Destination City</label>
                      <input name="destination" required placeholder="e.g. New York" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Travel Date</label>
                      <input name="date" type="date" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Capacity</label>
                      <select name="capacity" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10">
                        <option>Small (Envelope/Document)</option>
                        <option>Medium (Backpack size)</option>
                        <option>Large (Suitcase space)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Allowed Item Types (comma separated)</label>
                    <input name="types" placeholder="e.g. Documents, Electronics, Gifts" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all">
                    Publish Trip
                  </button>
                </form>
              </motion.div>
            )}

            {page === 'post-request' && (
              <motion.div 
                key="post-request"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-stone-200 shadow-xl"
              >
                <h2 className="text-3xl font-bold mb-8">Request a Delivery</h2>
                <form onSubmit={handlePostRequest} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Item Name</label>
                    <input name="itemName" required placeholder="e.g. MacBook Charger" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Description</label>
                    <textarea name="description" rows={3} placeholder="Tell the traveler about the item..." className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Pickup From</label>
                      <input name="origin" required placeholder="City" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Deliver To</label>
                      <input name="destination" required placeholder="City" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Deadline</label>
                      <input name="deadline" type="date" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Commission ($)</label>
                      <input name="commission" type="number" required placeholder="e.g. 25" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all">
                    Post Request
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
                <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center gap-12">
                  <img src={user.photoURL || ''} alt="" className="w-48 h-48 rounded-full border-8 border-stone-50 shadow-inner" />
                  <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-4xl font-bold">{user.displayName}</h2>
                    <p className="text-stone-500">{user.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                      </div>
                      <span className="text-stone-400 font-medium">5.0 (0 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Your Active Trips</h3>
                    {trips.filter(t => t.travelerId === user.uid).map((trip, idx) => (
                      <TripCard key={trip.id || idx} trip={trip} onAction={() => {}} />
                    ))}
                    {trips.filter(t => t.travelerId === user.uid).length === 0 && (
                      <p className="text-stone-400 italic">No active trips.</p>
                    )}
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Your Requests</h3>
                    {requests.filter(r => r.requesterId === user.uid).map((request, idx) => (
                      <RequestCard key={request.id || idx} request={request} onAction={() => {}} />
                    ))}
                    {requests.filter(r => r.requesterId === user.uid).length === 0 && (
                      <p className="text-stone-400 italic">No active requests.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-200 py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Plane className="w-6 h-6 text-stone-900" />
              <span className="text-lg font-bold">VoyageDeliver</span>
            </div>
            <p className="text-stone-400 text-sm">© 2026 VoyageDeliver. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
