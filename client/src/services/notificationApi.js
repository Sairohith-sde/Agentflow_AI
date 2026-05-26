import { api } from './api';

export async function listNotifications() {
  const response = await api.get('/notifications');
  return response.data.data;
}

export async function markNotificationsRead() {
  const response = await api.post('/notifications/read');
  return response.data.data;
}
