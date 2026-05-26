import AppShell from '../components/AppShell/AppShell';
import MetricGrid from '../components/MetricGrid/MetricGrid';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell title="Dashboard">
        <MetricGrid />

        <section className="mt-6 grid gap-4 xl:grid-cols-3">
          <article className="rounded border border-slate-200 bg-white p-4 xl:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">Recent workflows</h2>
              <Link className="rounded bg-brand px-3 py-2 text-sm font-medium text-white" href="/workflows/new">
                New workflow
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">Create your first workflow, then return here for metrics.</p>
          </article>

          <article className="rounded border border-slate-200 bg-white p-4">
            <h2 className="text-base font-semibold text-ink">AI activity</h2>
            <p className="mt-4 text-sm text-slate-500">Agent reasoning events will stream here in later phases.</p>
          </article>
        </section>
      </AppShell>
    </ProtectedRoute>
  );
}
