export type Status = 'open' | 'in_progress' | 'closed' | 'overdue' | 'draft' | 'approved' | 'expired';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface KpiCard {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  trend?: 'up' | 'down' | 'flat';
  icon: string;
  tone: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
}

export type AuditType = 'Internal' | 'Supplier' | 'Regulatory' | 'Self-Inspection' | 'Audit Chaîne du froid' | 'Audit Distributeur' | 'Audit Entrepôt' | 'Audit Fournisseur' | 'Audit Réglementaire' | 'Audit Système Qualité' | 'Audit Transport';

export interface AuditItem {
  id: string;
  reference: string;
  title: string;
  site: string;
  auditor: string;
  type: AuditType;
  status: Status;
  score: number;
  date: string;
}

export interface CapaItem {
  id: string;
  reference: string;
  title: string;
  source: string;
  owner: string;
  priority: Priority;
  status: 'draft' | 'in_progress' | 'review' | 'closed';
  dueDate: string;
  progress: number;
}

export interface RiskItem {
  id: string;
  reference: string;
  title: string;
  category: string;
  probability: number;
  impact: number;
  owner: string;
  status: Status;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'SOP' | 'Policy' | 'Form' | 'Report' | 'Certificate';
  version: string;
  status: 'draft' | 'in_review' | 'approved' | 'expired';
  owner: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface SensorReading {
  id: string;
  location: string;
  type: 'temperature' | 'humidity';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'alert';
  min: number;
  max: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
