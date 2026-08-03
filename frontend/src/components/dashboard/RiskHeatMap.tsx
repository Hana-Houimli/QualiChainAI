import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { riskHeatMap } from '../../services/mockData';
import { cn } from '../../utils/cn';

const cellColor = (label: string) => ({
  Low: 'bg-green-100 text-green-800 dark:bg-success/15 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-warning/15 dark:text-amber-400',
  High: 'bg-orange-200 text-orange-900 dark:bg-orange-500/20 dark:text-orange-300',
  Critical: 'bg-red-200 text-red-900 dark:bg-danger/25 dark:text-red-400',
}[label] ?? 'bg-slate-100 text-slate-700');

export function RiskHeatMap() {
  const grid: (typeof riskHeatMap[number] | null)[][] = Array.from({ length: 4 }, () => Array(4).fill(null));
  riskHeatMap.forEach((cell) => {
    grid[4 - cell.impact][cell.probability - 1] = cell;
  });

  return (
    <Card>
      <CardHeader><CardTitle>Risk Heat Map</CardTitle></CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="flex flex-col justify-between py-1 text-[10px] font-medium text-ink-secondary dark:text-dark-subtext">
            <span>Impact ↑</span>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-1.5">
              {grid.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={cn(
                      'flex aspect-square items-center justify-center rounded-lg text-sm font-bold transition-transform hover:scale-105',
                      cell ? cellColor(cell.label) : 'bg-slate-50 text-slate-300 dark:bg-white/5'
                    )}
                    title={cell ? `${cell.label} — ${cell.count} risques` : undefined}
                  >
                    {cell ? cell.count : ''}
                  </div>
                ))
              )}
            </div>
            <p className="mt-2 text-center text-[10px] font-medium text-ink-secondary dark:text-dark-subtext">Probabilité →</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {['Low', 'Medium', 'High', 'Critical'].map((l) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-ink-secondary dark:text-dark-subtext">
              <span className={cn('h-2.5 w-2.5 rounded-sm', cellColor(l).split(' ')[0])} />
              {l}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
