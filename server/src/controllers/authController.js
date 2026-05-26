import { loginUser, registerUser } from '../services/authService.js';

export async function register(req, res) {
  const result = await registerUser(req.body);
  res.status(201).json({ success: true, data: result });
}

export async function login(req, res) {
  const result = await loginUser(req.body);
  res.json({ success: true, data: result });
}

export async function me(req, res) {
  res.json({ success: true, data: { user: req.user } });
}
