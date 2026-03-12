import React from 'react';
import { motion } from 'motion/react';
import { Plus, X } from 'lucide-react';
import { translations } from '../translations';

interface PostRequestProps {
  handlePostRequest: (e: React.FormEvent<HTMLFormElement>) => void;
  requestItems: any[];
  setRequestItems: (items: any[]) => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const PostRequest = ({ handlePostRequest, requestItems, setRequestItems, t }: PostRequestProps) => (
  <motion.div 
    key="post-request"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-border-subtle shadow-xl"
  >
    <h2 className="text-3xl font-bold mb-8 text-text-main">{t('requestDeliveryTitle')}</h2>
    <form onSubmit={handlePostRequest} className="space-y-8">
      {/* Items List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-text-main uppercase tracking-wider">{t('items')}</label>
          <button 
            type="button"
            onClick={() => setRequestItems([...requestItems, { name: '', description: '', quantity: 1, imageUrl: '' }])}
            className="text-xs font-bold text-secondary hover:text-secondary-hover flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> {t('addItem')}
          </button>
        </div>
        
        <div className="space-y-6">
          {requestItems.map((item, index) => (
            <div key={index} className="p-6 bg-bg-main rounded-2xl border border-border-subtle space-y-4 relative group">
              {requestItems.length > 1 && (
                <button 
                  type="button"
                  onClick={() => setRequestItems(requestItems.filter((_, i) => i !== index))}
                  className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('itemName')}</label>
                  <input 
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...requestItems];
                      newItems[index].name = e.target.value;
                      setRequestItems(newItems);
                    }}
                    required 
                    placeholder="e.g. MacBook" 
                    className="w-full px-4 py-2 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('quantity')}</label>
                  <input 
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...requestItems];
                      newItems[index].quantity = Number(e.target.value);
                      setRequestItems(newItems);
                    }}
                    required 
                    className="w-full px-4 py-2 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('description')}</label>
                <textarea 
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...requestItems];
                    newItems[index].description = e.target.value;
                    setRequestItems(newItems);
                  }}
                  rows={2} 
                  placeholder="Details about this item..." 
                  className="w-full px-4 py-2 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('imageUrl')}</label>
                <input 
                  value={item.imageUrl}
                  onChange={(e) => {
                    const newItems = [...requestItems];
                    newItems[index].imageUrl = e.target.value;
                    setRequestItems(newItems);
                  }}
                  placeholder="https://example.com/image.jpg" 
                  className="w-full px-4 py-2 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-border-subtle" />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('pickupFrom')}</label>
          <input name="origin" required placeholder="City" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('deliverTo')}</label>
          <input name="destination" required placeholder="City" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('deadline')}</label>
          <input name="deadline" type="date" required className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('commission')}</label>
          <input name="commission" type="number" required placeholder="e.g. 25" className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20" />
        </div>
      </div>
      <button type="submit" className="w-full py-4 bg-secondary text-white rounded-2xl font-bold text-lg hover:bg-secondary-hover transition-all shadow-lg shadow-secondary/20">
        {t('postRequestBtn')}
      </button>
    </form>
  </motion.div>
);
