// ============================================================================
// MIRA API Service Adapter
// Provides unified interface for backend API calls with graceful fallback
// to deterministic local simulation when backend services are not running.
// ============================================================================

const API_BASE = '/api';

export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      return { live: true, data: await res.json() };
    }
  } catch (err) {
    // Expected when running frontend before backend container is launched
  }
  return { live: false, message: "Backend offline. Running in deterministic client demo mode." };
};

export const apiService = {
  // Task Endpoints
  async getTasks() {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback handled in AppContext
    }
    return null;
  },

  async createTask(payload) {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return null;
  },

  async confirmTask(taskId) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/confirm`, {
        method: 'POST'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return null;
  },

  async submitApproval(taskId, approvalId, decision, justification) {
    try {
      const res = await fetch(`${API_BASE}/approvals/${approvalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, justification })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return null;
  },

  async getDevices() {
    try {
      const res = await fetch(`${API_BASE}/devices`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return null;
  }
};
