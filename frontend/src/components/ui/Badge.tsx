import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type Tone = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneStyles: Record<Tone, string> = {
  primary: 'bg-primary-50 text-primary dark:bg-primary/15 dark:text-primary-100',
  secondary: 'bg-teal-50 text-secondary dark:bg-secondary/15 dark:text-secondary',
  success: 'bg-green-50 text-success dark:bg-success/15 dark:text-green-400',
  warning: 'bg-amber-50 text-warning dark:bg-warning/15 dark:text-amber-400',
  danger: 'bg-red-50 text-danger dark:bg-danger/15 dark:text-red-400',
  info: 'bg-blue-50 text-info dark:bg-info/15 dark:text-blue-400',
  neutral: 'bg-slate-100 text-ink-secondary dark:bg-white/5 dark:text-dark-subtext',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ tone = 'neutral', dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', {
        'bg-primary': tone === 'primary', 'bg-secondary': tone === 'secondary',
        'bg-success': tone === 'success', 'bg-warning': tone === 'warning',
        'bg-danger': tone === 'danger', 'bg-info': tone === 'info',
        'bg-ink-secondary': tone === 'neutral',
      })} />}
      {children}
    </span>
  );
}

const statusToneMap: Record<string, Tone> = {
  open: 'info', in_progress: 'warning', closed: 'success', overdue: 'danger',
  draft: 'neutral', approved: 'success', expired: 'danger', review: 'warning',
  normal: 'success', warning: 'warning', alert: 'danger',
};

export function StatusBadge({ status }: { status: string }) {
  const tone = statusToneMap[status] ?? 'neutral';
  return (
    <Badge tone={tone} dot>
      {status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
    </Badge>
  );
}
