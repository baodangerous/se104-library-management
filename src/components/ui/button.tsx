import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#3a86ff] to-[#1556d6] text-white hover:brightness-110 dark:from-[#8fefff] dark:to-[#4da8ff] dark:text-[#030a24] border border-transparent shadow-xs',
  secondary:
    'bg-[#dcebff] text-[#0a1f4d] hover:bg-[#c8e0ff] dark:bg-[#0a2272] dark:text-[#eef5ff] border border-transparent',
  outline:
    'bg-white text-[#2c4a7d] hover:bg-[#f3f8ff] hover:text-[#0a1f4d] border border-slate-200',
  ghost:
    'bg-transparent text-[#2c4a7d] hover:bg-[#dcebff]/60 hover:text-[#0a1f4d] border border-transparent',
  danger:
    'bg-[#a8321a] text-white hover:brightness-110 dark:bg-[#ff9a85] dark:text-[#030a24] border border-transparent shadow-xs',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-lg',
  lg: 'h-11 px-5 text-sm rounded-xl',
  icon: 'h-9 w-9 p-0 rounded-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6] focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
