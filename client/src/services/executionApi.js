import { api } from './api';

export async function executeWorkflow(workflowId, input = {}) {
  const response = await api.post(`/workflows/${workflowId}/execute`, { input });
  return response.data.data;
}

export async function listExecutions(params = {}) {
  const response = await api.get('/executions', { params });
  return response.data.data;
}

export async function getExecution(id) {
  const response = await api.get(`/executions/${id}`);
  return response.data.data;
}

export async function getExecutionTimeline(id) {
  const response = await api.get(`/executions/${id}/timeline`);
  return response.data.data;
}

export async function pauseExecution(id) {
  const response = await api.post(`/executions/${id}/pause`);
  return response.data.data;
}

export async function resumeExecution(id) {
  const response = await api.post(`/executions/${id}/resume`);
  return response.data.data;
}

export async function cancelExecution(id) {
  const response = await api.post(`/executions/${id}/cancel`);
  return response.data.data;
}
