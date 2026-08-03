import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';
import type { KpiCard } from '../../types';

const toneMap = {
  primary: 'bg-primary-50 text-primary dark:bg-primary/15 dark:text-primary-100',
  success: 'bg-green-50 text-success dark:bg-success/15 dark:text-green-400',
  warning: 'bg-amber-50 text-warning dark:bg-warning/15 dark:text-amber-400',
  danger: 'bg-red-50 text-danger dark:bg-danger/15 dark:text-red-400',
  info: 'bg-blue-50 text-info dark:bg-info/15 dark:text-blue-400',
  secondary: 'bg-teal-50 text-secondary dark:bg-secondary/15 dark:text-secondary',
};

export function KpiCardView({ kpi, index }: { kpi: KpiCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="p-5 transition-shadow hover:shadow-elevated">
        <div className="flex items-start justify-between">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', toneMap[kpi.tone])}>
            <Icon name={kpi.icon} size={20} />
          </div>
          {kpi.delta !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                kpi.trend === 'up' && kpi.tone !== 'danger' ? 'bg-green-50 text-success dark:bg-success/10' : '',
                kpi.trend === 'down' ? 'bg-green-50 text-success dark:bg-success/10' : '',
                kpi.trend === 'up' && kpi.tone === 'danger' ? 'bg-red-50 text-danger dark:bg-danger/10' : ''
              )}
            >
              <Icon name={kpi.trend === 'up' ? 'ArrowUpRight' : kpi.trend === 'down' ? 'ArrowDownRight' : 'Minus'} size={12} />
              {Math.abs(kpi.delta)}{typeof kpi.delta === 'number' && kpi.unit !== '%' ? '' : ''}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold tracking-tight text-ink-primary dark:text-dark-text">
            {kpi.value}
          </p>
          <p className="mt-1 text-sm text-ink-secondary dark:text-dark-subtext">{kpi.label}</p>
        </div>
        {kpi.deltaLabel && (
          <p className="mt-2 text-xs text-ink-secondary/70 dark:text-dark-subtext/70">{kpi.deltaLabel}</p>
        )}
      </Card>
    </motion.div>
  );
}
