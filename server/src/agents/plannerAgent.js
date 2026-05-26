export async function plannerAgent(workflow) {
  const nodeOrder = [...workflow.nodes]
    .sort((a, b) => (a.position?.x || 0) - (b.position?.x || 0))
    .map((node) => node.id);

  return {
    nodeOrder,
    confidence: nodeOrder.length ? 0.9 : 0.2
  };
}
