import AppShell from '../components/AppShell/AppShell';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <AppShell title="Settings">
        <section className="rounded border border-slate-200 bg-white p-4">
          <h2 className="text-base font-semibold text-ink">Profile and security</h2>
          <p className="mt-2 text-sm text-slate-500">Account, key health, and preferences will expand from here.</p>
        </section>
      </AppShell>
    </ProtectedRoute>
  );
}
