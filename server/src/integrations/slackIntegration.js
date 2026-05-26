import { BaseIntegration } from './baseIntegration.js';

export class SlackIntegration extends BaseIntegration {
  async postMessage(payload) {
    this.ensureConnected();
    return { provider: 'slack', action: 'postMessage', simulated: true, payload };
  }

  async subscribeToEvents(payload) {
    this.ensureConnected();
    return { provider: 'slack', action: 'subscribeToEvents', simulated: true, payload };
  }
}
