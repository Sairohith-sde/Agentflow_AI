export async function executionAgent(node, context) {
  const nodeType = node.data?.nodeType || 'unknown';

  if (nodeType.includes('gmail') || nodeType.includes('slack') || nodeType.includes('discord') || nodeType.includes('sheets')) {
    return {
      nodeId: node.id,
      nodeType,
      simulated: true,
      message: `${node.data?.label || nodeType} executed in simulation mode.`,
      input: context
    };
  }

  if (nodeType === 'ai.text') {
    return {
      nodeId: node.id,
      nodeType,
      text: `AI processed prompt: ${node.data?.config?.prompt || 'No prompt provided.'}`
    };
  }

  return {
    nodeId: node.id,
    nodeType,
    ok: true
  };
}
