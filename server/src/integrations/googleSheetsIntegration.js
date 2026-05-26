import { BaseIntegration } from './baseIntegration.js';

export class GoogleSheetsIntegration extends BaseIntegration {
  async appendRows(payload) {
    this.ensureConnected();
    return { provider: 'google-sheets', action: 'appendRows', simulated: true, payload };
  }

  async readRange(payload) {
    this.ensureConnected();
    return { provider: 'google-sheets', action: 'readRange', simulated: true, payload };
  }
}
