import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#1B1B1B] border border-[#252525] rounded-[10px] p-4 transition-colors duration-150',
        className
      )}
    >
      {children}
    </div>
  );
}
