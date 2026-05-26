import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bell, Blocks, LayoutDashboard, LogOut, PlayCircle, Settings, Workflow } from 'lucide-react';
import { useEffect, useState } from 'react';
import { listNotifications, markNotificationsRead } from '../../services/notificationApi';
import { getSocket } from '../../services/socket';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workflows/builder', label: 'Builder', icon: Workflow },
  { href: '/executions', label: 'Executions', icon: PlayCircle },
  { href: '/integrations', label: 'Integrations', icon: Blocks },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export default function AppShell({ title, children }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, setNotifications, addNotification } = useNotificationStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return undefined;

    listNotifications().then(setNotifications).catch(() => setNotifications([]));

    const socket = getSocket();
    socket.connect();
    socket.emit('user:subscribe', user.id);
    socket.on('notification:new', addNotification);

    return () => {
      socket.off('notification:new', addNotification);
    };
  }, [user?.id, setNotifications, addNotification]);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-panel">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-brand text-sm font-bold text-white">
            AI
          </span>
          Agentflow_AI
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-medium ${
                  active ? 'bg-blue-50 text-brand' : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Operator Console</p>
            <h1 className="text-lg font-semibold text-ink">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative rounded p-2 text-slate-500 hover:bg-slate-100"
              title="Notifications"
              onClick={async () => {
                setDrawerOpen((open) => !open);
                const updated = await markNotificationsRead().catch(() => notifications);
                setNotifications(updated);
              }}
            >
              <Bell className="h-5 w-5" />
              {notifications.some((notification) => !notification.read) ? (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              ) : null}
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">{user?.name || 'Operator'}</p>
              <p className="text-xs text-slate-500">{user?.role || 'operator'}</p>
            </div>
            <button className="rounded p-2 text-slate-500 hover:bg-slate-100" title="Logout" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {drawerOpen ? (
          <aside className="fixed right-4 top-20 z-20 w-[min(360px,calc(100vw-2rem))] rounded border border-slate-200 bg-white p-4 shadow-lg">
            <h2 className="text-sm font-semibold text-ink">Notifications</h2>
            <div className="mt-3 max-h-96 space-y-2 overflow-auto">
              {notifications.map((notification) => (
                <article className="rounded border border-slate-200 p-3" key={notification.id}>
                  <p className="text-sm font-medium text-ink">{notification.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{notification.message}</p>
                </article>
              ))}
              {!notifications.length ? <p className="text-sm text-slate-500">No notifications yet.</p> : null}
            </div>
          </aside>
        ) : null}

        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
