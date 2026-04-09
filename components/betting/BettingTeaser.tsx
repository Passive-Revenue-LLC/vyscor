'use client';

import { useState } from 'react';

const BETTING_PARTNERS = [
  { id: 'bp-001', name: 'Bet365', bonusText: 'Hasta 100EUR en apuesta gratis' },
  { id: 'bp-002', name: 'Bwin', bonusText: '100% en tu primer deposito' },
  { id: 'bp-003', name: '888sport', bonusText: '30EUR gratis sin deposito' },
];

export default function BettingTeaser() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="bg-bg-card border border-dashed border-[#354FE3]/50 rounded-lg p-4">
      <div className="text-center mb-4">
        <span className="text-2xl">💎</span>
        <h3 className="font-syncopate text-sm font-bold text-white mt-2 uppercase tracking-[0.1em]">
          REFERIDOS &amp; BONOS
        </h3>
        <p className="font-inter text-xs text-muted mt-1">
          Programa de afiliacion con las mejores casas de apuestas. Proximamente.
        </p>
      </div>

      {/* Bookies list (blurred) */}
      <div className="space-y-2 mb-4">
        {BETTING_PARTNERS.map((partner) => (
          <div
            key={partner.id}
            className="relative bg-bg-tertiary rounded-lg p-3 overflow-hidden"
          >
            <div className="filter blur-[4px] select-none">
              <p className="font-inter text-sm font-medium text-white">
                {partner.name}
              </p>
              <p className="font-inter text-[11px] text-[#10B981]">
                {partner.bonusText}
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-bg-tertiary/50">
              <span className="font-inter text-xs text-muted">
                🔒 Disponible pronto
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Waitlist form */}
      {submitted ? (
        <div className="text-center py-2">
          <p className="font-inter text-xs text-[#10B981]">
            Te notificaremos cuando este disponible
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-bg-primary border border-border rounded-lg font-inter text-xs text-white placeholder:text-muted focus:outline-none focus:border-[#354FE3] transition-colors duration-150"
          />
          <button
            type="submit"
            className="w-full px-3 py-2 bg-[#354FE3] hover:bg-[#3E60EA] text-white font-syncopate text-xs font-bold rounded-lg uppercase tracking-[0.1em] transition-colors duration-150"
          >
            NOTIFICARME
          </button>
        </form>
      )}
    </div>
  );
}
