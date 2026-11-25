import * as React from 'react';
import { cn } from '../../lib/utils';

interface WorkspacePageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function WorkspacePageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: WorkspacePageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-1',
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0054A6] mb-1">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">{title}</h2>
        {description ? (
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-2">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}
