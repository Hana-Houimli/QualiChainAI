export type Status ='brouillon' | 'en cours' | 'terminé' |'error';

export type AuditType =
  | "Audit transport pharmaceutique"
  | "Audit système qualité"
  | "Audit conformité réglementaire"
  | "Audit fournisseur pharmaceutique"
  | "Audit entrepôt de stockage pharmaceutique"
  | "Audit distributeur pharmaceutique"
  | "Audit chaîne du froid pharmaceutique";
export interface AuditItem {
  id: string;
  reference: string;
  title: string;
  site: string;
  auditor: string;
  type: AuditType;
  status: Status;
  score: number | null;
  date: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: string;
}