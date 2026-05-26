export async function monitoringAgent(event) {
  return {
    observedAt: new Date().toISOString(),
    ...event
  };
}
