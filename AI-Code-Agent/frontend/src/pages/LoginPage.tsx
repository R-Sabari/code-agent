import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Unable to sign in.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 shadow-2xl shadow-cyan-950/40 lg:flex-row">
        <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-cyan-600/30 via-slate-900 to-purple-600/20 p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_30%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                <Sparkles className="mr-2 h-4 w-4" /> AI Code Generation Agent
              </div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Build smarter with an AI coding co-pilot.</h1>
              <p className="mt-4 max-w-lg text-lg text-slate-300">From code generation to debugging and project scaffolding, everything is centered in one polished experience.</p>
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">“Generate, explain, debug, and optimize code in a single conversation.”</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 sm:p-10">
          <div className="mx-auto max-w-md">
            <h2 className="text-3xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">Sign in to continue your coding workflow.</p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 outline-none ring-0" placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Password</label>
                <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3">
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} required className="w-full bg-transparent outline-none" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400">
                  <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="rounded border-slate-700 bg-slate-950" /> Remember me
                </label>
                <a href="#" className="text-cyan-400">Forgot password?</a>
              </div>
              {error ? <p className="text-sm text-rose-400">{error}</p> : null}
              <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400">Sign In</button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">
              <button className="w-full rounded-2xl border border-slate-700 px-4 py-3 text-slate-200 transition hover:bg-slate-800">Continue with Google</button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-400">Don&apos;t have an account? <Link to="/register" className="font-medium text-cyan-400">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
