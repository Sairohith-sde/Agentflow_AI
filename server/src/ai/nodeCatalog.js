export const nodeCatalog = {
  triggers: [
    { type: 'trigger.manual', label: 'Manual Trigger', defaultConfig: {} },
    { type: 'trigger.gmail.new_email', label: 'New Gmail Email', defaultConfig: { query: '' } }
  ],
  actions: [
    { type: 'action.gmail.send', label: 'Send Gmail', defaultConfig: { to: '', subject: '', body: '' } },
    { type: 'action.slack.post', label: 'Post Slack', defaultConfig: { channel: '', message: '' } },
    { type: 'action.discord.post', label: 'Post Discord', defaultConfig: { channelId: '', message: '' } },
    {
      type: 'action.sheets.append',
      label: 'Append Google Sheet',
      defaultConfig: { spreadsheetId: '', range: 'Sheet1!A:D', values: [] }
    }
  ],
  ai: [{ type: 'ai.text', label: 'AI Text', defaultConfig: { prompt: '' } }],
  logic: [{ type: 'logic.branch', label: 'Branch', defaultConfig: { condition: '' } }]
};

export function flattenNodeCatalog() {
  return Object.values(nodeCatalog).flat();
}
