import { getUserById, verifyToken } from '../services/authService.js';
import { ApiError } from '../utils/ApiError.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');

    if (!token) {
      throw new ApiError(401, 'Authentication token is required.');
    }

    const payload = verifyToken(token);
    const user = await getUserById(payload.sub);

    if (!user) {
      throw new ApiError(401, 'Authenticated user no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
