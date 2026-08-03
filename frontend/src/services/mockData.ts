import type {
  KpiCard, AuditItem, CapaItem, RiskItem, DocumentItem, SensorReading,
} from '../types';

export const complianceScore = 94.2;

export const kpiCards: KpiCard[] = [
  { id: 'capa', label: 'Open CAPA', value: 18, delta: -3, deltaLabel: 'vs last month', trend: 'down', icon: 'ClipboardList', tone: 'primary' },
  { id: 'audits', label: 'Open Audits', value: 7, delta: 2, deltaLabel: 'vs last month', trend: 'up', icon: 'ClipboardCheck', tone: 'info' },
  { id: 'docs', label: 'Documents Expired', value: 4, delta: -1, deltaLabel: 'vs last month', trend: 'down', icon: 'FileWarning', tone: 'danger' },
  { id: 'nc', label: 'Non Conformities', value: 11, delta: 1, deltaLabel: 'vs last month', trend: 'up', icon: 'AlertTriangle', tone: 'warning' },
  { id: 'risks', label: 'Active Risks', value: 23, delta: -5, deltaLabel: 'vs last month', trend: 'down', icon: 'ShieldAlert', tone: 'secondary' },
  { id: 'equipment', label: 'Equipment Status', value: '98.6%', delta: 0.4, deltaLabel: 'uptime', trend: 'up', icon: 'Gauge', tone: 'success' },
];

export const complianceEvolution = [
  { month: 'Feb', score: 88 }, { month: 'Mar', score: 89.5 }, { month: 'Apr', score: 90 },
  { month: 'May', score: 91.2 }, { month: 'Jun', score: 92 }, { month: 'Jul', score: 93.1 },
  { month: 'Aug', score: 94.2 },
];

export const capaProgress = [
  { name: 'Draft', value: 5, color: '#94A3B8' },
  { name: 'In Progress', value: 9, color: '#3B82F6' },
  { name: 'Review', value: 4, color: '#F59E0B' },
  { name: 'Closed', value: 21, color: '#16A34A' },
];

export const auditPerformance = [
  { site: 'Site A - Lyon', score: 96 }, { site: 'Site B - Milan', score: 89 },
  { site: 'Site C - Casablanca', score: 92 }, { site: 'Site D - Tunis', score: 98 },
  { site: 'Site E - Madrid', score: 85 },
];

export const monthlyTrends = [
  { month: 'Feb', audits: 4, capa: 12, nc: 8 }, { month: 'Mar', audits: 6, capa: 15, nc: 6 },
  { month: 'Apr', audits: 5, capa: 10, nc: 9 }, { month: 'May', audits: 7, capa: 14, nc: 5 },
  { month: 'Jun', audits: 6, capa: 11, nc: 7 }, { month: 'Jul', audits: 8, capa: 13, nc: 4 },
  { month: 'Aug', audits: 7, capa: 9, nc: 3 },
];

export const temperatureMonitoring = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  cold_room_1: +(4 + Math.sin(i / 3) * 1.2 + Math.random() * 0.4).toFixed(1),
  cold_room_2: +(6 + Math.cos(i / 4) * 1.5 + Math.random() * 0.3).toFixed(1),
  warehouse: +(19 + Math.sin(i / 5) * 2 + Math.random() * 0.5).toFixed(1),
}));

export const riskHeatMap: { probability: number; impact: number; count: number; label: string }[] = [
  { probability: 1, impact: 1, count: 2, label: 'Low' }, { probability: 2, impact: 1, count: 3, label: 'Low' },
  { probability: 3, impact: 1, count: 1, label: 'Medium' }, { probability: 1, impact: 2, count: 4, label: 'Low' },
  { probability: 2, impact: 2, count: 5, label: 'Medium' }, { probability: 3, impact: 2, count: 3, label: 'High' },
  { probability: 4, impact: 2, count: 2, label: 'High' }, { probability: 1, impact: 3, count: 1, label: 'Medium' },
  { probability: 2, impact: 3, count: 3, label: 'High' }, { probability: 3, impact: 3, count: 4, label: 'Critical' },
  { probability: 4, impact: 3, count: 2, label: 'Critical' }, { probability: 2, impact: 4, count: 2, label: 'High' },
  { probability: 3, impact: 4, count: 2, label: 'Critical' }, { probability: 4, impact: 4, count: 1, label: 'Critical' },
];

export const audits: AuditItem[] = [
  { id: 'a1', reference: 'AUD-2026-041', title: 'Cold Chain Distribution Audit', site: 'Site D - Tunis', auditor: 'S. Ben Amor', type: 'Internal', status: 'in_progress', score: 92, date: '2026-08-05' },
  { id: 'a2', reference: 'AUD-2026-040', title: 'Supplier Qualification - MedSup SA', site: 'Site A - Lyon', auditor: 'J. Dupont', type: 'Supplier', status: 'open', score: 0, date: '2026-08-12' },
  { id: 'a3', reference: 'AUD-2026-039', title: 'GDP Regulatory Inspection', site: 'Site B - Milan', auditor: 'ANSM Team', type: 'Regulatory', status: 'closed', score: 89, date: '2026-07-22' },
  { id: 'a4', reference: 'AUD-2026-038', title: 'Warehouse Self-Inspection Q3', site: 'Site C - Casablanca', auditor: 'F. El Amrani', type: 'Self-Inspection', status: 'overdue', score: 0, date: '2026-07-15' },
  { id: 'a5', reference: 'AUD-2026-037', title: 'Temperature Excursion Follow-up', site: 'Site E - Madrid', auditor: 'L. Garcia', type: 'Internal', status: 'closed', score: 96, date: '2026-07-10' },
  { id: 'a6', reference: 'AUD-2026-036', title: 'Distributor Compliance Review', site: 'Site D - Tunis', auditor: 'S. Ben Amor', type: 'Supplier', status: 'open', score: 0, date: '2026-08-20' },
];

