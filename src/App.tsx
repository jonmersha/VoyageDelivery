import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, LogOut } from 'lucide-react';
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
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  getDocFromServer
} from './firebase';
import { Trip, DeliveryRequest, OperationType } from './types';
import { handleFirestoreError } from './utils';
import { translations, Language } from './translations';

// Components
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';

// Screens
import { Hero, Features } from './screens/Home';
import { Trips } from './screens/Trips';
import { Requests } from './screens/Requests';
import { PostTrip } from './screens/PostTrip';
import { PostRequest } from './screens/PostRequest';
import { Profile } from './screens/Profile';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState('home');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [requestItems, setRequestItems] = useState<any[]>([{ name: '', description: '', quantity: 1, imageUrl: '' }]);

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  // --- Auth & Initial Setup ---

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
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
    const validItems = requestItems.filter(item => item.name.trim() !== '');
    if (validItems.length === 0) return;

    const requestData = {
      requesterId: user.uid,
      requesterName: user.displayName || 'Anonymous',
      items: validItems,
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      deadline: formData.get('deadline') as string,
      commission: Number(formData.get('commission')),
      status: 'pending',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'requests'), requestData);
      setRequestItems([{ name: '', description: '', quantity: 1, imageUrl: '' }]);
      setPage('requests');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'requests');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) return;
    try {
      const requestRef = doc(db, 'requests', requestId);
      await setDoc(requestRef, {
        status: 'accepted',
        acceptedBy: user.uid,
        acceptedByName: user.displayName,
        acceptedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'requests');
    }
  };

  const handleJoinTrip = async (tripId: string) => {
    if (!user) return;
    try {
      const tripRef = doc(db, 'trips', tripId);
      const tripSnap = await getDoc(tripRef);
      if (tripSnap.exists()) {
        const participants = tripSnap.data().participants || [];
        if (!participants.includes(user.uid)) {
          await setDoc(tripRef, {
            participants: [...participants, user.uid]
          }, { merge: true });
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'trips');
    }
  };

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
              <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-24">
                <Hero setPage={setPage} t={t} language={language} />
                <Features t={t} />
              </motion.div>
            )}

            {page === 'trips' && <Trips trips={trips} setPage={setPage} language={language} t={t} onJoinTrip={handleJoinTrip} />}
            {page === 'requests' && <Requests requests={requests} setPage={setPage} t={t} onAcceptRequest={handleAcceptRequest} />}
            {page === 'post-trip' && <PostTrip handlePostTrip={handlePostTrip} t={t} />}
            {page === 'post-request' && <PostRequest handlePostRequest={handlePostRequest} requestItems={requestItems} setRequestItems={setRequestItems} t={t} />}
            {page === 'profile' && user && <Profile user={user} trips={trips} requests={requests} t={t} />}
          </AnimatePresence>
        </main>

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
