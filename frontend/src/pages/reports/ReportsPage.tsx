import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { MonthlyTrendsChart, ComplianceEvolutionChart, AuditPerformanceChart } from '../../components/dashboard/ChartWidgets';

const exportables = [
  { name: 'Rapport de conformité mensuel', format: 'PDF', size: '2.4 MB', date: '01 août 2026' },
  { name: 'Registre des CAPA — Q2 2026', format: 'Excel', size: '890 KB', date: '15 juillet 2026' },
  { name: 'Synthèse des audits fournisseurs', format: 'PDF', size: '1.8 MB', date: '10 juillet 2026' },
  { name: 'Tableau de bord risques', format: 'Excel', size: '640 KB', date: '02 juillet 2026' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rapports & Analytics"
        description="KPIs consolidés, exports réglementaires et analyses de tendance"
        actions={
          <>
            <Button variant="outline"><Icon name="FileSpreadsheet" size={16} /> Export Excel</Button>
            <Button variant="primary"><Icon name="FileDown" size={16} /> Export PDF</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ComplianceEvolutionChart />
        <AuditPerformanceChart />
      </div>
      <MonthlyTrendsChart />

      <Card>
        <div className="flex items-center justify-between px-5 pt-5">
          <h3 className="text-sm font-semibold text-ink-primary dark:text-dark-text">Rapports générés</h3>
          <Button variant="ghost" size="sm">Voir tout</Button>
        </div>
        <div className="divide-y divide-surface-border dark:divide-dark-border">
          {exportables.map((r) => (
            <div key={r.name} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-ink-secondary dark:bg-white/5 dark:text-dark-subtext">
                  <Icon name={r.format === 'PDF' ? 'FileText' : 'FileSpreadsheet'} size={17} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary dark:text-dark-text">{r.name}</p>
                  <p className="text-xs text-ink-secondary dark:text-dark-subtext">{r.format} · {r.size} · {r.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon"><Icon name="Download" size={16} /></Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
