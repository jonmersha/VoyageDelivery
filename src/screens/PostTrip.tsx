import React from 'react';
import { motion } from 'motion/react';
import { translations } from '../translations';

interface PostTripProps {
  handlePostTrip: (e: React.FormEvent<HTMLFormElement>) => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const PostTrip = ({ handlePostTrip, t }: PostTripProps) => (
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
);
