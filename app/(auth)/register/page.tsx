'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center" aria-label="Vyscor">
            <img src="/assets/logo-white.svg" alt="Vyscor" className="h-8 w-auto" />
          </Link>
          <p className="font-inter text-sm text-[#AAAAAA] mt-4">
            Crea tu cuenta
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-3 py-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg">
                <p className="font-inter text-xs text-[#EF4444]">{error}</p>
              </div>
            )}
            <div>
              <label className="block font-inter text-xs text-muted mb-1.5">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-bg-primary border border-border rounded-lg font-inter text-sm text-white placeholder:text-muted focus:outline-none focus:border-[#354FE3] transition-colors duration-150"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block font-inter text-xs text-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-bg-primary border border-border rounded-lg font-inter text-sm text-white placeholder:text-muted focus:outline-none focus:border-[#354FE3] transition-colors duration-150"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block font-inter text-xs text-muted mb-1.5">Contrasena</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2.5 bg-bg-primary border border-border rounded-lg font-inter text-sm text-white placeholder:text-muted focus:outline-none focus:border-[#354FE3] transition-colors duration-150"
                placeholder="Minimo 6 caracteres"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-[#354FE3] hover:bg-[#3E60EA] text-white font-syncopate text-sm font-bold rounded-lg uppercase tracking-[0.1em] transition-colors duration-150 disabled:opacity-50"
            >
              {loading ? 'CREANDO...' : 'CREAR CUENTA'}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-bg-card font-inter text-xs text-muted">o</span>
              </div>
            </div>
            <button
              onClick={handleGoogleSignUp}
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border text-white font-inter text-sm font-medium rounded-lg transition-all duration-150 hover:border-border-hover"
            >
              Registrarse con Google
            </button>
          </div>
        </div>

        <p className="text-center font-inter text-xs text-muted mt-4">
          Ya tienes cuenta?{' '}
          <Link href="/login" className="text-[#3E60EA] hover:underline">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
}
