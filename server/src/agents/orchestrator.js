import { getSocket } from '../config/socket.js';
import { plannerAgent } from './plannerAgent.js';
import { executionAgent } from './executionAgent.js';
import { monitoringAgent } from './monitoringAgent.js';
import { recoveryAgent } from './recoveryAgent.js';
import { validationAgent } from './validationAgent.js';

let langGraphStatus = 'not-installed';

try {
  await import('@langchain/langgraph');
  langGraphStatus = 'available';
} catch {
  langGraphStatus = 'not-installed';
}

export function getLangGraphStatus() {
  return langGraphStatus;
}

export async function runOrchestrator({ execution, workflow, emitLog, updateExecution, notify }) {
  const startedAt = new Date();
  const outputs = {};

  await updateExecution(execution.id, { status: 'RUNNING', startedAt, currentNodeId: null });
  await emitLog({
    agent: 'monitoring',
    level: 'info',
    eventType: 'execution.started',
    message: 'Execution started.',
    metadata: { langGraph: langGraphStatus }
  });

  try {
    const plan = await plannerAgent(workflow);
    await emitLog({
      agent: 'planner',
      level: 'success',
      eventType: 'planner.completed',
      message: `Planner selected ${plan.nodeOrder.length} nodes.`,
      metadata: { ...plan, langGraph: langGraphStatus }
    });

    for (const nodeId of plan.nodeOrder) {
      const node = workflow.nodes.find((candidate) => candidate.id === nodeId);
      if (!node) continue;

      await updateExecution(execution.id, { status: 'RUNNING', currentNodeId: node.id });
      await emitLog({
        agent: 'execution',
        nodeId: node.id,
        level: 'info',
        eventType: 'node.started',
        message: `Running ${node.data?.label || node.id}.`
      });

      const output = await executionAgent(node, outputs);
      outputs[node.id] = output;

      await emitLog({
        agent: 'execution',
        nodeId: node.id,
        level: 'success',
        eventType: 'node.completed',
        message: `${node.data?.label || node.id} completed.`,
        metadata: output
      });

      const validation = await validationAgent(node, output);
      await emitLog({
        agent: 'validation',
        nodeId: node.id,
        level: validation.valid ? 'success' : 'warning',
        eventType: 'validation.completed',
        message: validation.valid ? 'Node output validated.' : 'Node output is missing required fields.',
        metadata: validation
      });

      if (!validation.valid) {
        throw new Error(`missing fields: ${validation.missingFields.join(', ')}`);
      }
    }

    const completedAt = new Date();
    await updateExecution(execution.id, {
      status: 'COMPLETED',
      output: outputs,
      completedAt,
      durationMs: completedAt - startedAt,
      currentNodeId: null
    });

    await emitLog({
      agent: 'monitoring',
      level: 'success',
      eventType: 'execution.completed',
      message: 'Execution completed successfully.',
      metadata: await monitoringAgent({ durationMs: completedAt - startedAt })
    });
    await notify?.({
      type: 'success',
      title: 'Workflow completed',
      message: `${workflow.name} completed successfully.`
    });
  } catch (error) {
    const recovery = await recoveryAgent(error);
    const completedAt = new Date();

    await updateExecution(execution.id, {
      status: recovery.action === 'retry_with_backoff' ? 'RETRYING' : 'FAILED',
      error: {
        message: error.message,
        classification: recovery.classification,
        action: recovery.action
      },
      completedAt,
      durationMs: completedAt - startedAt
    });

    await emitLog({
      agent: 'recovery',
      level: 'error',
      eventType: 'execution.failed',
      message: `Recovery classified failure as ${recovery.classification}.`,
      metadata: recovery
    });
    await notify?.({
      type: recovery.action === 'escalate' ? 'escalation' : 'failure',
      title: 'Workflow execution failed',
      message: `${workflow.name} failed with ${recovery.classification}.`
    });
  }

  getSocket()?.to(`execution:${execution.id}`).emit('execution:finished', { executionId: execution.id });
}
