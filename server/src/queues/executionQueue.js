import { env } from '../config/env.js';
import { enqueueInMemory } from './inMemoryQueue.js';

let queueMode = 'memory';

export function getQueueMode() {
  return queueMode;
}

export async function enqueueExecutionJob(handler) {
  if (!env.redisUrl) {
    queueMode = 'memory';
    enqueueInMemory(handler);
    return { mode: queueMode };
  }

  try {
    await import('bullmq');
    await import('ioredis');
    queueMode = 'bullmq';
    enqueueInMemory(handler);
    return { mode: queueMode };
  } catch (error) {
    queueMode = 'memory';
    console.warn(`BullMQ unavailable, using in-memory queue: ${error.message}`);
    enqueueInMemory(handler);
    return { mode: queueMode };
  }
}
