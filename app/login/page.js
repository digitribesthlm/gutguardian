'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left brand panel (HubSpot-style) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-teal-700 via-emerald-600 to-sky-600 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-white/10 absolute -top-16 -left-16" />
          <div className="w-80 h-80 rounded-full bg-white/10 absolute -bottom-24 left-64" />
          <div className="w-72 h-72 rounded-full bg-black/10 absolute top-72 right-40" />
        </div>
        <header className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
            <span className="text-xl font-bold tracking-tight">G</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-widest text-teal-100/80">
              GutGuardian
            </span>
            <span className="text-lg font-semibold">Gut health, made simple.</span>
          </div>
        </header>

        <main className="relative z-10 max-w-md">
          <h1 className="text-3xl font-semibold mb-4">
            Stay ahead of your gut health, every day.
          </h1>
          <p className="text-teal-50/90 text-sm leading-relaxed mb-8">
            Track symptoms, identify triggers, and follow your AIP journey with a
            workspace designed to feel as polished as your favorite tools.
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">
                1
              </span>
              <div>
                <p className="font-medium">Log the details that matter</p>
                <p className="text-teal-50/80">
                  Capture meals, symptoms, and stress in one connected journal.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">
                2
              </span>
              <div>
                <p className="font-medium">Spot patterns with clarity</p>
                <p className="text-teal-50/80">
                  Visual dashboards help you see how lifestyle shifts impact your gut.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">
                3
              </span>
              <div>
                <p className="font-medium">Move through AIP with confidence</p>
                <p className="text-teal-50/80">
                  Build routines, recipes, and shopping lists that truly support healing.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 text-xs text-teal-100/70">
          <p>Built for real-life routines, not perfect days.</p>
        </footer>
      </div>

      {/* Right auth card */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/10 flex items-center justify-center text-teal-600">
              <span className="text-lg font-semibold">G</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-slate-400">
                GutGuardian
              </span>
              <span className="text-base font-semibold text-slate-800">
                Welcome back
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 px-8 py-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Sign in to your workspace
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Use the email and password associated with your GutGuardian account.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-widest text-slate-500"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium uppercase tracking-widest text-slate-500"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {error && (
                <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-xs text-slate-500">
              By continuing, you agree to our{' '}
              <span className="font-medium text-teal-600">Terms</span> and{' '}
              <span className="font-medium text-teal-600">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

