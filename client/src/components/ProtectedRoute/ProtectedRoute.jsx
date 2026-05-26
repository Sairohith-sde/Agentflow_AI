import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isHydrated, isAuthenticated } = useAuth({ required: true });

  if (!isHydrated || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-panel text-sm text-slate-500">
        Loading secure workspace...
      </main>
    );
  }

  return children;
}
