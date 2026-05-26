import { randomUUID } from 'crypto';
import { env } from '../config/env.js';
import { getDbMode } from '../config/db.js';
import { Integration } from '../models/Integration.js';
import { getProvider, listProviders } from '../integrations/providerRegistry.js';
import { encryptSecret } from '../utils/crypto.js';
import { ApiError } from '../utils/ApiError.js';

const memoryIntegrations = new Map();

function now() {
  return new Date().toISOString();
}

function memoryKey(ownerId, provider) {
  return `${ownerId}:${provider}`;
}

function toPublic(integration) {
  return {
    id: integration.id,
    owner: integration.owner,
    provider: integration.provider,
    status: integration.status,
    scopes: integration.scopes,
    expiresAt: integration.expiresAt,
    accountLabel: integration.accountLabel,
    lastError: integration.lastError,
    config: integration.config || {},
    createdAt: integration.createdAt,
    updatedAt: integration.updatedAt
  };
}

export async function listIntegrations(ownerId) {
  const allProviders = listProviders();

  if (getDbMode() === 'memory') {
    return allProviders.map((provider) => {
      const integration = memoryIntegrations.get(memoryKey(ownerId, provider.id));
      return integration ? toPublic(integration) : { provider: provider.id, status: 'disconnected', scopes: provider.scopes };
    });
  }

  const connected = await Integration.find({ owner: ownerId });
  const byProvider = new Map(connected.map((integration) => [integration.provider, integration.toSafeObject()]));

  return allProviders.map((provider) => byProvider.get(provider.id) || {
    provider: provider.id,
    status: 'disconnected',
    scopes: provider.scopes
  });
}

export async function integrationStatus(ownerId) {
  const integrations = await listIntegrations(ownerId);

  return integrations.map((integration) => ({
    provider: integration.provider,
    status: integration.status,
    connected: integration.status === 'connected',
    expiresAt: integration.expiresAt || null,
    lastError: integration.lastError || null
  }));
}

export function buildOAuthStartUrl(ownerId, providerName) {
  const provider = getProvider(providerName);
  if (!provider) throw new ApiError(404, 'Unsupported integration provider.');

  const state = Buffer.from(JSON.stringify({ ownerId, provider: providerName, nonce: randomUUID() })).toString('base64url');
  const redirectUri = `${env.clientUrl}/integrations`;
  const url = new URL(provider.authUrl);
  url.searchParams.set('scope', provider.scopes.join(' '));
  url.searchParams.set('state', state);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');

  return { provider: providerName, url: url.toString(), state };
}

export async function upsertIntegration(ownerId, payload) {
  const provider = getProvider(payload.provider);
  if (!provider) throw new ApiError(404, 'Unsupported integration provider.');

  const encryptedAccessToken = payload.accessToken ? encryptSecret(payload.accessToken) : undefined;
  const encryptedRefreshToken = payload.refreshToken ? encryptSecret(payload.refreshToken) : undefined;
  const integration = {
    id: payload.id || randomUUID(),
    owner: ownerId,
    provider: payload.provider,
    status: payload.status || 'connected',
    scopes: payload.scopes || provider.scopes,
    encryptedAccessToken,
    encryptedRefreshToken,
    expiresAt: payload.expiresAt || null,
    accountLabel: payload.accountLabel || provider.label,
    lastError: '',
    config: payload.config || {},
    createdAt: payload.createdAt || now(),
    updatedAt: now()
  };

  if (getDbMode() === 'memory') {
    const key = memoryKey(ownerId, payload.provider);
    memoryIntegrations.set(key, { ...(memoryIntegrations.get(key) || {}), ...integration });
    return toPublic(memoryIntegrations.get(key));
  }

  const updated = await Integration.findOneAndUpdate(
    { owner: ownerId, provider: payload.provider },
    integration,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return updated.toSafeObject();
}

export async function handleOAuthCallback(ownerId, provider, code) {
  if (!code) throw new ApiError(400, 'OAuth callback is missing code.');

  return upsertIntegration(ownerId, {
    provider,
    accessToken: `oauth-access-token:${code}`,
    refreshToken: `oauth-refresh-token:${code}`,
    accountLabel: `${provider} account`
  });
}

export function parseOAuthState(state) {
  if (!state) throw new ApiError(400, 'OAuth callback is missing state.');

  try {
    return JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
  } catch {
    throw new ApiError(400, 'OAuth callback state is invalid.');
  }
}
