import { Router } from 'express';
import { index, markRead } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const notificationRoutes = Router();

notificationRoutes.use(requireAuth);
notificationRoutes.get('/', asyncHandler(index));
notificationRoutes.post('/read', asyncHandler(markRead));
