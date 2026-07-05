import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Code2,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/playground', icon: Code2, label: 'Playground' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/admin', icon: Shield, label: 'Admin', adminOnly: true },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin',
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside
        style={{ width: collapsed ? 72 : 240, transition: 'width 0.25s ease' }}
        className="relative flex h-full flex-shrink-0 flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur"
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 ring-1 ring-cyan-400/30">
            <Bot size={20} className="text-cyan-400" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold leading-tight text-slate-100">
                AI Code Agent
              </p>
              <p className="truncate text-xs text-cyan-400">v1.0 • Pro</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {visibleItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-white/10 p-2">
          {user && !collapsed && (
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-slate-800/60 px-3 py-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-xs font-bold text-white">
                {(user as any).first_name?.[0]?.toUpperCase() ??
                  user.name?.[0]?.toUpperCase() ??
                  'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-100">
                  {(user as any).first_name
                    ? `${(user as any).first_name} ${(user as any).last_name}`
                    : user.name}
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-slate-800 text-slate-400 shadow transition hover:bg-slate-700 hover:text-slate-100"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
