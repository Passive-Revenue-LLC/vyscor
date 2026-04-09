import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-[#354FE3] text-white hover:bg-[#3E60EA] active:bg-[#2A3FB8] disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-white border border-[#354FE3] hover:bg-[#354FE3]/12 hover:border-[#3E60EA]',
  ghost:
    'bg-transparent text-[#6B6B6B] hover:text-white hover:bg-[#1B1B1B]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-2.5 text-[12px]',
  lg: 'px-8 py-3 text-[13px]',
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
        'font-syncopate font-bold uppercase tracking-[0.1em] rounded-md transition-colors duration-150 active:scale-[0.98]',
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
