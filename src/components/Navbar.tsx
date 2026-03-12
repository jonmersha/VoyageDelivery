import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, LogOut, Menu, X } from 'lucide-react';
import { translations, Language } from '../translations';

interface NavbarProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  setPage: (p: string) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const Navbar = ({ user, onLogin, onLogout, setPage, language, setLanguage, t }: NavbarProps) => {
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
