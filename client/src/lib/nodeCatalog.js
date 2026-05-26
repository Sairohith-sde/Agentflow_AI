import { Bot, GitBranch, Mail, Play, Rows3, Send } from 'lucide-react';

export const nodeCatalog = [
  {
    type: 'trigger.manual',
    label: 'Manual Trigger',
    group: 'Triggers',
    icon: Play,
    defaultConfig: {}
  },
  {
    type: 'action.gmail.send',
    label: 'Send Gmail',
    group: 'Actions',
    icon: Mail,
    defaultConfig: { to: '', subject: '', body: '' }
  },
  {
    type: 'action.slack.post',
    label: 'Post Slack',
    group: 'Actions',
    icon: Send,
    defaultConfig: { channel: '', message: '' }
  },
  {
    type: 'action.sheets.append',
    label: 'Append Sheet',
    group: 'Actions',
    icon: Rows3,
    defaultConfig: { spreadsheetId: '', range: '', values: [] }
  },
  {
    type: 'ai.text',
    label: 'AI Text',
    group: 'AI Nodes',
    icon: Bot,
    defaultConfig: { prompt: '' }
  },
  {
    type: 'logic.branch',
    label: 'Branch',
    group: 'Logic',
    icon: GitBranch,
    defaultConfig: { condition: '' }
  }
];

export function createNodeFromCatalogItem(item, position = { x: 120, y: 120 }) {
  const id = `${item.type}-${Date.now()}`;

  return {
    id,
    type: 'agentNode',
    position,
    data: {
      label: item.label,
      nodeType: item.type,
      config: item.defaultConfig
    }
  };
}
