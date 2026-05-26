import AppShell from '../components/AppShell/AppShell';
import IntegrationCard from '../components/Integrations/IntegrationCard';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { useEffect, useState } from 'react';
import { listIntegrations, startOAuth } from '../services/integrationApi';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listIntegrations().then(setIntegrations).catch(() => setIntegrations([]));
  }, []);

  async function handleConnect(provider) {
    setError('');

    try {
      const result = await startOAuth(provider);
      window.location.href = result.url;
    } catch (apiError) {
      setError(apiError.response?.data?.error?.message || 'Unable to start OAuth flow.');
    }
  }

  return (
    <ProtectedRoute>
      <AppShell title="Integrations">
        {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {integrations.map((integration) => (
            <IntegrationCard integration={integration} key={integration.provider} onConnect={handleConnect} />
          ))}
        </section>
      </AppShell>
    </ProtectedRoute>
  );
}
