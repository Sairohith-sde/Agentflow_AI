export function getApiErrorMessage(error, fallback = 'Request failed.') {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Cannot reach the API server. Make sure the backend is running on the configured API URL.';
  }

  return fallback;
}
