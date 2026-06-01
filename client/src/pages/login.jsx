import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { login } from '../services/authApi';
import { useAuthStore } from '../store/authStore';
import { getApiErrorMessage } from '../utils/apiError';

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const session = await login(form);
      setSession(session);
      router.push('/dashboard');
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Login failed.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-panel px-4">
      <section className="w-full max-w-md rounded border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Access the Agentflow_AI operator console.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>

          {error ? <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <button
            className="w-full rounded bg-brand px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          New here?{' '}
          <Link className="font-medium text-brand" href="/register">
            Create an account
          </Link>
        </p>
        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
          Made with ❤️ by <span className="font-semibold text-slate-500">Sai Rohith</span>
        </div>
      </section>
    </main>
  );
}
