import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'live' | 'upcoming' | 'finished' | 'purple' | 'muted' | 'cyan' | 'red' | 'amber' | 'green';
  className?: string;
}

// All badges live on dark surfaces and use the Vyscor purple/gray palette only.
const variantStyles: Record<string, string> = {
  live: 'bg-[#354FE3]/12 text-[#3E60EA] border border-[#354FE3]/30',
  upcoming: 'bg-white/5 text-[#AAAAAA] border border-[#252525]',
  finished: 'bg-transparent text-[#6B6B6B] border border-[#252525]',
  purple: 'bg-[#354FE3]/12 text-[#3E60EA] border border-[#354FE3]/30',
  muted: 'bg-white/5 text-[#6B6B6B] border border-[#252525]',
  // Legacy variant names map to brand-correct equivalents
  cyan: 'bg-white/5 text-[#AAAAAA] border border-[#252525]',
  red: 'bg-[#354FE3]/12 text-[#3E60EA] border border-[#354FE3]/30',
  amber: 'bg-white/5 text-[#AAAAAA] border border-[#252525]',
  green: 'bg-[#354FE3]/12 text-[#3E60EA] border border-[#354FE3]/30',
};

export default function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded font-syncopate text-[10px] font-bold uppercase tracking-[0.1em]',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
