import AppShell from '../components/AppShell/AppShell';
import ExecutionTimeline from '../components/ExecutionTimeline/ExecutionTimeline';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useExecutionEvents } from '../hooks/useExecutionEvents';
import { getExecutionTimeline, listExecutions } from '../services/executionApi';

export default function ExecutionsPage() {
  const router = useRouter();
  const selectedExecutionId = router.query.executionId;
  const liveEvents = useExecutionEvents(selectedExecutionId);
  const [executions, setExecutions] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    listExecutions().then((data) => setExecutions(data.items)).catch(() => setExecutions([]));
  }, []);

  useEffect(() => {
    if (!selectedExecutionId) return;
    getExecutionTimeline(selectedExecutionId).then(setTimeline).catch(() => setTimeline([]));
  }, [selectedExecutionId]);

  const events = [...timeline, ...liveEvents];

  return (
    <ProtectedRoute>
      <AppShell title="Executions">
        <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="rounded border border-slate-200 bg-white p-4">
            <h2 className="text-base font-semibold text-ink">Execution history</h2>
            <div className="mt-4 space-y-2">
              {executions.map((execution) => (
                <button
                  className="w-full rounded border border-slate-200 px-3 py-2 text-left text-sm hover:border-brand"
                  key={execution.id}
                  onClick={() => router.push(`/executions?executionId=${execution.id}`)}
                  type="button"
                >
                  <span className="font-medium text-ink">{execution.workflowSnapshot?.name || 'Workflow run'}</span>
                  <span className="mt-1 block text-xs text-slate-500">{execution.status}</span>
                </button>
              ))}
              {!executions.length ? <p className="text-sm text-slate-500">No executions yet.</p> : null}
            </div>
          </section>

          <section className="rounded border border-slate-200 bg-white p-4">
            <h2 className="text-base font-semibold text-ink">Live timeline</h2>
            <div className="mt-4">
              <ExecutionTimeline events={events} />
            </div>
          </section>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
