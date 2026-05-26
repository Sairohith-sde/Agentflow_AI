export const providers = {
  gmail: {
    label: 'Gmail',
    scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
  },
  slack: {
    label: 'Slack',
    scopes: ['chat:write', 'channels:read'],
    authUrl: 'https://slack.com/oauth/v2/authorize'
  },
  discord: {
    label: 'Discord',
    scopes: ['bot', 'applications.commands'],
    authUrl: 'https://discord.com/oauth2/authorize'
  },
  'google-sheets': {
    label: 'Google Sheets',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
  }
};

export function getProvider(provider) {
  return providers[provider] || null;
}

export function listProviders() {
  return Object.entries(providers).map(([id, provider]) => ({ id, ...provider }));
}

export async function createProviderClient(provider, integration) {
  if (provider === 'gmail') {
    const { GmailIntegration } = await import('./gmailIntegration.js');
    return new GmailIntegration(integration);
  }

  if (provider === 'slack') {
    const { SlackIntegration } = await import('./slackIntegration.js');
    return new SlackIntegration(integration);
  }

  if (provider === 'discord') {
    const { DiscordIntegration } = await import('./discordIntegration.js');
    return new DiscordIntegration(integration);
  }

  if (provider === 'google-sheets') {
    const { GoogleSheetsIntegration } = await import('./googleSheetsIntegration.js');
    return new GoogleSheetsIntegration(integration);
  }

  return null;
}
