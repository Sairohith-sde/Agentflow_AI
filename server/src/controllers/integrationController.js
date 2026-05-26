import {
  buildOAuthStartUrl,
  handleOAuthCallback,
  integrationStatus,
  listIntegrations,
  parseOAuthState,
  upsertIntegration
} from '../services/integrationService.js';

export async function index(req, res) {
  const data = await listIntegrations(req.user.id);
  res.json({ success: true, data });
}

export async function status(req, res) {
  const data = await integrationStatus(req.user.id);
  res.json({ success: true, data });
}

export async function oauthStart(req, res) {
  const data = buildOAuthStartUrl(req.user.id, req.params.provider);
  res.json({ success: true, data });
}

export async function oauthCallback(req, res) {
  const state = parseOAuthState(req.query.state);
  const ownerId = state.ownerId;
  const data = await handleOAuthCallback(ownerId, req.params.provider, req.query.code);
  res.json({ success: true, data });
}

export async function save(req, res) {
  const data = await upsertIntegration(req.user.id, req.body);
  res.json({ success: true, data });
}

export function oauthError(req, res) {
  res.status(400).json({
    success: false,
    error: {
      message: 'OAuth integration failed.',
      details: req.query
    }
  });
}
