import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns, data, onRowClick,
}: { columns: Column<T>[]; data: T[]; onRowClick?: (row: T) => void }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-border bg-surface-card dark:border-dark-border dark:bg-dark-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-surface-border dark:border-dark-border">
            {columns.map((col) => (
              <th key={col.header} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-secondary dark:text-dark-subtext">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-surface-border/70 last:border-0 dark:border-dark-border/70',
                onRowClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5'
              )}
            >
              {columns.map((col) => (
                <td key={col.header} className={cn('whitespace-nowrap px-4 py-3.5 text-ink-primary dark:text-dark-text', col.className)}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
