import React from 'react';
import { motion } from 'motion/react';
import { Package, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DeliveryRequest } from '../types';
import { translations } from '../translations';

interface RequestCardProps {
  request: DeliveryRequest;
  onAction: (r: DeliveryRequest) => void;
  t: (key: keyof typeof translations['en']) => string;
  key?: React.Key;
}

export const RequestCard = ({ request, onAction, t }: RequestCardProps) => (
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
          <h3 className="font-semibold text-text-main truncate max-w-[150px]">
            {request.items[0]?.name}{request.items.length > 1 ? ` +${request.items.length - 1}` : ''}
          </h3>
          <p className="text-xs text-text-muted">{t('by')} {request.requesterName}</p>
        </div>
      </div>
      <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-bold">
        ${request.commission}
      </div>
    </div>

    <div className="space-y-3 mb-6">
      {request.items.slice(0, 2).map((item, i) => (
        <div key={i} className="flex items-center gap-3 p-2 bg-bg-main rounded-xl border border-border-subtle">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary/40" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-main truncate">{item.name}</p>
            <p className="text-xs text-text-muted truncate">{item.description}</p>
          </div>
          <div className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-md">
            x{item.quantity}
          </div>
        </div>
      ))}
      {request.items.length > 2 && (
        <p className="text-xs text-center text-text-muted font-medium">+{request.items.length - 2} {t('items')}...</p>
      )}
    </div>

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
