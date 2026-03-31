import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  primary: 'bg-gradient-to-r from-cyber-purple to-cyber-purple2 text-white hover:opacity-90',
  secondary: 'bg-bg-tertiary border border-border text-[#e8e8f0] hover:border-border-hover',
  ghost: 'text-muted hover:text-[#e8e8f0] hover:bg-bg-tertiary',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-orbitron font-bold tracking-wide rounded-lg transition-all duration-150',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
