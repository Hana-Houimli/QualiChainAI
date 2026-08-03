import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, LineChart, Line,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import {
  complianceEvolution, capaProgress, auditPerformance, monthlyTrends, temperatureMonitoring,
} from '../../services/mockData';

const tooltipStyle = {
  borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12,
  boxShadow: '0 8px 20px -6px rgba(15,23,42,0.15)',
};

export function ComplianceEvolutionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Evolution</CardTitle>
        <span className="text-xs text-ink-secondary dark:text-dark-subtext">6 derniers mois</span>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={complianceEvolution} margin={{ left: -20, top: 10 }}>
            <defs>
              <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F4C81" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0F4C81" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="score" stroke="#0F4C81" strokeWidth={2.5} fill="url(#complianceGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CapaProgressChart() {
  return (
    <Card>
      <CardHeader><CardTitle>CAPA Progress</CardTitle></CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={capaProgress} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
              {capaProgress.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AuditPerformanceChart() {
  return (
    <Card>
      <CardHeader><CardTitle>Audit Performance by Site</CardTitle></CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={auditPerformance} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="site" width={110} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="score" fill="#14B8A6" radius={[0, 6, 6, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MonthlyTrendsChart() {
  return (
    <Card>
      <CardHeader><CardTitle>Monthly Trends</CardTitle></CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyTrends} margin={{ left: -20, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="audits" stroke="#0F4C81" strokeWidth={2} dot={false} name="Audits" />
            <Line type="monotone" dataKey="capa" stroke="#14B8A6" strokeWidth={2} dot={false} name="CAPA" />
            <Line type="monotone" dataKey="nc" stroke="#DC2626" strokeWidth={2} dot={false} name="Non-Conformités" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TemperatureMonitoringChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature Monitoring — 24h</CardTitle>
        <span className="text-xs text-ink-secondary dark:text-dark-subtext">Temps réel</span>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={temperatureMonitoring} margin={{ left: -20, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="time" interval={3} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} unit="°C" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="cold_room_1" stroke="#0F4C81" strokeWidth={2} dot={false} name="Chambre froide 1" />
            <Line type="monotone" dataKey="cold_room_2" stroke="#DC2626" strokeWidth={2} dot={false} name="Chambre froide 2" />
            <Line type="monotone" dataKey="warehouse" stroke="#14B8A6" strokeWidth={2} dot={false} name="Entrepôt principal" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
