import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'pt',
  resources: {
    pt: { translation: { dashboard: { title: 'Painel de Controle', status: 'STATUS DO SISTEMA: OTIMAL // ATUALIZAÇÕES EM TEMPO REAL', new_task: 'Nova Tarefa', stats: { total: 'Total Operações', completed: 'Concluído Hoje', overdue: 'Atraso Crítico' }, recent_tasks: 'Tarefas Recentes', reading_db: 'Lendo banco de dados...', no_tasks: 'Nenhuma tarefa encontrada no setor.' } } },
    en: { translation: { dashboard: { title: 'Control Panel', status: 'SYSTEM STATUS: OPTIMAL // LIVE UPDATES ENABLED', new_task: 'New Task', stats: { total: 'Total Operations', completed: 'Completed Today', overdue: 'Critical Overdue' }, recent_tasks: 'Recent Tasks', reading_db: 'Reading database...', no_tasks: 'No tasks found in the sector.' } } },
    es: { translation: { dashboard: { title: 'Panel de Control', status: 'ESTADO DEL SISTEMA: ÓPTIMO // ACTUALIZACIONES ACTIVAS', new_task: 'Nova Tarea', stats: { total: 'Total Operaciones', completed: 'Hecho Hoy', overdue: 'Retraso Crítico' }, recent_tasks: 'Tareas Recientes', reading_db: 'Leyendo base de datos...', no_tasks: 'No se encontraron tareas en el sector.' } } }
  },
  interpolation: { escapeValue: false }
});
export default i18n;
