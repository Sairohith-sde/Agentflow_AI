import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User } from '../models/User.js';
import { getDbMode } from '../config/db.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const memoryUsers = new Map();

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
}

function safeMemoryUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function registerMemoryUser({ name, email, password, role = 'operator' }) {
  const normalizedEmail = normalizeEmail(email);

  if (memoryUsers.has(normalizedEmail)) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
    role,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now
  };

  memoryUsers.set(normalizedEmail, user);
  const safeUser = safeMemoryUser(user);

  return {
    user: safeUser,
    token: signToken(safeUser)
  };
}

async function loginMemoryUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const user = memoryUsers.get(normalizedEmail);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  user.lastLoginAt = new Date().toISOString();
  user.updatedAt = user.lastLoginAt;
  const safeUser = safeMemoryUser(user);

  return {
    user: safeUser,
    token: signToken(safeUser)
  };
}

async function getMemoryUserById(userId) {
  const user = [...memoryUsers.values()].find((entry) => entry.id === userId);
  return user ? safeMemoryUser(user) : null;
}

export async function registerUser({ name, email, password, role = 'operator' }) {
  if (getDbMode() === 'memory') {
    return registerMemoryUser({ name, email, password, role });
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
    role,
    lastLoginAt: new Date()
  });

  const safeUser = user.toSafeObject();

  return {
    user: safeUser,
    token: signToken(safeUser)
  };
}

export async function loginUser({ email, password }) {
  if (getDbMode() === 'memory') {
    return loginMemoryUser({ email, password });
  }

  const user = await User.findOne({ email: normalizeEmail(email) }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  user.lastLoginAt = new Date();
  await user.save();
  const safeUser = user.toSafeObject();

  return {
    user: safeUser,
    token: signToken(safeUser)
  };
}

export async function getUserById(userId) {
  if (getDbMode() === 'memory') {
    return getMemoryUserById(userId);
  }

  const user = await User.findById(userId);
  return user ? user.toSafeObject() : null;
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'Invalid or expired authentication token.');
  }
}
