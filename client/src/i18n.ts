import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'pt-BR',
  resources: {
    'pt-BR': { 
      translation: { 
        dashboard: { 
          title: 'Painel de Controle', 
          status: 'ESTADO DO SISTEMA: OTIMAL // ATUALIZAÇÕES EM TEMPO REAL', 
          new_task: 'Nova Tarefa', 
          logout: 'Sair_',
          stats: { total: 'Total de Tarefas', completed: 'Concluído Hoje', overdue: 'Atraso Crítico' }, 
          recent_tasks: 'Tarefas Recentes', 
          reading_db: 'Sincronizando banco de dados...', 
          no_tasks: 'Nenhuma tarefa encontrada no setor.', 
          form: {
            title: 'Nova Tarefa',
            title_edit: 'Editar Tarefa',
            label_title: 'Título',
            placeholder_title: 'Ex: Refatorar módulo de login',
            label_desc: 'Descrição',
            placeholder_desc: 'Detalhes técnicos da operação...',
            label_deadline: 'Data Limite',
            label_priority: 'Prioridade',
            label_category: 'Categoria',
            placeholder_category: '-- SELECIONAR SETOR --',
            label_tags: 'Tags (separadas por vírgula)',
            placeholder_tags: 'TRABALHO, URGENTE, DESIGN',
            priority_low: 'Baixa',
            priority_medium: 'Média',
            priority_high: 'Alta',
            btn_save: 'Salvar Registro',
            btn_cancel: 'Cancelar',
            btn_purge: 'Excluir permanentemente',
            confirm_purge: 'IDENTIFICADO: EXCLUSÃO PERMANENTE. DESEJA CONTINUAR?'
          } 
        } 
      } 
    },
    en: { 
      translation: { 
        dashboard: { 
          title: 'Control Panel', 
          status: 'SYSTEM STATUS: OPTIMAL // LIVE UPDATES ENABLED', 
          new_task: 'New Task', 
          logout: 'Exit_',
          stats: { total: 'Total Operations', completed: 'Completed Today', overdue: 'Critical Overdue' }, 
          recent_tasks: 'Recent Tasks', 
          reading_db: 'Reading database...', 
          no_tasks: 'No tasks found in the sector.', 
          form: {
            title: 'New Operation',
            title_edit: 'Update Operation',
            label_title: 'Title',
            placeholder_title: 'e.g., Refactor login module',
            label_desc: 'Description',
            placeholder_desc: 'Technical details of the operation...',
            label_deadline: 'Deadline',
            label_priority: 'Priority',
            label_category: 'Category',
            placeholder_category: '-- SELECT_SECTOR --',
            label_tags: 'Tags (comma separated)',
            placeholder_tags: 'WORK, URGENT, DESIGN',
            priority_low: 'Low',
            priority_medium: 'Medium',
            priority_high: 'High',
            btn_save: 'Execute Registry',
            btn_cancel: 'Abort',
            btn_purge: 'Purge Registry',
            confirm_purge: 'DO_YOU_WISH_TO_PURGE_SYSTEM?'
          } 
        } 
      } 
    },
    es: { 
      translation: { 
        dashboard: { 
          title: 'Panel de Control', 
          status: 'ESTADO DEL SISTEMA: ÓPTIMO // ACTUALIZACIONES ACTIVAS', 
          new_task: 'Nueva Tarea', 
          logout: 'Salir_ ',
          stats: { total: 'Total Operaciones', completed: 'Hecho Hoy', overdue: 'Retraso Crítico' }, 
          recent_tasks: 'Tareas Recientes', 
          reading_db: 'Leyendo base de datos...', 
          no_tasks: 'No se encontraron tareas en el sector.', 
          form: {
            title: 'Nueva Operación',
            title_edit: 'Actualizar Operación',
            label_title: 'Título',
            placeholder_title: 'Ej: Refactorizar módulo de login',
            label_desc: 'Descripción',
            placeholder_desc: 'Detalles técnicos de la operación...',
            label_deadline: 'Fecha Límite',
            label_priority: 'Prioridad',
            label_category: 'Categoría',
            placeholder_category: '-- SELECCIONAR_SETOR --',
            label_tags: 'Tags (separadas por coma)',
            placeholder_tags: 'TRABAJO, URGENTE, DISEÑO',
            priority_low: 'Baja',
            priority_medium: 'Media',
            priority_high: 'Alta',
            btn_save: 'Ejecutar Registro',
            btn_cancel: 'Abortar',
            btn_purge: 'Purgar Registro',
            confirm_purge: '¿DESEA_PURGAR_SISTEMA DEFINITIVAMENTE?'
          } 
        } 
      } 
    }
  },
  interpolation: { escapeValue: false }
});
export default i18n;
