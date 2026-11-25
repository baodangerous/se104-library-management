import * as React from 'react';
import { cn } from '../../lib/utils';

export function SurfaceCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-xl shadow-xs',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SurfaceCardHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-slate-100',
        className
      )}
    >
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-slate-900 tracking-tight">
          {title}
        </h3>
        {description ? (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 flex items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export const Card = SurfaceCard;
export const CardHeader = SurfaceCardHeader;

