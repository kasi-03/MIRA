import { apiClient } from './apiClient';

/**
 * Task Service — interfaces with /api/tasks
 */
export const taskService = {
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/tasks${query ? `?${query}` : ''}`;
    return apiClient.get(endpoint);
  },

  async getTask(taskId) {
    return apiClient.get(`/api/tasks/${taskId}`);
  },

  async submitTask(rawPrompt, deviceId) {
    return apiClient.post('/api/tasks', {
      raw_prompt: rawPrompt,
      device_id: deviceId,
    });
  },

  async confirmTask(taskId) {
    return apiClient.post(`/api/tasks/${taskId}/confirm`, {});
  },

  async cancelTask(taskId, reason) {
    return apiClient.post(`/api/tasks/${taskId}/cancel`, { reason });
  },
};
