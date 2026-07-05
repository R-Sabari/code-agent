import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await register({ first_name: form.first_name, last_name: form.last_name, email: form.email, phone: form.phone, password: form.password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-950/40 sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold">Create your account</h2>
          <p className="mt-2 text-sm text-slate-400">Register to access advanced programming assistance and saved workspaces.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">First Name</label>
            <input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Last Name</label>
            <input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Confirm Password</label>
            <input required type="password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" />
          </div>
          <div className="md:col-span-2">
            {error ? <p className="mb-3 text-sm text-rose-400">{error}</p> : null}
            <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400">Register</button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="font-medium text-cyan-400">Sign in</Link></p>
      </div>
    </div>
  );
}
