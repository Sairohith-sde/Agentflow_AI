import http from 'http';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env, validateEnv } from './config/env.js';
import { initSocket } from './config/socket.js';

const app = createApp();
const server = http.createServer(app);

initSocket(server);

const db = await connectDatabase();
const warnings = validateEnv();

warnings.forEach((warning) => console.warn(`Config warning: ${warning}`));

server.listen(env.port, () => {
  console.log(`Agentflow_AI API listening on http://localhost:${env.port}`);
  console.log(`Database mode: ${db.mode}`);
});
