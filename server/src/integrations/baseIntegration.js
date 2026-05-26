export class BaseIntegration {
  constructor(integration) {
    this.integration = integration;
  }

  ensureConnected() {
    if (!this.integration || this.integration.status !== 'connected') {
      const error = new Error('Integration is not connected.');
      error.code = 'INTEGRATION_NOT_CONNECTED';
      throw error;
    }
  }
}
