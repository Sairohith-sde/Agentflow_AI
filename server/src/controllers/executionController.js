import {
  getExecution,
  getExecutionTimeline,
  listExecutions,
  setExecutionStatus
} from '../services/executionService.js';

export async function index(req, res) {
  const data = await listExecutions(req.user.id, req.query);
  res.json({ success: true, data });
}

export async function show(req, res) {
  const data = await getExecution(req.user.id, req.params.id);
  res.json({ success: true, data });
}

export async function timeline(req, res) {
  const data = await getExecutionTimeline(req.user.id, req.params.id);
  res.json({ success: true, data });
}

export async function pause(req, res) {
  const data = await setExecutionStatus(req.user.id, req.params.id, 'PAUSED');
  res.json({ success: true, data });
}

export async function resume(req, res) {
  const data = await setExecutionStatus(req.user.id, req.params.id, 'RUNNING');
  res.json({ success: true, data });
}

export async function cancel(req, res) {
  const data = await setExecutionStatus(req.user.id, req.params.id, 'CANCELLED');
  res.json({ success: true, data });
}
