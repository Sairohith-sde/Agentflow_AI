import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(serverRoot, '.env') });

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-me',
  credentialEncryptionKey: process.env.CREDENTIAL_ENCRYPTION_KEY || '',
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  redisUrl: process.env.REDIS_URL || ''
};

export function validateEnv() {
  const warnings = [];

  if (env.jwtSecret === 'development-only-secret-change-me') {
    warnings.push('JWT_SECRET is using the development fallback.');
  }

  if (!env.credentialEncryptionKey) {
    warnings.push('CREDENTIAL_ENCRYPTION_KEY is not configured.');
  }

  if (!env.mongoUri) {
    warnings.push('MONGO_URI is not configured; using in-memory auth fallback.');
  }

  return warnings;
}
