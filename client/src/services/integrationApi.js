import { api } from './api';

export async function listIntegrations() {
  const response = await api.get('/integrations');
  return response.data.data;
}

export async function getIntegrationStatus() {
  const response = await api.get('/integrations/status');
  return response.data.data;
}

export async function startOAuth(provider) {
  const response = await api.get(`/integrations/oauth/${provider}/start`);
  return response.data.data;
}

export async function saveIntegration(payload) {
  const response = await api.post('/integrations', payload);
  return response.data.data;
}
