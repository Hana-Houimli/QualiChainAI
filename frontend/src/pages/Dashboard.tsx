import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { KpiCardView } from '../components/dashboard/KpiCardView';
import { ComplianceScoreCard } from '../components/dashboard/ComplianceScoreCard';
import {
  ComplianceEvolutionChart, CapaProgressChart, AuditPerformanceChart,
  MonthlyTrendsChart, TemperatureMonitoringChart,
} from '../components/dashboard/ChartWidgets';
import { RiskHeatMap } from '../components/dashboard/RiskHeatMap';
import { EquipmentStatusWidget, ActivityFeedWidget } from '../components/dashboard/SideWidgets';
import { kpiCards, complianceScore } from '../services/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de la conformité qualité — mis à jour il y a 3 minutes"
        actions={
          <>
            <Button variant="outline" size="md">
              <Icon name="Calendar" size={16} /> Ce mois-ci
            </Button>
            <Button variant="primary" size="md">
              <Icon name="Download" size={16} /> Exporter
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ComplianceScoreCard score={complianceScore} />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 xl:grid-cols-3">
          {kpiCards.map((kpi, i) => (
            <KpiCardView key={kpi.id} kpi={kpi} index={i} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2"><ComplianceEvolutionChart /></div>
        <CapaProgressChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AuditPerformanceChart />
        <RiskHeatMap />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2"><TemperatureMonitoringChart /></div>
        <EquipmentStatusWidget />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MonthlyTrendsChart />
        <ActivityFeedWidget />
      </div>
    </div>
  );
}
