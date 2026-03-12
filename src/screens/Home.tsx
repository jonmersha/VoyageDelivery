import React from 'react';
import { motion } from 'motion/react';
import { Plane, Package, CheckCircle2, ArrowRight, Plus } from 'lucide-react';
import { translations } from '../translations';
import { cn } from '../utils';

interface HomeProps {
  setPage: (p: string) => void;
  t: (key: keyof typeof translations['en']) => string;
  language: string;
}

export const Hero = ({ setPage, t, language }: HomeProps) => (
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
);

export const Features = ({ t }: { t: (key: keyof typeof translations['en']) => string }) => (
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
);
