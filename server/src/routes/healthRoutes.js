import { Router } from 'express';
import { health } from '../controllers/healthController.js';

export const healthRoutes = Router();

healthRoutes.get('/', health);
