import { BaseIntegration } from './baseIntegration.js';

export class DiscordIntegration extends BaseIntegration {
  async postMessage(payload) {
    this.ensureConnected();
    return { provider: 'discord', action: 'postMessage', simulated: true, payload };
  }
}
