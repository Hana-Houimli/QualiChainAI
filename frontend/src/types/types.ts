export type Status ='brouillon' | 'en cours' | 'terminé' |'error';

export type AuditType =
  | "Audit transport pharmaceutique"
  | "Audit système qualité"
  | "Audit conformité réglementaire"
  | "Audit fournisseur pharmaceutique"
  | "Audit entrepôt de stockage pharmaceutique"
  | "Audit distributeur pharmaceutique"
  | "Audit chaîne du froid pharmaceutique";
  


export type CapaPriority =
  | 'Critique'
  | 'Majeure'
  | 'Mineure';

export type CapaStatus =
  | 'Ouverte'
  | 'Terminé'
  | 'Expiré';

export type CapaSourceFilter =
  | 'Toutes'
  | 'Audits'
  | 'Réclamations';