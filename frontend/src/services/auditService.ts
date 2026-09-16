import { apiRequest, API_URL } from './api';

import type {
  Audit,
  AuditItem,
  GenerateAuditRequest,
  GenerateAuditResponse,
} from '../types';

import type {
  AuditType,
} from '../types';

export const auditService = {
  async getAll(): Promise<AuditItem[]> {
    const data = await apiRequest<any[]>(
      '/audits/'
    );

    return data.map((audit) => ({
      id: audit.audit_id,
      reference: audit.audit_id,
      title:
        `${audit.type_audit} - ${audit.site_audit}`,
      site: audit.site_audit,
      auditor:
        audit.responsable || 'Non renseigné',
      type: audit.type_audit as AuditType,
      status:
        audit.status || 'brouillon',
      score:
        audit.analysis?.score_conformite ?? null,
      date:
        audit.date_audit || '',
    }));
  },

  async getById(
    auditId: string
  ): Promise<Audit> {
    return apiRequest<Audit>(
      `/audits/${auditId}`
    );
  },

  async delete(
    auditId: string
  ): Promise<void> {
    await apiRequest(
      `/audits/${auditId}`,
      {
        method: 'DELETE',
      }
    );
  },

  async generate(
    data: GenerateAuditRequest
  ): Promise<GenerateAuditResponse> {
    return apiRequest<GenerateAuditResponse>(
      '/audits/generate',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async update(
    auditId: string,
    data: {
      sections: Audit['sections'];
      status: string;
      date_audit: string;
      responsable: string;
    }
  ) {
    return apiRequest(
      `/audits/${auditId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  async analyze(
    auditId: string
  ) {
    return apiRequest(
      '/audits/analyze',
      {
        method: 'POST',
        body: JSON.stringify({
          audit_id: auditId,
        }),
      }
    );
  },
    getPdfUrl(auditId: string): string {
    return `${API_URL}/audits/pdf/audit/${auditId}`;
  },
};