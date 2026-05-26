import { randomUUID } from 'crypto';
import { getDbMode } from '../config/db.js';
import { getSocket } from '../config/socket.js';
import { Notification } from '../models/Notification.js';

const memoryNotifications = new Map();

function now() {
  return new Date().toISOString();
}

function emitNotification(notification) {
  getSocket()?.to(`user:${notification.owner}`).emit('notification:new', notification);
}

export async function createNotification(ownerId, payload) {
  if (getDbMode() === 'memory') {
    const notification = {
      id: randomUUID(),
      owner: ownerId,
      workflow: payload.workflow || null,
      execution: payload.execution || null,
      type: payload.type || 'info',
      title: payload.title,
      message: payload.message,
      read: false,
      createdAt: now(),
      updatedAt: now()
    };

    const items = memoryNotifications.get(ownerId) || [];
    items.unshift(notification);
    memoryNotifications.set(ownerId, items);
    emitNotification(notification);
    return notification;
  }

  const notification = await Notification.create({ owner: ownerId, ...payload });
  const safeNotification = notification.toSafeObject();
  emitNotification(safeNotification);
  return safeNotification;
}

export async function listNotifications(ownerId) {
  if (getDbMode() === 'memory') {
    return memoryNotifications.get(ownerId) || [];
  }

  const notifications = await Notification.find({ owner: ownerId }).sort({ createdAt: -1 }).limit(50);
  return notifications.map((notification) => notification.toSafeObject());
}

export async function markNotificationsRead(ownerId) {
  if (getDbMode() === 'memory') {
    const items = (memoryNotifications.get(ownerId) || []).map((notification) => ({
      ...notification,
      read: true,
      updatedAt: now()
    }));
    memoryNotifications.set(ownerId, items);
    return items;
  }

  await Notification.updateMany({ owner: ownerId, read: false }, { read: true });
  return listNotifications(ownerId);
}
