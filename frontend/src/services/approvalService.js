import { apiClient } from './apiClient';

/**
 * Approval Service — interfaces with /api/approvals
 */
export const approvalService = {
  async getPendingApprovals() {
    return apiClient.get('/api/approvals?status=pending');
  },

  async getApproval(approvalId) {
    return apiClient.get(`/api/approvals/${approvalId}`);
  },

  async approve(approvalId, decisionData = {}) {
    return apiClient.post(`/api/approvals/${approvalId}/approve`, decisionData);
  },

  async reject(approvalId, reason) {
    return apiClient.post(`/api/approvals/${approvalId}/reject`, { reason });
  },
};
