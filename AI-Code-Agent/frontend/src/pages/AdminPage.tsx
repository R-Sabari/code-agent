import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([api.get('/admin/dashboard'), api.get('/admin/users')]).then(([dashboardRes, usersRes]) => {
      setDashboard(dashboardRes.data);
      setUsers(usersRes.data);
    }).catch(() => undefined);
  }, []);

  if (!dashboard) return <div className="min-h-screen bg-slate-950 p-10 text-slate-100">Loading admin panel…</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-950/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Admin Panel</p>
            <h2 className="text-3xl font-semibold">Operations Dashboard</h2>
          </div>
          <Link to="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">Back</Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Users</p>
            <p className="mt-2 text-2xl font-semibold">{dashboard.users}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Chats</p>
            <p className="mt-2 text-2xl font-semibold">{dashboard.chats}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">API Usage</p>
            <p className="mt-2 text-2xl font-semibold">{dashboard.api_usage}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-white/10 bg-slate-900/40">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
