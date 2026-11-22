import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../lib/utils';

export function FieldLabel({
  className,
  required,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  required?: boolean;
}) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'block text-xs font-medium text-slate-700 mb-1.5',
        className
      )}
      {...props}
    >
      {children}
      {required ? <span className="text-red-600 ml-0.5">*</span> : null}
    </LabelPrimitive.Root>
  );
}

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full h-10 px-3 text-sm bg-white text-slate-900 border border-slate-200 rounded-lg',
      'placeholder:text-slate-400 transition-colors',
      'focus:outline-none focus:border-[#0054A6] focus:ring-2 focus:ring-[#0054A6]/15',
      'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  />
));
TextInput.displayName = 'TextInput';

export const SelectInput = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'w-full h-10 px-3 text-sm bg-white text-slate-900 border border-slate-200 rounded-lg',
      'transition-colors focus:outline-none focus:border-[#0054A6] focus:ring-2 focus:ring-[#0054A6]/15',
      'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
SelectInput.displayName = 'SelectInput';

export const Label = FieldLabel;
export const Input = TextInput;
export const Select = SelectInput;

