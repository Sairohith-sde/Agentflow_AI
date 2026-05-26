import { getDbMode } from '../config/db.js';
import { validateEnv } from '../config/env.js';
import { getQueueMode } from '../queues/executionQueue.js';

export function health(req, res) {
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      dbMode: getDbMode(),
      queueMode: getQueueMode(),
      envWarnings: validateEnv()
    }
  });
}
