import { body, param, query } from 'express-validator';

export const listWorkflowValidator = [
  query('q').optional().isString(),
  query('status').optional().isIn(['draft', 'active', 'paused', 'archived']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

export const workflowIdValidator = [param('id').notEmpty().withMessage('Workflow id is required.')];

export const saveWorkflowValidator = [
  body('name').trim().isLength({ min: 1 }).withMessage('Workflow name is required.'),
  body('description').optional().isString(),
  body('status').optional().isIn(['draft', 'active', 'paused', 'archived']),
  body('trigger').optional().isObject(),
  body('nodes').optional().isArray(),
  body('edges').optional().isArray(),
  body('tags').optional().isArray()
];

export const generateWorkflowValidator = [
  body('prompt').trim().isLength({ min: 8 }).withMessage('Prompt must be at least 8 characters.')
];
