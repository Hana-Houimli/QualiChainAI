import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { sensorReadings } from '../../services/mockData';
import { cn } from '../../utils/cn';

export function EquipmentStatusWidget() {
  return (
    <Card>
      <CardHeader><CardTitle>Equipment Status</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {sensorReadings.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-surface-border p-3 dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg',
                s.status === 'alert' ? 'bg-red-50 text-danger dark:bg-danger/15' :
                s.status === 'warning' ? 'bg-amber-50 text-warning dark:bg-warning/15' :
                'bg-green-50 text-success dark:bg-success/15')}>
                <Icon name={s.type === 'temperature' ? 'Thermometer' : 'Droplets'} size={17} />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-primary dark:text-dark-text">{s.location}</p>
                <p className="text-xs text-ink-secondary dark:text-dark-subtext">Plage: {s.min}–{s.max}{s.unit}</p>
              </div>
            </div>
            <span className={cn('text-sm font-bold',
              s.status === 'alert' ? 'text-danger' : s.status === 'warning' ? 'text-warning' : 'text-success')}>
              {s.value}{s.unit}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const activity = [
  { icon: 'FileCheck', text: 'SOP-QA-014 v4.2 approuvé par L. Garcia', time: 'il y a 25 min', tone: 'success' },
  { icon: 'AlertTriangle', text: 'Excursion température — Chambre froide 2', time: 'il y a 40 min', tone: 'danger' },
  { icon: 'ClipboardCheck', text: 'Audit AUD-2026-041 démarré à Tunis', time: 'il y a 2 h', tone: 'info' },
  { icon: 'ListChecks', text: 'CAPA-2026-117 déplacée en revue', time: 'il y a 4 h', tone: 'warning' },
  { icon: 'GraduationCap', text: '12 collaborateurs ont terminé le module GDP', time: 'hier', tone: 'primary' },
];

export function ActivityFeedWidget() {
  return (
    <Card>
      <CardHeader><CardTitle>Activité récente</CardTitle></CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {activity.map((a, i) => (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  a.tone === 'danger' ? 'bg-red-50 text-danger dark:bg-danger/15' :
                  a.tone === 'warning' ? 'bg-amber-50 text-warning dark:bg-warning/15' :
                  a.tone === 'success' ? 'bg-green-50 text-success dark:bg-success/15' :
                  a.tone === 'info' ? 'bg-blue-50 text-info dark:bg-info/15' :
                  'bg-primary-50 text-primary dark:bg-primary/15')}>
                  <Icon name={a.icon} size={14} />
                </span>
                {i < activity.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-surface-border dark:bg-dark-border" />}
              </div>
              <div className="pb-1">
                <p className="text-sm text-ink-primary dark:text-dark-text">{a.text}</p>
                <p className="text-xs text-ink-secondary dark:text-dark-subtext">{a.time}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