export const capaItems: CapaItem[] = [
  { id: 'c1', reference: 'CAPA-2026-118', title: 'Deviation - Cold Room 2 Excursion', source: 'IoT Alert', owner: 'M. Haddad', priority: 'critical', status: 'in_progress', dueDate: '2026-08-08', progress: 60 },
  { id: 'c2', reference: 'CAPA-2026-117', title: 'Update SOP for Returns Handling', source: 'Internal Audit', owner: 'J. Dupont', priority: 'medium', status: 'review', dueDate: '2026-08-15', progress: 85 },
  { id: 'c3', reference: 'CAPA-2026-116', title: 'Retrain Warehouse Staff - GDP', source: 'Training Gap', owner: 'F. El Amrani', priority: 'high', status: 'draft', dueDate: '2026-08-25', progress: 10 },
  { id: 'c4', reference: 'CAPA-2026-115', title: 'Corrective Action - Supplier Non-Conformity', source: 'Supplier Audit', owner: 'L. Garcia', priority: 'high', status: 'in_progress', dueDate: '2026-08-10', progress: 45 },
  { id: 'c5', reference: 'CAPA-2026-114', title: 'Document Control Process Gap', source: 'Regulatory Inspection', owner: 'S. Ben Amor', priority: 'medium', status: 'closed', dueDate: '2026-07-30', progress: 100 },
  { id: 'c6', reference: 'CAPA-2026-113', title: 'Recalibrate Warehouse Sensors', source: 'Equipment Check', owner: 'M. Haddad', priority: 'low', status: 'closed', dueDate: '2026-07-20', progress: 100 },
];

export const riskItems: RiskItem[] = [
  { id: 'r1', reference: 'RISK-041', title: 'Cold Chain Break During Transport', category: 'Logistics', probability: 3, impact: 4, owner: 'M. Haddad', status: 'open' },
  { id: 'r2', reference: 'RISK-040', title: 'Counterfeit Product Infiltration', category: 'Security', probability: 2, impact: 4, owner: 'L. Garcia', status: 'open' },
  { id: 'r3', reference: 'RISK-039', title: 'Supplier Data Integrity Failure', category: 'Data Integrity', probability: 2, impact: 3, owner: 'J. Dupont', status: 'in_progress' },
  { id: 'r4', reference: 'RISK-038', title: 'Warehouse Power Outage', category: 'Infrastructure', probability: 1, impact: 3, owner: 'F. El Amrani', status: 'closed' },
  { id: 'r5', reference: 'RISK-037', title: 'Staff Training Non-Compliance', category: 'Human Resources', probability: 3, impact: 2, owner: 'S. Ben Amor', status: 'open' },
];

export const documents: DocumentItem[] = [
  { id: 'd1', name: 'SOP-QA-014 Cold Chain Management', type: 'SOP', version: 'v4.2', status: 'approved', owner: 'M. Haddad', updatedAt: '2026-06-14', expiresAt: '2027-06-14' },
  { id: 'd2', name: 'Supplier Qualification Policy', type: 'Policy', version: 'v2.0', status: 'in_review', owner: 'J. Dupont', updatedAt: '2026-07-28' },
  { id: 'd3', name: 'Temperature Deviation Report Form', type: 'Form', version: 'v1.5', status: 'approved', owner: 'L. Garcia', updatedAt: '2026-05-02', expiresAt: '2026-08-10' },
  { id: 'd4', name: 'GDP Compliance Certificate - Site D', type: 'Certificate', version: 'v1.0', status: 'expired', owner: 'S. Ben Amor', updatedAt: '2025-08-01', expiresAt: '2026-08-01' },
  { id: 'd5', name: 'Quarterly Quality Report Q2 2026', type: 'Report', version: 'v1.0', status: 'approved', owner: 'F. El Amrani', updatedAt: '2026-07-05' },
  { id: 'd6', name: 'SOP-WH-009 Warehouse Receiving', type: 'SOP', version: 'v3.1', status: 'draft', owner: 'M. Haddad', updatedAt: '2026-07-30' },
];

export const sensorReadings: SensorReading[] = [
  { id: 's1', location: 'Cold Room 1 - Tunis', type: 'temperature', value: 4.2, unit: '°C', status: 'normal', min: 2, max: 8 },
  { id: 's2', location: 'Cold Room 2 - Tunis', type: 'temperature', value: 8.9, unit: '°C', status: 'alert', min: 2, max: 8 },
  { id: 's3', location: 'Main Warehouse - Tunis', type: 'temperature', value: 21.4, unit: '°C', status: 'normal', min: 15, max: 25 },
  { id: 's4', location: 'Main Warehouse - Tunis', type: 'humidity', value: 58, unit: '%', status: 'warning', min: 30, max: 55 },
  { id: 's5', location: 'Cold Room 1 - Lyon', type: 'temperature', value: 5.1, unit: '°C', status: 'normal', min: 2, max: 8 },
  { id: 's6', location: 'Cold Room 3 - Milan', type: 'temperature', value: 3.8, unit: '°C', status: 'normal', min: 2, max: 8 },
];
