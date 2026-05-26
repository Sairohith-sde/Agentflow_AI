import { Server } from 'socket.io';
import { env } from './env.js';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('user:subscribe', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('execution:subscribe', (executionId) => {
      socket.join(`execution:${executionId}`);
    });

    socket.on('execution:unsubscribe', (executionId) => {
      socket.leave(`execution:${executionId}`);
    });
  });

  return io;
}

export function getSocket() {
  return io;
}
