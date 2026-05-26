export function calculateBackoff(attemptsMade) {
  return Math.min(30000, 1000 * 2 ** attemptsMade);
}
