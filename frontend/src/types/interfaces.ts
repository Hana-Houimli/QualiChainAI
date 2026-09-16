import type{ Status , AuditType ,CapaPriority, CapaStatus} from './types';


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

export interface Conversation {
  conversation_id: string;
  title?: string;
  created_at?: string;
}

export interface ChatResponse {
  answer: string;
}

export interface ConversationData {
  conversation_id: string;
  title?: string;
  messages: ChatMessage[];
}

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

export interface AuditFormData {
  type: AuditType;
  site: string;
  auditor: string;
  date: string;
}

export interface GenerateAuditRequest {
  type_audit: AuditType;
  site_audit: string;
  responsable: string;
  date_audit: string;
}

export interface GenerateAuditResponse {
  audit_id: string;
}

export interface PointControle {
  question: string;
  criticite: string;
  preuve_attendue: string;
  resultat: string;
  commentaire: string;
}

export interface Section {
  nom_section: string;
  points_controle: PointControle[];
}

export interface AnalysisResume {
  total_points: number;
  conformes: number;
  non_conformes: number;
  non_applicables: number;
}

export interface Analysis {
  score_conformite: number;
  statut_global: string;
  resume: AnalysisResume;
  observations: string[];
}

export interface Audit {
  audit_id: string;
  type_audit: string;
  site_audit: string;
  date_creation: string;
  date_audit: string;
  status: string;
  responsable: string;
  sections: Section[];
  analysis?: Analysis;
}

export interface CapaAction {
  probleme: string;
  cause_racine: string;
  action_corrective: string;
  action_preventive: string;
  priorite: CapaPriority;
  responsable: string;
  echeance: string;
  statut_action: CapaStatus;
}

export interface CapaPlan {
  created_at: string;
  capa_id: string;
  audit_id?: string;
  description_probleme?: string;
  resume: string;
  actions: CapaAction[];
}

export interface CapaCard {
  id: string;
  capaId: string;
  actionIndex: number;
  reference: string;
  title: string;
  source: string;
  owner: string;
  priority: CapaPriority;
  status: CapaStatus;
  dueDate: string;
  progress: number;
  action: CapaAction;
  capa: CapaPlan;
}

export interface GenerateReportResponse {
  message: string;
  report_id: string;
  audit_id: string;
  status: string;
}