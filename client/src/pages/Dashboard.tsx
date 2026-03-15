import React, { useEffect, useState } from 'react';
import { LayoutDashboard, CheckCircle2, AlertTriangle, ListTodo, Plus, Languages, Trash2, LogOut } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { signOut } from '../lib/auth-client';
import { StatCard } from '../components/StatCard';
import { TaskModal } from '../components/TaskModal';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { stats, tasks, fetchStats, fetchTasks, fetchCategories, deleteTask, toggleTaskStatus, loading } = useTaskStore();
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<'ALL' | 'DONE' | 'OVERDUE'>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (deletingId) {
      const timer = setTimeout(() => setDeletingId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [deletingId]);

  const toggleLanguage = () => {
    const langs = ['pt-BR', 'en', 'es'];
    const nextIdx = (langs.indexOf(i18n.language.split('-')[0]) + 1) % langs.length;
    i18n.changeLanguage(langs[nextIdx]);
  };

  useEffect(() => { fetchStats(); fetchTasks(); fetchCategories(); }, [fetchStats, fetchTasks, fetchCategories]);

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'ALL') return true;
    if (currentFilter === 'DONE') return task.status === 'DONE';
    if (currentFilter === 'OVERDUE') {
      return task.status === 'TODO' && task.deadline && new Date(task.deadline) < new Date();
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      <header className="flex justify-between items-end border-b border-border-dim pb-8">
        <div>
          <h1 className="text-4xl font-black">{t('dashboard.title')}</h1>
          <p className="font-mono text-[10px] text-brand uppercase tracking-[0.2em] mt-2 opacity-80">
            {t('dashboard.status')}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={toggleLanguage} 
            className="flex items-center gap-2 border border-white/10 px-3 py-1.5 font-mono text-[10px] hover:bg-brand hover:text-black transition-all group"
          >
            <Languages size={14} className="group-hover:rotate-12 transition-transform" />
            {i18n.language.split('-')[0].toUpperCase()}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-technical flex items-center gap-2"
          >
            <Plus size={18} />
            {t('dashboard.new_task')}
          </button>
          <button 
            onClick={async () => {
              await signOut();
              window.location.reload();
            }}
            className="flex items-center gap-2 border border-red-500/20 px-3 py-1.5 font-mono text-[10px] text-red-500 hover:bg-red-500 hover:text-white transition-all group"
            title="Sair do Sistema"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            {t('dashboard.logout')}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label={t('dashboard.stats.total')} 
          value={stats.total} 
          icon={ListTodo} 
          onClick={() => setCurrentFilter('ALL')}
          isActive={currentFilter === 'ALL'}
        />
        <StatCard 
          label={t('dashboard.stats.completed')} 
          value={stats.completedToday} 
          icon={CheckCircle2} 
          color="#00ffcc" 
          onClick={() => setCurrentFilter('DONE')}
          isActive={currentFilter === 'DONE'}
        />
        <StatCard 
          label={t('dashboard.stats.overdue')} 
          value={stats.overdue} 
          icon={AlertTriangle} 
          color="#ff3300" 
          onClick={() => setCurrentFilter('OVERDUE')}
          isActive={currentFilter === 'OVERDUE'}
        />
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl flex items-center gap-2">
            <LayoutDashboard size={20} className="text-brand" />
            {t('dashboard.recent_tasks')}
            {currentFilter !== 'ALL' && (
              <span className="text-[10px] font-mono bg-brand/10 text-brand px-2 py-0.5 border border-brand/20 ml-2">
                FILTER: {currentFilter}
              </span>
            )}
          </h2>
          {currentFilter !== 'ALL' && (
            <button 
              onClick={() => setCurrentFilter('ALL')}
              className="font-mono text-[10px] text-white/40 hover:text-white transition-colors underline"
            >
              [ RESET_FILTER ]
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-1 border-t border-border-dim pt-4">
          {loading ? ( <div className="font-mono text-xs animate-pulse">{t('dashboard.reading_db')}</div> ) : filteredTasks.length > 0 ? (
            filteredTasks.slice(0, 10).map(task => (
              <div key={task.id} className={`group flex items-center justify-between p-4 bg-white/5 border-l-2 ${task.status === 'DONE' ? 'border-green-500/50 bg-green-500/5' : 'border-transparent hover:border-brand'} hover:bg-white/10 transition-all cursor-pointer`}>
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task.id); }}
                    className={`p-1 border transition-colors ${task.status === 'DONE' ? 'border-green-500 text-green-500' : 'border-white/20 text-white/10 hover:border-brand hover:text-brand'}`}
                  >
                    <CheckCircle2 size={16} className={task.status === 'DONE' ? 'opacity-100' : 'opacity-0 hover:opacity-100'} />
                  </button>
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm uppercase flex items-center gap-2 ${task.status === 'DONE' ? 'line-through text-white/20' : ''}`}>
                      {task.title}
                      {task.category && (
                        <span className="text-[9px] bg-brand/10 text-brand px-1 border border-brand/20">
                          {task.category.name.toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className={`text-xs text-white/40 font-mono italic ${task.status === 'DONE' ? 'text-white/10' : ''}`}>{task.description || 'Sem descrição'}</span>
                    <div className="flex gap-1 mt-1">
                      {(task as any).tags?.map((tag: any) => (
                        <span key={tag.id} className="text-[8px] text-white/30 border border-white/10 px-1">#{tag.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-mono px-2 py-0.5 border ${task.priority === 'HIGH' ? 'border-red-500 text-red-500' : 'border-white/20 text-white/40'}`}>
                    {t(`dashboard.form.priority_${task.priority.toLowerCase()}`)}
                  </span>
                  <span className="text-xs font-mono text-white/20">
                    {task.deadline 
                      ? new Date(task.deadline).toLocaleDateString(undefined, { timeZone: 'UTC' }) 
                      : '--/--/--'}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (deletingId === task.id) {
                          deleteTask(task.id);
                          setDeletingId(null);
                        } else {
                          setDeletingId(task.id);
                        }
                      }}
                      className={`p-2 transition-all border ${deletingId === task.id ? 'bg-red-500 text-white border-red-500 animate-pulse opacity-100' : 'text-red-500/50 hover:text-red-500 border-transparent hover:border-red-500/20 hover:bg-red-500/5'}`}
                      title={deletingId === task.id ? t('dashboard.form.confirm_purge') : t('dashboard.form.btn_purge')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : ( <div className="font-mono text-xs text-white/20 uppercase italic">{t('dashboard.no_tasks')}</div> )}
        </div>
      </section>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
export default Dashboard;
