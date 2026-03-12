import React from 'react';
import { motion } from 'motion/react';
import { Search, Plane } from 'lucide-react';
import { TripCard } from '../components/TripCard';
import { Trip } from '../types';
import { translations } from '../translations';
import { cn } from '../utils';

interface TripsProps {
  trips: Trip[];
  setPage: (p: string) => void;
  language: string;
  t: (key: keyof typeof translations['en']) => string;
  onJoinTrip: (id: string) => void;
}

export const Trips = ({ trips, setPage, language, t, onJoinTrip }: TripsProps) => (
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
        <TripCard key={trip.id || idx} trip={trip} onAction={() => trip.id && onJoinTrip(trip.id)} t={t} />
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
);
