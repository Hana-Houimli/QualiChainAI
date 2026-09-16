import { apiRequest } from './api';

import type {
  GenerateReportResponse,
} from '../types';

export const reportService = {
  async generate(
    auditId: string
  ): Promise<GenerateReportResponse> {
    return apiRequest<GenerateReportResponse>(
      '/reports/generate',
      {
        method: 'POST',
        body: JSON.stringify({
          audit_id: auditId,
        }),
      }
    );
  },
};