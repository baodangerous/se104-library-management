import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SegmentedTabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: SegmentedTabItem<T>[];
  value: T;
  onChange: (next: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200',
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              active
                ? 'bg-white text-[#0054A6] shadow-xs border border-slate-200/70'
                : 'text-slate-600 hover:text-slate-900 border border-transparent'
            )}
          >
            {Icon ? <Icon className="w-3.5 h-3.5 shrink-0" /> : null}
            <span>{item.label}</span>
            {typeof item.count === 'number' ? (
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums',
                  active ? 'bg-[#0054A6]/10 text-[#0054A6]' : 'bg-slate-200/80 text-slate-600'
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
