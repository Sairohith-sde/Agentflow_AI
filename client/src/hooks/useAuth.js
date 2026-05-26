import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getMe } from '../services/authApi';
import { useAuthStore } from '../store/authStore';

export function useAuth({ required = false, redirectTo = '/login' } = {}) {
  const router = useRouter();
  const { isHydrated, token, user, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (required && !token) {
      router.replace(redirectTo);
      return;
    }

    if (token && !user) {
      getMe().then(setUser).catch(logout);
    }
  }, [isHydrated, token, user, required, redirectTo, router, setUser, logout]);

  return { isHydrated, token, user, isAuthenticated: Boolean(token) };
}
