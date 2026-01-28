// src/lib/apiClient.js
import axios from "axios";

// Sanitize base URL (strip accidental surrounding quotes from .env)
const baseURL = (import.meta.env.VITE_APP_DOMAIN || "").replace(/^['\"]|['\"]$/g, '');
const token = localStorage.getItem("token");
const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  },
});

// Automatically attach token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // Do not attach Authorization header for public endpoints (signin/signup)
    const isPublicEndpoint = config.url && /\/public\//.test(config.url);
  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Add a temporary debug id and log request payloads for signup/signin
  try {
    // Add a local-only debug id (not sent as a header) to help correlate logs without triggering CORS preflights
    const debugId = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    // attach to config (axios will keep this on the config object but it won't be sent over the wire)
    config._debugId = debugId;

    // Only log in development to avoid leaking info in production
    if (import.meta.env.DEV && config.url && /(\/public\/signup|\/public\/signin)$/.test(config.url)) {
      console.debug(`[apiClient][${debugId}] -> ${config.method?.toUpperCase() || 'REQUEST'} ${config.baseURL || ''}${config.url}`, config.data || config.params || {});
    }
  } catch (e) {
    // ignore logging failures
  }
  return config;
});

// Log responses for signup/signin to help debug duplicate/500 issues
apiClient.interceptors.response.use(
  (response) => {
    try {
      const debugId = response.config?._debugId;
      if (import.meta.env.DEV && debugId && response.config?.url && /(\/public\/signup|\/public\/signin)$/.test(response.config.url)) {
        console.debug(`[apiClient][${debugId}] <- ${response.status} ${response.config.url}`, response.data);
      }
    } catch (e) {}
    return response;
  },
  (error) => {
    try {
      const debugId = error.config?._debugId;
      if (import.meta.env.DEV && debugId && error.config?.url && /(\/public\/signup|\/public\/signin)$/.test(error.config.url)) {
        console.error(`[apiClient][${debugId}] <- ERROR ${error.config.url}`, error.response?.status, error.response?.data || error.message);
      }
    } catch (e) {}

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear token and user from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Reload the page to trigger AuthRedirect and redirect to login
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
