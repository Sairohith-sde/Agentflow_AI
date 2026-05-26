import { Router } from 'express';
import { cancel, index, pause, resume, show, timeline } from '../controllers/executionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { executionIdValidator, listExecutionValidator } from '../validators/executionValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const executionRoutes = Router();

executionRoutes.use(requireAuth);

executionRoutes.get('/', listExecutionValidator, validateRequest, asyncHandler(index));
executionRoutes.get('/:id', executionIdValidator, validateRequest, asyncHandler(show));
executionRoutes.get('/:id/timeline', executionIdValidator, validateRequest, asyncHandler(timeline));
executionRoutes.post('/:id/pause', executionIdValidator, validateRequest, asyncHandler(pause));
executionRoutes.post('/:id/resume', executionIdValidator, validateRequest, asyncHandler(resume));
executionRoutes.post('/:id/cancel', executionIdValidator, validateRequest, asyncHandler(cancel));
