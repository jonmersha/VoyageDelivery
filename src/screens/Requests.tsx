import React from 'react';
import { motion } from 'motion/react';
import { Package, Plus } from 'lucide-react';
import { RequestCard } from '../components/RequestCard';
import { DeliveryRequest } from '../types';
import { translations } from '../translations';

interface RequestsProps {
  requests: DeliveryRequest[];
  setPage: (p: string) => void;
  t: (key: keyof typeof translations['en']) => string;
  onAcceptRequest: (id: string) => void;
}

export const Requests = ({ requests, setPage, t, onAcceptRequest }: RequestsProps) => (
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
        <RequestCard key={request.id || idx} request={request} onAction={() => request.id && onAcceptRequest(request.id)} t={t} />
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
);
