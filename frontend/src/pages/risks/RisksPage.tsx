import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/shared/DataTable';
import { RiskHeatMap } from '../../components/dashboard/RiskHeatMap';
import { riskItems } from '../../services/mockData';
import type { RiskItem } from '../../types';

const priorityFor = (p: number, i: number) => {
  const score = p * i;
  if (score >= 9) return { label: 'Critical', tone: 'danger' as const };
  if (score >= 6) return { label: 'High', tone: 'warning' as const };
  if (score >= 3) return { label: 'Medium', tone: 'info' as const };
  return { label: 'Low', tone: 'success' as const };
};

const columns: Column<RiskItem>[] = [
  { header: 'Référence', accessor: (r) => <span className="font-mono text-xs font-semibold text-primary">{r.reference}</span> },
  { header: 'Risque', accessor: (r) => <span className="font-medium">{r.title}</span> },
  { header: 'Catégorie', accessor: (r) => <Badge tone="neutral">{r.category}</Badge> },
  { header: 'Probabilité', accessor: (r) => `${r.probability}/4` },
  { header: 'Impact', accessor: (r) => `${r.impact}/4` },
  { header: 'Priorité', accessor: (r) => { const p = priorityFor(r.probability, r.impact); return <Badge tone={p.tone}>{p.label}</Badge>; } },
  { header: 'Responsable', accessor: (r) => r.owner },
  { header: 'Statut', accessor: (r) => <StatusBadge status={r.status} /> },
];

export default function RisksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des risques"
        description="Matrice probabilité / impact et suivi des actions de mitigation"
        actions={<Button variant="primary"><Icon name="Plus" size={16} /> Nouveau risque</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1"><RiskHeatMap /></div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {[
            { label: 'Risques critiques', value: 3, tone: 'text-danger', icon: 'AlertOctagon' },
            { label: 'Risques élevés', value: 6, tone: 'text-warning', icon: 'AlertTriangle' },
            { label: 'En cours de mitigation', value: 9, tone: 'text-info', icon: 'Activity' },
            { label: 'Clôturés ce trimestre', value: 14, tone: 'text-success', icon: 'CheckCircle2' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-surface-border bg-surface-card p-5 dark:border-dark-border dark:bg-dark-card">
              <Icon name={s.icon} size={20} className={s.tone} />
              <p className={`mt-3 text-2xl font-bold ${s.tone}`}>{s.value}</p>
              <p className="mt-1 text-sm text-ink-secondary dark:text-dark-subtext">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={riskItems} />
    </div>
  );
}
