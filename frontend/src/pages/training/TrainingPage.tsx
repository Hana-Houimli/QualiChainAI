import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const courses = [
  { title: 'Bonnes Pratiques de Distribution (GDP)', modules: 8, progress: 100, status: 'Certifié', icon: 'ShieldCheck' },
  { title: 'Gestion de la chaîne du froid', modules: 6, progress: 65, status: 'En cours', icon: 'Thermometer' },
  { title: 'Gestion des CAPA', modules: 5, progress: 30, status: 'En cours', icon: 'ListChecks' },
  { title: 'Intégrité des données (Data Integrity)', modules: 7, progress: 0, status: 'À commencer', icon: 'Database' },
];

const stats = [
  { label: 'Taux de complétion global', value: '87%', icon: 'TrendingUp', tone: 'text-success' },
  { label: 'Certifications actives', value: 214, icon: 'Award', tone: 'text-primary' },
  { label: 'Formations en retard', value: 6, icon: 'AlertTriangle', tone: 'text-warning' },
  { label: 'Score moyen aux quiz', value: '91%', icon: 'Target', tone: 'text-secondary' },
];

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Formation"
        description="Cours, quiz et certifications de conformité qualité"
        actions={<Button variant="primary"><Icon name="Plus" size={16} /> Assigner une formation</Button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <Icon name={s.icon} size={20} className={s.tone} />
            <p className={`mt-3 text-2xl font-bold ${s.tone}`}>{s.value}</p>
            <p className="mt-1 text-sm text-ink-secondary dark:text-dark-subtext">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {courses.map((c) => (
          <Card key={c.title} className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary/15 dark:text-primary-100">
              <Icon name={c.icon} size={19} />
            </div>
            <p className="mt-4 text-sm font-semibold leading-snug text-ink-primary dark:text-dark-text">{c.title}</p>
            <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">{c.modules} modules</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div className="h-full rounded-full bg-secondary" style={{ width: `${c.progress}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-medium text-ink-secondary dark:text-dark-subtext">{c.progress}%</span>
              <Badge tone={c.status === 'Certifié' ? 'success' : c.status === 'En cours' ? 'info' : 'neutral'}>{c.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
