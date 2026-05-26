import { body, param, query } from 'express-validator';

export const providerValidator = [param('provider').isIn(['gmail', 'slack', 'discord', 'google-sheets'])];

export const oauthCallbackValidator = [
  param('provider').isIn(['gmail', 'slack', 'discord', 'google-sheets']),
  query('code').optional().isString(),
  query('state').notEmpty().withMessage('OAuth state is required.')
];

export const saveIntegrationValidator = [
  body('provider').isIn(['gmail', 'slack', 'discord', 'google-sheets']),
  body('accessToken').optional().isString(),
  body('refreshToken').optional().isString(),
  body('status').optional().isIn(['connected', 'disconnected', 'expired', 'error']),
  body('config').optional().isObject()
];
