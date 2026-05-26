import { body, param, query } from 'express-validator';

export const executionIdValidator = [param('id').notEmpty().withMessage('Execution id is required.')];

export const listExecutionValidator = [
  query('status').optional().isIn(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING', 'PAUSED', 'CANCELLED']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

export const executeWorkflowValidator = [body('input').optional().isObject()];
