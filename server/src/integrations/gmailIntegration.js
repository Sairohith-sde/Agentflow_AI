import { BaseIntegration } from './baseIntegration.js';

export class GmailIntegration extends BaseIntegration {
  async sendMail(payload) {
    this.ensureConnected();
    return { provider: 'gmail', action: 'sendMail', simulated: true, payload };
  }

  async readMail(payload) {
    this.ensureConnected();
    return { provider: 'gmail', action: 'readMail', simulated: true, payload };
  }
}
