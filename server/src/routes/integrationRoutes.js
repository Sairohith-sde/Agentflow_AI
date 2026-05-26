import { Router } from 'express';
import { index, oauthCallback, oauthError, oauthStart, save, status } from '../controllers/integrationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  oauthCallbackValidator,
  providerValidator,
  saveIntegrationValidator
} from '../validators/integrationValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const integrationRoutes = Router();

integrationRoutes.get('/oauth/error', oauthError);
integrationRoutes.get('/oauth/:provider/callback', oauthCallbackValidator, validateRequest, asyncHandler(oauthCallback));
integrationRoutes.use(requireAuth);
integrationRoutes.get('/', asyncHandler(index));
integrationRoutes.get('/status', asyncHandler(status));
integrationRoutes.get('/oauth/:provider/start', providerValidator, validateRequest, asyncHandler(oauthStart));
integrationRoutes.post('/', saveIntegrationValidator, validateRequest, asyncHandler(save));
