import { flattenNodeCatalog } from './nodeCatalog.js';

const catalog = flattenNodeCatalog();

function catalogItem(type) {
  return catalog.find((item) => item.type === type);
}

function makeNode(type, index, config = {}) {
  const item = catalogItem(type);
  const id = `${type}-${index}`;

  return {
    id,
    type: 'agentNode',
    position: { x: 120 + index * 260, y: index % 2 === 0 ? 140 : 280 },
    data: {
      label: item?.label || type,
      nodeType: type,
      config: {
        ...(item?.defaultConfig || {}),
        ...config
      }
    }
  };
}

function edge(source, target, index) {
  return {
    id: `edge-${index}`,
    source,
    target,
    animated: true
  };
}

function inferNodePlan(prompt) {
  const lower = prompt.toLowerCase();
  const plan = ['trigger.manual'];

  if (lower.includes('email') || lower.includes('gmail') || lower.includes('invoice')) {
    if (lower.includes('read') || lower.includes('incoming') || lower.includes('invoice')) {
      plan[0] = 'trigger.gmail.new_email';
    }
  }

  if (lower.includes('extract') || lower.includes('summarize') || lower.includes('classify') || lower.includes('invoice')) {
    plan.push('ai.text');
  }

  if (lower.includes('sheet') || lower.includes('spreadsheet') || lower.includes('row')) {
    plan.push('action.sheets.append');
  }

  if (lower.includes('slack')) {
    plan.push('action.slack.post');
  }

  if (lower.includes('discord')) {
    plan.push('action.discord.post');
  }

  if (lower.includes('send') && lower.includes('email')) {
    plan.push('action.gmail.send');
  }

  if (plan.length === 1) {
    plan.push('ai.text');
  }

  return [...new Set(plan)];
}

export function buildDeterministicWorkflow(prompt) {
  const plan = inferNodePlan(prompt);
  const nodes = plan.map((type, index) => {
    const config = type === 'ai.text' ? { prompt } : {};
    return makeNode(type, index, config);
  });

  return {
    name: prompt.slice(0, 72) || 'Generated workflow',
    description: prompt,
    status: 'draft',
    trigger: { type: nodes[0]?.data?.nodeType || 'trigger.manual' },
    tags: ['generated', 'deterministic'],
    nodes,
    edges: nodes.slice(1).map((node, index) => edge(nodes[index].id, node.id, index))
  };
}
