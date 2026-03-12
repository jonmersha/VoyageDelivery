import React from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, Calendar, Weight } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '../types';
import { translations } from '../translations';

interface TripCardProps {
  trip: Trip;
  onAction: (t: Trip) => void;
  t: (key: keyof typeof translations['en']) => string;
  key?: React.Key;
}

export const TripCard = ({ trip, onAction, t }: TripCardProps) => (
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
        </span>
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
