import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5 dark:border-dark-border dark:bg-dark-card">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="mt-4 h-6 w-20" />
      <Skeleton className="mt-2 h-4 w-28" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function EmptyState({
  icon = 'Inbox', title, description, actionLabel, onAction,
}: { icon?: string; title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-surface-card/50 px-6 py-16 text-center dark:border-dark-border dark:bg-dark-card/50">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary dark:bg-primary/15 dark:text-primary-100">
        <Icon name={icon} size={26} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink-primary dark:text-dark-text">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-secondary dark:text-dark-subtext">{description}</p>
      {actionLabel && (
        <Button className="mt-5" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-danger/20 bg-red-50/50 px-6 py-16 text-center dark:border-danger/30 dark:bg-danger/5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-danger dark:bg-danger/15">
        <Icon name="AlertTriangle" size={26} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink-primary dark:text-dark-text">Une erreur est survenue</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-secondary dark:text-dark-subtext">{message}</p>
      {onRetry && (
        <Button className="mt-5" size="sm" variant="outline" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  );
}
