import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { capaItems } from '../../services/mockData';
import type { CapaItem } from '../../types';
import { cn } from '../../utils/cn';

const columns: { key: CapaItem['status']; label: string; tone: string }[] = [
  { key: 'draft', label: 'Draft', tone: 'bg-slate-400' },
  { key: 'in_progress', label: 'In Progress', tone: 'bg-info' },
  { key: 'review', label: 'Review', tone: 'bg-warning' },
  { key: 'closed', label: 'Closed', tone: 'bg-success' },
];

const priorityTone: Record<string, 'neutral' | 'warning' | 'danger' | 'info'> = {
  low: 'neutral', medium: 'info', high: 'warning', critical: 'danger',
};

export default function CapaBoard() {
  const [view, setView] = useState<'kanban' | 'list' | 'timeline'>('kanban');

  return (
    <div className="space-y-6">
      <PageHeader
        title="CAPA"
        description="Actions correctives et préventives — workflow et suivi des responsables"
        actions={
          <>
            <div className="flex rounded-xl border border-surface-border p-1 dark:border-dark-border">
              {(['kanban', 'list', 'timeline'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors',
                    view === v ? 'bg-primary text-white' : 'text-ink-secondary dark:text-dark-subtext')}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button variant="primary"><Icon name="Plus" size={16} /> Nouvelle CAPA</Button>
          </>
        }
      />

      {view === 'kanban' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => {
            const items = capaItems.filter((c) => c.status === col.key);
            return (
              <div key={col.key} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-1">
                  <span className={cn('h-2 w-2 rounded-full', col.tone)} />
                  <h3 className="text-sm font-semibold text-ink-primary dark:text-dark-text">{col.label}</h3>
                  <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-ink-secondary dark:bg-white/5 dark:text-dark-subtext">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {items.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="cursor-pointer p-4 hover:shadow-elevated">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[11px] font-semibold text-primary">{item.reference}</span>
                          <Badge tone={priorityTone[item.priority]}>{item.priority}</Badge>
                        </div>
                        <p className="mt-2 text-sm font-medium leading-snug text-ink-primary dark:text-dark-text">{item.title}</p>
                        <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">Source: {item.source}</p>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                          <div className="h-full rounded-full bg-secondary" style={{ width: `${item.progress}%` }} />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-ink-secondary dark:text-dark-subtext">
                          <span className="flex items-center gap-1"><Icon name="User" size={12} /> {item.owner}</span>
                          <span className="flex items-center gap-1"><Icon name="Calendar" size={12} /> {new Date(item.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-surface-border py-8 text-center text-xs text-ink-secondary dark:border-dark-border dark:text-dark-subtext">
                      Aucun élément
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'list' && (
        <Card className="divide-y divide-surface-border dark:divide-dark-border">
          {capaItems.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-mono text-xs font-semibold text-primary">{item.reference}</p>
                <p className="text-sm font-medium text-ink-primary dark:text-dark-text">{item.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={priorityTone[item.priority]}>{item.priority}</Badge>
                <span className="text-xs text-ink-secondary dark:text-dark-subtext">{item.owner}</span>
                <span className="text-xs text-ink-secondary dark:text-dark-subtext">{new Date(item.dueDate).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          ))}
        </Card>
      )}

      {view === 'timeline' && (
        <Card className="p-6">
          <div className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-1 before:h-[calc(100%-8px)] before:w-px before:bg-surface-border dark:before:bg-dark-border">
            {[...capaItems].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((item) => (
              <div key={item.id} className="relative">
                <span className={cn('absolute -left-6 top-1 h-3.5 w-3.5 rounded-full ring-4 ring-surface-card dark:ring-dark-card',
                  item.status === 'closed' ? 'bg-success' : item.priority === 'critical' ? 'bg-danger' : 'bg-primary')} />
                <p className="text-xs text-ink-secondary dark:text-dark-subtext">{new Date(item.dueDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <p className="text-sm font-medium text-ink-primary dark:text-dark-text">{item.title}</p>
                <p className="text-xs text-ink-secondary dark:text-dark-subtext">{item.reference} · {item.owner}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
