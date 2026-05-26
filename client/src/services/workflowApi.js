import { api } from './api';

export async function getDashboardMetrics() {
  const response = await api.get('/workflows/dashboard');
  return response.data.data;
}

export async function listWorkflows(params = {}) {
  const response = await api.get('/workflows', { params });
  return response.data.data;
}

export async function createWorkflow(payload) {
  const response = await api.post('/workflows', payload);
  return response.data.data;
}

export async function generateWorkflow(prompt) {
  const response = await api.post('/workflows/generate', { prompt });
  return response.data.data;
}

export async function getWorkflow(id) {
  const response = await api.get(`/workflows/${id}`);
  return response.data.data;
}

export async function updateWorkflow(id, payload) {
  const response = await api.put(`/workflows/${id}`, payload);
  return response.data.data;
}

export async function duplicateWorkflow(id) {
  const response = await api.post(`/workflows/${id}/duplicate`);
  return response.data.data;
}

export async function deleteWorkflow(id) {
  const response = await api.delete(`/workflows/${id}`);
  return response.data.data;
}
