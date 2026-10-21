/**
 * MIRA Frontend API Client
 * Normalizes HTTP requests, handles network timeouts, and wraps errors.
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        status: response.status,
        error: errorBody.error || 'HTTP_ERROR',
        message: errorBody.message || `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'TIMEOUT',
        message: 'Request timed out waiting for backend response.',
      };
    }
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Unable to reach MIRA backend. The service may not be running.',
    };
  }
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  del: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};
