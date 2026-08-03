import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { TemperatureMonitoringChart } from '../../components/dashboard/ChartWidgets';
import { sensorReadings } from '../../services/mockData';
import { cn } from '../../utils/cn';

export default function IotMonitoringPage() {
  const alerts = sensorReadings.filter((s) => s.status !== 'normal');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Surveillance IoT"
        description="Température et humidité en temps réel — entrepôts et chambres froides"
        actions={<Button variant="outline"><Icon name="RefreshCw" size={16} /> Actualiser</Button>}
      />

      {alerts.length > 0 && (
        <div className="rounded-2xl border border-danger/20 bg-red-50/60 p-4 dark:border-danger/30 dark:bg-danger/5">
          <div className="flex items-center gap-2 text-sm font-semibold text-danger">
            <Icon name="AlertTriangle" size={16} /> {alerts.length} alerte(s) active(s)
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {alerts.map((a) => (
              <span key={a.id} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-danger shadow-soft dark:bg-dark-card">
                {a.location} — {a.value}{a.unit}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sensorReadings.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl',
                s.status === 'alert' ? 'bg-red-50 text-danger dark:bg-danger/15' :
                s.status === 'warning' ? 'bg-amber-50 text-warning dark:bg-warning/15' :
                'bg-green-50 text-success dark:bg-success/15')}>
                <Icon name={s.type === 'temperature' ? 'Thermometer' : 'Droplets'} size={20} />
              </div>
              <span className={cn('h-2.5 w-2.5 rounded-full',
                s.status === 'alert' ? 'bg-danger animate-pulse' : s.status === 'warning' ? 'bg-warning' : 'bg-success')} />
            </div>
            <p className="mt-4 text-3xl font-bold text-ink-primary dark:text-dark-text">{s.value}{s.unit}</p>
            <p className="mt-1 text-sm text-ink-secondary dark:text-dark-subtext">{s.location}</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className={cn('h-full rounded-full', s.status === 'alert' ? 'bg-danger' : s.status === 'warning' ? 'bg-warning' : 'bg-success')}
                style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-secondary dark:text-dark-subtext">Plage cible: {s.min}–{s.max}{s.unit}</p>
          </Card>
        ))}
      </div>

      <TemperatureMonitoringChart />
    </div>
  );
}
