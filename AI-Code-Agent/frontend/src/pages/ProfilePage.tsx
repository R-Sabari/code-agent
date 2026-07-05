import { useEffect, useState } from 'react';
import { MessageSquare, User } from 'lucide-react';
import api from '../services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api
      .get('/profile')
      .then((response) => setProfile(response.data))
      .catch(() => undefined);
  }, []);

  if (!profile)
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="text-center">
          <div className="mb-3 text-4xl">⏳</div>
          <p>Loading profile…</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-full bg-slate-950 p-6 text-slate-100 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-cyan-400">Account</p>
          <h1 className="mt-1 text-3xl font-semibold">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-xl font-bold text-white">
              {profile.name?.[0]?.toUpperCase() ?? <User size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100">{profile.name}</h2>
              <p className="text-sm text-slate-400">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: 'Programming Languages',
              value: Array.isArray(profile.programming_languages)
                ? profile.programming_languages.join(', ') || '—'
                : '—',
              icon: '💻',
            },
            {
              label: 'Projects',
              value: profile.projects ?? 0,
              icon: '📁',
            },
            {
              label: 'Chat Count',
              value: profile.chat_count ?? 0,
              icon: '💬',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-slate-900/40 p-5"
            >
              <div className="mb-2 text-2xl">{item.icon}</div>
              <div className="text-xl font-semibold text-slate-100">{item.value}</div>
              <div className="mt-1 text-sm text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
