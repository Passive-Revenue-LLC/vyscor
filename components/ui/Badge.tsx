import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'red' | 'purple' | 'amber' | 'green' | 'muted';
  className?: string;
}

const variantStyles: Record<string, string> = {
  cyan: 'bg-cyber-cyan/10 text-cyber-cyan',
  red: 'bg-cyber-red/10 text-cyber-red',
  purple: 'bg-cyber-purple/10 text-cyber-purple2',
  amber: 'bg-cyber-amber/10 text-cyber-amber',
  green: 'bg-cyber-green/10 text-cyber-green',
  muted: 'bg-bg-tertiary text-muted',
};

export default function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full font-orbitron text-[9px] font-bold tracking-wider',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
