import { listNotifications, markNotificationsRead } from '../services/notificationService.js';

export async function index(req, res) {
  const data = await listNotifications(req.user.id);
  res.json({ success: true, data });
}

export async function markRead(req, res) {
  const data = await markNotificationsRead(req.user.id);
  res.json({ success: true, data });
}
