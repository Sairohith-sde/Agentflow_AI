import { randomUUID } from 'crypto';
import { Workflow } from '../models/Workflow.js';
import { getDbMode } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const memoryWorkflows = new Map();

function now() {
  return new Date().toISOString();
}

function normalizeWorkflow(payload) {
  return {
    name: payload.name?.trim() || 'Untitled workflow',
    description: payload.description || '',
    status: payload.status || 'draft',
    trigger: payload.trigger || {},
    nodes: Array.isArray(payload.nodes) ? payload.nodes : [],
    edges: Array.isArray(payload.edges) ? payload.edges : [],
    tags: Array.isArray(payload.tags) ? payload.tags : []
  };
}

function assertOwnership(workflow, ownerId) {
  if (!workflow || workflow.owner !== ownerId) {
    throw new ApiError(404, 'Workflow not found.');
  }
}

function toMemoryWorkflow(workflow) {
  return { ...workflow };
}

export async function getDashboardMetrics(ownerId) {
  const workflows = await listWorkflows(ownerId, {});
  const total = workflows.items.length;
  const active = workflows.items.filter((workflow) => workflow.status === 'active').length;

  return {
    totalWorkflows: total,
    activeWorkflows: active,
    draftWorkflows: workflows.items.filter((workflow) => workflow.status === 'draft').length,
    recentWorkflows: workflows.items.slice(0, 5),
    executionStats: {
      totalExecutions: 0,
      runningExecutions: 0,
      successRate: 0
    }
  };
}

export async function listWorkflows(ownerId, { q = '', status = '', page = 1, limit = 20 } = {}) {
  if (getDbMode() === 'memory') {
    let items = [...memoryWorkflows.values()].filter((workflow) => workflow.owner === ownerId);

    if (q) {
      const query = q.toLowerCase();
      items = items.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(query) ||
          workflow.description.toLowerCase().includes(query) ||
          workflow.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (status) {
      items = items.filter((workflow) => workflow.status === status);
    }

    items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const start = (Number(page) - 1) * Number(limit);

    return {
      items: items.slice(start, start + Number(limit)).map(toMemoryWorkflow),
      total: items.length,
      page: Number(page),
      limit: Number(limit)
    };
  }

  const filter = { owner: ownerId };

  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Workflow.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
    Workflow.countDocuments(filter)
  ]);

  return {
    items: items.map((workflow) => workflow.toSafeObject()),
    total,
    page: Number(page),
    limit: Number(limit)
  };
}

export async function createWorkflow(ownerId, payload) {
  const normalized = normalizeWorkflow(payload);

  if (getDbMode() === 'memory') {
    const timestamp = now();
    const workflow = {
      id: randomUUID(),
      owner: ownerId,
      ...normalized,
      version: 1,
      lastExecutedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    memoryWorkflows.set(workflow.id, workflow);
    return toMemoryWorkflow(workflow);
  }

  const workflow = await Workflow.create({ owner: ownerId, ...normalized });
  return workflow.toSafeObject();
}

export async function getWorkflow(ownerId, workflowId) {
  if (getDbMode() === 'memory') {
    const workflow = memoryWorkflows.get(workflowId);
    assertOwnership(workflow, ownerId);
    return toMemoryWorkflow(workflow);
  }

  const workflow = await Workflow.findOne({ _id: workflowId, owner: ownerId });

  if (!workflow) {
    throw new ApiError(404, 'Workflow not found.');
  }

  return workflow.toSafeObject();
}

export async function updateWorkflow(ownerId, workflowId, payload) {
  if (getDbMode() === 'memory') {
    const workflow = memoryWorkflows.get(workflowId);
    assertOwnership(workflow, ownerId);

    const updated = {
      ...workflow,
      ...normalizeWorkflow({ ...workflow, ...payload }),
      version: workflow.version + 1,
      updatedAt: now()
    };

    memoryWorkflows.set(workflowId, updated);
    return toMemoryWorkflow(updated);
  }

  const workflow = await Workflow.findOne({ _id: workflowId, owner: ownerId });

  if (!workflow) {
    throw new ApiError(404, 'Workflow not found.');
  }

  Object.assign(workflow, normalizeWorkflow({ ...workflow.toObject(), ...payload }));
  workflow.version += 1;
  await workflow.save();
  return workflow.toSafeObject();
}

export async function duplicateWorkflow(ownerId, workflowId) {
  const source = await getWorkflow(ownerId, workflowId);

  return createWorkflow(ownerId, {
    ...source,
    name: `${source.name} copy`,
    status: 'draft'
  });
}

export async function deleteWorkflow(ownerId, workflowId) {
  if (getDbMode() === 'memory') {
    const workflow = memoryWorkflows.get(workflowId);
    assertOwnership(workflow, ownerId);
    memoryWorkflows.delete(workflowId);
    return { deleted: true };
  }

  const result = await Workflow.deleteOne({ _id: workflowId, owner: ownerId });

  if (!result.deletedCount) {
    throw new ApiError(404, 'Workflow not found.');
  }

  return { deleted: true };
}
