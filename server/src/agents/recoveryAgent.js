export async function recoveryAgent(error) {
  const message = error?.message || '';
  let classification = 'TRANSIENT';

  if (message.includes('missing')) classification = 'MISSING_FIELDS';
  if (message.includes('rate')) classification = 'RATE_LIMIT';
  if (message.includes('auth')) classification = 'AUTH_EXPIRED';
  if (message.includes('api')) classification = 'API_FAILURE';

  return {
    classification,
    action: classification === 'AUTH_EXPIRED' || classification === 'MISSING_FIELDS' ? 'escalate' : 'retry_with_backoff'
  };
}
