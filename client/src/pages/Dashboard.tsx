import React, { useEffect } from 'react';
import { LayoutDashboard, CheckCircle2, AlertTriangle, ListTodo, Plus, Languages } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { StatCard } from '../components/StatCard';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { stats, tasks, fetchStats, fetchTasks, loading } = useTaskStore();
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    const langs = ['pt', 'en', 'es'];
    const nextIdx = (langs.indexOf(i18n.language.split('-')[0]) + 1) % langs.length;
    i18n.changeLanguage(langs[nextIdx]);
  };

  useEffect(() => { fetchStats(); fetchTasks(); }, [fetchStats, fetchTasks]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      <header className="flex justify-between items-end border-b border-border-dim pb-8">
        <div><h1 className="text-4xl font-black">{t('dashboard.title')}</h1><p className="font-mono text-sm text-white/40 mt-2">{t('dashboard.status')}</p></div>
        <div className="flex gap-4">
          <button onClick={toggleLanguage} className="flex items-center gap-2 border border-white/10 px-3 py-1 font-mono text-[10px] hover:bg-white/5 transition-all"><Languages size={14} />{i18n.language.toUpperCase()}</button>
          <button className="btn-technical flex items-center gap-2"><Plus size={18} />{t('dashboard.new_task')}</button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label={t('dashboard.stats.total')} value={stats.total} icon={ListTodo} />
        <StatCard label={t('dashboard.stats.completed')} value={stats.completedToday} icon={CheckCircle2} color="#00ffcc" />
        <StatCard label={t('dashboard.stats.overdue')} value={stats.overdue} icon={AlertTriangle} color="#ff3300" />
      </section>

      <section className="space-y-6">
        <h2 className="text-xl flex items-center gap-2"><LayoutDashboard size={20} className="text-brand" />{t('dashboard.recent_tasks')}</h2>
        <div className="grid grid-cols-1 gap-1 border-t border-border-dim pt-4">
          {loading ? ( <div className="font-mono text-xs animate-pulse">{t('dashboard.reading_db')}</div> ) : tasks.length > 0 ? (
            tasks.slice(0, 5).map(task => (
              <div key={task.id} className="group flex items-center justify-between p-4 bg-white/5 border-l-2 border-transparent hover:border-brand hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex flex-col"><span className="font-bold text-sm uppercase">{task.title}</span><span className="text-xs text-white/40 font-mono">{task.description || 'Sem descrição'}</span></div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-mono px-2 py-0.5 border ${task.priority === 'HIGH' ? 'border-red-500 text-red-500' : 'border-white/20 text-white/40'}`}>{task.priority}</span>
                  <span className="text-xs font-mono text-white/20">{task.deadline ? new Date(task.deadline).toLocaleDateString() : '--/--/--'}</span>
                </div>
              </div>
            ))
          ) : ( <div className="font-mono text-xs text-white/20 uppercase italic">{t('dashboard.no_tasks')}</div> )}
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
