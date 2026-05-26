import { randomUUID } from 'crypto';
import { getSocket } from '../config/socket.js';
import { getDbMode } from '../config/db.js';
import { Execution } from '../models/Execution.js';
import { ExecutionLog } from '../models/ExecutionLog.js';
import { runOrchestrator } from '../agents/orchestrator.js';
import { enqueueExecutionJob } from '../queues/executionQueue.js';
import { getWorkflow } from './workflowService.js';
import { createNotification } from './notificationService.js';
import { ApiError } from '../utils/ApiError.js';

const memoryExecutions = new Map();
const memoryLogs = new Map();

function now() {
  return new Date().toISOString();
}

function assertExecutionOwnership(execution, ownerId) {
  if (!execution || execution.owner !== ownerId) {
    throw new ApiError(404, 'Execution not found.');
  }
}

function emitTimeline(log) {
  getSocket()?.to(`execution:${log.execution}`).emit('execution:event', log);
}

export async function createExecution(ownerId, workflowId, input = {}) {
  const workflow = await getWorkflow(ownerId, workflowId);

  if (getDbMode() === 'memory') {
    const timestamp = now();
    const execution = {
      id: randomUUID(),
      workflow: workflow.id,
      owner: ownerId,
      workflowSnapshot: workflow,
      status: 'PENDING',
      currentNodeId: null,
      input,
      output: {},
      error: null,
      retryCount: 0,
      startedAt: null,
      completedAt: null,
      durationMs: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    memoryExecutions.set(execution.id, execution);
    memoryLogs.set(execution.id, []);
    queueOrchestration(execution, workflow);
    return execution;
  }

  const execution = await Execution.create({
    workflow: workflow.id,
    owner: ownerId,
    workflowSnapshot: workflow,
    input
  });
  const safeExecution = execution.toSafeObject();
  queueOrchestration(safeExecution, workflow);
  return safeExecution;
}

function queueOrchestration(execution, workflow) {
  enqueueExecutionJob(() =>
    runOrchestrator({
      execution,
      workflow,
      emitLog: (log) => createExecutionLog(execution.id, workflow.id, log),
      updateExecution,
      notify: (notification) => createNotification(execution.owner, {
        workflow: workflow.id,
        execution: execution.id,
        ...notification
      })
    }).catch((error) => console.error(error))
  );
}

export async function updateExecution(executionId, updates) {
  if (getDbMode() === 'memory') {
    const execution = memoryExecutions.get(executionId);
    if (!execution) return null;

    const updated = {
      ...execution,
      ...updates,
      updatedAt: now()
    };
    memoryExecutions.set(executionId, updated);
    return updated;
  }

  const execution = await Execution.findByIdAndUpdate(executionId, updates, { new: true });
  return execution?.toSafeObject() || null;
}

export async function createExecutionLog(executionId, workflowId, log) {
  if (getDbMode() === 'memory') {
    const entry = {
      id: randomUUID(),
      execution: executionId,
      workflow: workflowId,
      nodeId: log.nodeId || null,
      agent: log.agent,
      level: log.level || 'info',
      eventType: log.eventType,
      message: log.message,
      metadata: log.metadata || {},
      createdAt: now()
    };

    const logs = memoryLogs.get(executionId) || [];
    logs.push(entry);
    memoryLogs.set(executionId, logs);
    emitTimeline(entry);
    return entry;
  }

  const entry = await ExecutionLog.create({
    execution: executionId,
    workflow: workflowId,
    ...log
  });
  const safeEntry = entry.toSafeObject();
  emitTimeline(safeEntry);
  return safeEntry;
}

export async function listExecutions(ownerId, { status = '', page = 1, limit = 20 } = {}) {
  if (getDbMode() === 'memory') {
    let items = [...memoryExecutions.values()].filter((execution) => execution.owner === ownerId);
    if (status) items = items.filter((execution) => execution.status === status);
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const start = (Number(page) - 1) * Number(limit);

    return {
      items: items.slice(start, start + Number(limit)),
      total: items.length,
      page: Number(page),
      limit: Number(limit)
    };
  }

  const filter = { owner: ownerId };
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Execution.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Execution.countDocuments(filter)
  ]);

  return {
    items: items.map((execution) => execution.toSafeObject()),
    total,
    page: Number(page),
    limit: Number(limit)
  };
}

export async function getExecution(ownerId, executionId) {
  if (getDbMode() === 'memory') {
    const execution = memoryExecutions.get(executionId);
    assertExecutionOwnership(execution, ownerId);
    return execution;
  }

  const execution = await Execution.findOne({ _id: executionId, owner: ownerId });
  if (!execution) throw new ApiError(404, 'Execution not found.');
  return execution.toSafeObject();
}

export async function getExecutionTimeline(ownerId, executionId) {
  const execution = await getExecution(ownerId, executionId);

  if (getDbMode() === 'memory') {
    return memoryLogs.get(execution.id) || [];
  }

  const logs = await ExecutionLog.find({ execution: executionId }).sort({ createdAt: 1 });
  return logs.map((log) => log.toSafeObject());
}

export async function setExecutionStatus(ownerId, executionId, status) {
  const execution = await getExecution(ownerId, executionId);
  const next = await updateExecution(execution.id, { status });

  await createExecutionLog(execution.id, execution.workflow, {
    agent: 'monitoring',
    level: 'warning',
    eventType: `execution.${status.toLowerCase()}`,
    message: `Execution marked as ${status}.`
  });

  return next;
}
