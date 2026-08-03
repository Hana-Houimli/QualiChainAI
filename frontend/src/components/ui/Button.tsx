import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-soft',
  secondary: 'bg-secondary text-white hover:bg-secondary-hover shadow-soft',
  outline: 'border border-surface-border bg-transparent text-ink-primary hover:bg-slate-50 dark:border-dark-border dark:text-dark-text dark:hover:bg-white/5',
  ghost: 'bg-transparent text-ink-secondary hover:bg-slate-100 dark:text-dark-subtext dark:hover:bg-white/5',
  danger: 'bg-danger text-white hover:bg-red-700 shadow-soft',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
  icon: 'h-9 w-9 p-0',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
