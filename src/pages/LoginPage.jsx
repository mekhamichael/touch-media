import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';

const inputStyle =
  'w-full rounded-md border border-navy-600 bg-navy-800 px-3 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none';

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useSEO({
    title: 'Admin Sign In | TouchMedia',
    description: 'TouchMedia content dashboard sign in.',
    noindex: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await signIn(email.trim(), password);

    if (error) {
      setLoading(false);
      if (error.message.includes('Email not confirmed')) {
        setErrorMsg('Email not confirmed yet. Check your inbox for the confirmation link.');
      } else if (/invalid login/i.test(error.message)) {
        setErrorMsg('Invalid email or password.');
      } else {
        setErrorMsg(error.message);
      }
      return;
    }

    window.location.replace('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-br from-gold/20 via-fuchsia-500/15 to-cyan-400/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm z-10">
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-6 shadow-2xl sm:p-8">
          <div className="mb-8 text-center">
            <p className="font-serif text-2xl font-bold text-cream">
              Touch<span className="text-gold">Media</span>
            </p>
            <p className="mt-1 text-[10px] tracking-[0.3em] uppercase text-cream/50">
              Content Dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-[0.15em] uppercase text-cream/60">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-[0.15em] uppercase text-cream/60">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputStyle}
              />
            </div>

            {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gold px-4 py-2.5 text-xs font-bold tracking-[0.2em] uppercase text-navy-900 transition-colors hover:bg-gold-light disabled:opacity-50 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-cream/40">
            Accounts are created by the site administrator only.
          </p>
        </div>
      </div>
    </div>
  );
}
