import axios, { AxiosInstance } from 'axios';

// FRONTEND-ONLY MODE: This is a dummy API instance that always rejects
// All services should use their mock data implementations
const api: AxiosInstance = axios.create({
  baseURL: '/api-disabled',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1, // Fail fast
});

// Always reject requests immediately in frontend-only mode
api.interceptors.request.use(
  () => {
    return Promise.reject(new Error('Backend is disabled - using frontend-only mode'));
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

