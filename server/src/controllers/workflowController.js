import {
  createWorkflow,
  deleteWorkflow,
  duplicateWorkflow,
  getDashboardMetrics,
  getWorkflow,
  listWorkflows,
  updateWorkflow
} from '../services/workflowService.js';
import { generateWorkflowFromPrompt } from '../services/aiGenerationService.js';
import { createExecution } from '../services/executionService.js';

export async function dashboard(req, res) {
  const data = await getDashboardMetrics(req.user.id);
  res.json({ success: true, data });
}

export async function index(req, res) {
  const data = await listWorkflows(req.user.id, req.query);
  res.json({ success: true, data });
}

export async function create(req, res) {
  const data = await createWorkflow(req.user.id, req.body);
  res.status(201).json({ success: true, data });
}

export async function generate(req, res) {
  const data = await generateWorkflowFromPrompt(req.body.prompt);
  res.json({ success: true, data });
}

export async function show(req, res) {
  const data = await getWorkflow(req.user.id, req.params.id);
  res.json({ success: true, data });
}

export async function update(req, res) {
  const data = await updateWorkflow(req.user.id, req.params.id, req.body);
  res.json({ success: true, data });
}

export async function duplicate(req, res) {
  const data = await duplicateWorkflow(req.user.id, req.params.id);
  res.status(201).json({ success: true, data });
}

export async function execute(req, res) {
  const data = await createExecution(req.user.id, req.params.id, req.body.input || {});
  res.status(202).json({ success: true, data });
}

export async function destroy(req, res) {
  const data = await deleteWorkflow(req.user.id, req.params.id);
  res.json({ success: true, data });
}
