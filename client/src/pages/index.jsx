import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const router = useRouter();
  const { isHydrated, token } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    router.replace(token ? '/dashboard' : '/login');
  }, [isHydrated, token, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-panel text-sm text-slate-500">
      Opening Agentflow_AI...
    </main>
  );
}
