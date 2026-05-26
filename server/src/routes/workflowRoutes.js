import { Router } from 'express';
import {
  create,
  dashboard,
  destroy,
  duplicate,
  execute,
  generate,
  index,
  show,
  update
} from '../controllers/workflowController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  listWorkflowValidator,
  generateWorkflowValidator,
  saveWorkflowValidator,
  workflowIdValidator
} from '../validators/workflowValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { executeWorkflowValidator } from '../validators/executionValidators.js';

export const workflowRoutes = Router();

workflowRoutes.use(requireAuth);

workflowRoutes.get('/dashboard', asyncHandler(dashboard));
workflowRoutes.get('/', listWorkflowValidator, validateRequest, asyncHandler(index));
workflowRoutes.post('/', saveWorkflowValidator, validateRequest, asyncHandler(create));
workflowRoutes.post('/generate', generateWorkflowValidator, validateRequest, asyncHandler(generate));
workflowRoutes.get('/:id', workflowIdValidator, validateRequest, asyncHandler(show));
workflowRoutes.put('/:id', workflowIdValidator, saveWorkflowValidator, validateRequest, asyncHandler(update));
workflowRoutes.post('/:id/duplicate', workflowIdValidator, validateRequest, asyncHandler(duplicate));
workflowRoutes.post('/:id/execute', workflowIdValidator, executeWorkflowValidator, validateRequest, asyncHandler(execute));
workflowRoutes.delete('/:id', workflowIdValidator, validateRequest, asyncHandler(destroy));
