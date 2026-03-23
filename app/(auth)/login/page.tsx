'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Supabase auth integration
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-baseline">
            <span className="font-orbitron font-black text-3xl text-cyber-cyan text-glow-cyan">ODD</span>
            <span className="font-orbitron font-black text-3xl text-cyber-purple2 text-glow-purple">YX</span>
          </Link>
          <p className="font-mono text-xs text-muted mt-2">Inicia sesion en tu cuenta</p>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-bg-primary border border-border rounded-lg font-mono text-sm text-[#e8e8f0] placeholder:text-muted focus:outline-none focus:border-cyber-cyan transition-colors duration-150"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">Contrasena</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-bg-primary border border-border rounded-lg font-mono text-sm text-[#e8e8f0] placeholder:text-muted focus:outline-none focus:border-cyber-cyan transition-colors duration-150"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-gradient-to-r from-cyber-purple to-cyber-purple2 text-white font-orbitron text-sm font-bold rounded-lg tracking-wide transition-all duration-150 hover:opacity-90"
            >
              ENTRAR
            </button>
          </form>

          {/* Google OAuth */}
          <div className="mt-4">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-bg-card font-mono text-xs text-muted">o</span>
              </div>
            </div>
            <button className="w-full px-4 py-2.5 bg-bg-tertiary border border-border text-[#e8e8f0] font-mono text-sm rounded-lg transition-all duration-150 hover:border-border-hover">
              Continuar con Google
            </button>
          </div>
        </div>

        <p className="text-center font-mono text-xs text-muted mt-4">
          No tienes cuenta?{' '}
          <Link href="/register" className="text-cyber-cyan hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
