import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '../store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { createTask, categories, fetchCategories } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'MEDIUM',
    categoryId: '',
    tags: ''
  });

  React.useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setFormData({ title: '', description: '', deadline: '', priority: 'MEDIUM', categoryId: '', tags: '' });
    }
  }, [isOpen, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
      };
      
      await createTask(payload);
      onClose();
    } catch (error: any) {
      console.error(error);
      alert('OPERACAO_FALHOU: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-bg-deep border border-border-dim p-8 relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-brand inline-block" />
              {t('dashboard.form.title')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{t('dashboard.form.label_title')}</label>
                <input 
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-border-dim px-4 py-2 font-sans focus:border-brand focus:outline-none transition-colors"
                  placeholder={t('dashboard.form.placeholder_title')}
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{t('dashboard.form.label_desc')}</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-border-dim px-4 py-2 font-sans focus:border-brand focus:outline-none transition-colors h-24"
                  placeholder={t('dashboard.form.placeholder_desc')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{t('dashboard.form.label_deadline')}</label>
                  <input 
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                    className="w-full bg-white/5 border border-border-dim px-4 py-2 font-sans focus:border-brand focus:outline-none transition-colors text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{t('dashboard.form.label_priority')}</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                    className="w-full bg-zinc-900 border border-border-dim px-4 py-2 font-sans focus:border-brand focus:outline-none transition-colors appearance-none text-white cursor-pointer hover:bg-zinc-800"
                  >
                    <option value="LOW" className="bg-zinc-900">{t('dashboard.form.priority_low')}</option>
                    <option value="MEDIUM" className="bg-zinc-900">{t('dashboard.form.priority_medium')}</option>
                    <option value="HIGH" className="bg-zinc-900">{t('dashboard.form.priority_high')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{t('dashboard.form.label_category')}</label>
                <select 
                  required
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full bg-zinc-900 border border-border-dim px-4 py-2 font-sans focus:border-brand focus:outline-none transition-colors appearance-none text-white cursor-pointer hover:bg-zinc-800"
                >
                  <option value="" disabled>{t('dashboard.form.placeholder_category')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{t('dashboard.form.label_tags')}</label>
                <input 
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-white/5 border border-border-dim px-4 py-2 font-sans focus:border-brand focus:outline-none transition-colors"
                  placeholder={t('dashboard.form.placeholder_tags')}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-technical flex-1 disabled:opacity-50"
                >
                  {loading ? '...' : t('dashboard.form.btn_save')}
                </button>
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-4 py-2 font-mono text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all"
                >
                  {t('dashboard.form.btn_cancel')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
