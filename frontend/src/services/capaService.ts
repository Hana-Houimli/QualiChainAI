import { apiRequest } from './api';

import type {
  CapaPlan,
} from '../types';

export const capaService = {
  async getAll(): Promise<CapaPlan[]> {
    return apiRequest<CapaPlan[]>('/capa/');
  },

  async generate(message: string) {
    return apiRequest(
      '/capa/generate',
      {
        method: 'POST',
        body: JSON.stringify({
          message,
        }),
      }
    );
  },

  async updateActionStatus(
    capaId: string,
    actionIndex: number,
    statutAction: string
  ) {
    return apiRequest(
      `/capa/${capaId}/actions/${actionIndex}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          statut_action: statutAction,
        }),
      }
    );
  },

  async deleteAction(
    capaId: string,
    actionIndex: number
  ) {
    return apiRequest(
      `/capa/${capaId}/actions/${actionIndex}`,
      {
        method: 'DELETE',
      }
    );
  },

  async getByAudit(auditId: string): Promise<CapaPlan> {
    return apiRequest<CapaPlan>(
      `/capa/audit/${auditId}`
    );
  },

  async generateForAudit(auditId: string) {
    return apiRequest(
      '/capa/audit/generate',
      {
        method: 'POST',
        body: JSON.stringify({
          audit_id: auditId,
        }),
      }
    );
  },
};