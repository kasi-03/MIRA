import { apiClient } from './apiClient';

/**
 * Artifact Service — interfaces with /api/artifacts
 */
export const artifactService = {
  async getArtifacts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/artifacts${query ? `?${query}` : ''}`;
    return apiClient.get(endpoint);
  },

  async getArtifact(artifactId) {
    return apiClient.get(`/api/artifacts/${artifactId}`);
  },

  async getArtifactContent(artifactId) {
    return apiClient.get(`/api/artifacts/${artifactId}/content`);
  },
};
