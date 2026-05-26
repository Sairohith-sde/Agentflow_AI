import { Link as LinkIcon, Unplug } from 'lucide-react';

const providerLabels = {
  gmail: 'Gmail',
  slack: 'Slack',
  discord: 'Discord',
  'google-sheets': 'Google Sheets'
};

export default function IntegrationCard({ integration, onConnect }) {
  const connected = integration.status === 'connected';

  return (
    <article className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">{providerLabels[integration.provider] || integration.provider}</h2>
          <p className="mt-1 text-sm text-slate-500">{connected ? integration.accountLabel || 'Connected' : 'Not connected'}</p>
        </div>
        <span className={`rounded px-2 py-1 text-xs font-medium ${connected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {integration.status}
        </span>
      </div>

      <button
        className="mt-4 inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand"
        onClick={() => onConnect(integration.provider)}
        type="button"
      >
        {connected ? <Unplug className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        {connected ? 'Reconnect' : 'Connect'}
      </button>
    </article>
  );
}
