import { buildDeterministicWorkflow } from '../ai/deterministicBuilder.js';
import { nodeCatalog } from '../ai/nodeCatalog.js';
import { generateWithGemini } from '../ai/geminiClient.js';
import { generateWithOpenRouter } from '../ai/openRouterClient.js';

function systemPrompt() {
  return [
    'You generate executable workflow graphs for Agentflow_AI.',
    'Return only JSON with keys: name, description, status, trigger, tags, nodes, edges.',
    'Each node must use type "agentNode" and data.label, data.nodeType, data.config.',
    'Edges must include id, source, target, and animated.',
    `Available node catalog: ${JSON.stringify(nodeCatalog)}`
  ].join('\n');
}

function validateGeneratedWorkflow(workflow) {
  if (!workflow || !Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
    return false;
  }

  return workflow.nodes.every((node) => node.id && node.type && node.position && node.data?.nodeType);
}

export async function generateWorkflowFromPrompt(prompt) {
  const promptText = prompt.trim();
  const sources = [
    { name: 'openrouter', run: () => generateWithOpenRouter(promptText, systemPrompt()) },
    { name: 'gemini', run: () => generateWithGemini(promptText, systemPrompt()) }
  ];

  for (const source of sources) {
    try {
      const workflow = await source.run();

      if (validateGeneratedWorkflow(workflow)) {
        return {
          provider: source.name,
          workflow: {
            ...workflow,
            status: workflow.status || 'draft',
            tags: [...new Set([...(workflow.tags || []), 'generated', source.name])]
          }
        };
      }
    } catch (error) {
      console.warn(`${source.name} workflow generation failed: ${error.message}`);
    }
  }

  return {
    provider: 'deterministic',
    workflow: buildDeterministicWorkflow(promptText)
  };
}
