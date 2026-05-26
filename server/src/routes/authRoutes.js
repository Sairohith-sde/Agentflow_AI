import { Router } from 'express';
import { login, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginValidator, registerValidator } from '../validators/authValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authRoutes = Router();

authRoutes.post('/register', authRateLimiter, registerValidator, validateRequest, asyncHandler(register));
authRoutes.post('/login', authRateLimiter, loginValidator, validateRequest, asyncHandler(login));
authRoutes.get('/me', requireAuth, asyncHandler(me));
