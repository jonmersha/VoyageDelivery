import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Star, Plane, Package } from 'lucide-react';
import { TripCard } from '../components/TripCard';
import { RequestCard } from '../components/RequestCard';
import { Trip, DeliveryRequest } from '../types';
import { translations } from '../translations';

interface ProfileProps {
  user: any;
  trips: Trip[];
  requests: DeliveryRequest[];
  t: (key: keyof typeof translations['en']) => string;
}

export const Profile = ({ user, trips, requests, t }: ProfileProps) => (
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
);
