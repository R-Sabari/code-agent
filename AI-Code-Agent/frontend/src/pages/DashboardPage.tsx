import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Code2,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { ChatHistoryItem } from '../types';

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const QUICK_ACTIONS = [
  {
    to: '/chat',
    icon: MessageSquare,
    label: 'Start AI Chat',
    description: 'Open a new conversation with the AI assistant.',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-400/20',
    iconColor: 'text-cyan-400',
  },
  {
    to: '/playground',
    icon: Code2,
    label: 'Code Playground',
    description: 'Generate, debug, explain, or optimize code.',
    gradient: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-400/20',
    iconColor: 'text-violet-400',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [histories, setHistories] = useState<ChatHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    api
      .get('/history')
      .then((res) => setHistories(res.data))
      .catch(() => undefined)
      .finally(() => setLoadingHistory(false));
  }, []);

  const totalMessages = histories.reduce((sum, h) => sum + h.messages.length, 0);

  const stats: Stat[] = [
    {
      label: 'Total Chats',
      value: histories.length,
      icon: MessageSquare,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10 ring-cyan-400/20',
    },
    {
      label: 'Messages Sent',
      value: totalMessages,
      icon: TrendingUp,
      color: 'text-violet-400',
      bgColor: 'bg-violet-400/10 ring-violet-400/20',
    },
    {
      label: 'AI Model',
      value: 'GPT-4',
      icon: Bot,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10 ring-amber-400/20',
    },
    {
      label: 'Status',
      value: 'Active',
      icon: Zap,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10 ring-emerald-400/20',
    },
  ];

  const firstName = (user as any)?.first_name ?? user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-full bg-slate-950 p-6 text-slate-100 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-cyan-400">Dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-100">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-2 text-slate-400">
            Your AI-powered coding workspace is ready.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur"
              >
                <div
                  className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${stat.bgColor}`}
                >
                  <Icon size={18} className={stat.color} />
                </div>
                <div className="text-2xl font-semibold text-slate-100">
                  {loadingHistory && typeof stat.value === 'number' ? '—' : stat.value}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`group flex items-start gap-4 rounded-2xl border bg-gradient-to-br p-5 transition hover:scale-[1.02] ${action.gradient} ${action.border}`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900/60 ring-1 ${action.border}`}
                  >
                    <Icon size={20} className={action.iconColor} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">{action.label}</p>
                    <p className="mt-1 text-sm text-slate-400">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Conversations */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Recent Conversations
            </h2>
            <Link to="/chat" className="text-xs text-cyan-400 hover:text-cyan-300">
              View all →
            </Link>
          </div>

          {loadingHistory ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 animate-pulse rounded-2xl bg-slate-900/60" />
              ))}
            </div>
          ) : histories.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 py-12 text-center">
              <Sparkles size={32} className="mb-3 text-slate-600" />
              <p className="text-slate-400">No conversations yet.</p>
              <Link
                to="/chat"
                className="mt-4 rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
              >
                Start your first chat
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {histories.slice(0, 5).map((h) => (
                <Link
                  key={h.id}
                  to="/chat"
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/40 px-4 py-3 transition hover:bg-slate-900/80"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{h.title}</p>
                    <p className="text-xs text-slate-500">
                      {h.messages.length} messages · {new Date(h.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <MessageSquare size={16} className="ml-4 flex-shrink-0 text-slate-500" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
