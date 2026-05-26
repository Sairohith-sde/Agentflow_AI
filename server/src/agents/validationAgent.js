export async function validationAgent(node, output) {
  if (!output || typeof output !== 'object') {
    return {
      valid: false,
      missingFields: ['output']
    };
  }

  return {
    valid: true,
    missingFields: []
  };
}
