import React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BookCoverFrameProps {
  src?: string;
  alt: string;
  fallbackGradient: string;
  fallbackTitle?: string;
  isThesis?: boolean;
  author?: string;
  year?: number;
  majorCode?: string;
  sourceLabel?: string;
}

export function BookCoverFrame({
  src,
  alt,
  fallbackGradient,
  fallbackTitle,
  isThesis,
  author,
  year,
  majorCode,
  sourceLabel,
}: BookCoverFrameProps) {
  const [failed, setFailed] = React.useState(false);
  const hasImage = Boolean(src && !failed);

  if (!hasImage) {
    const headerLabel = isThesis
      ? majorCode
        ? `LV · ${majorCode}`
        : 'Luận văn UIT'
      : majorCode
        ? `${sourceLabel || 'UIT'} · ${majorCode}`
        : sourceLabel || 'Thư viện UIT';

    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-100">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 0.85px, transparent 0.85px)',
            backgroundSize: '14px 14px',
          }}
        />
        <div
          className={cn(
            'relative z-[1] w-[54%] h-[86%] rounded-r-md rounded-l-[2px] bg-gradient-to-br p-2.5 flex flex-col justify-between text-white overflow-hidden group-hover:scale-[1.03] transition-transform duration-300',
            isThesis
              ? 'border-l-4 border-amber-300/90 shadow-[0_10px_22px_rgba(15,23,42,0.35)]'
              : 'border-l-[6px] border-black/25 shadow-[3px_3px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(15,23,42,0.3)]',
            fallbackGradient
          )}
        >
          {/* Decorative geometric accent */}
          <div className="pointer-events-none absolute -right-5 -top-5 w-16 h-16 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -left-3 bottom-6 w-12 h-12 rounded-full bg-white/5" />

          <div className="relative z-[1] flex items-center justify-between gap-1 border-b border-white/20 pb-1">
            <span
              className={cn(
                'text-[8.5px] font-bold tracking-wider uppercase truncate',
                isThesis ? 'text-amber-200' : 'text-sky-100'
              )}
            >
              {headerLabel}
            </span>
            {year ? (
              <span className="text-[8.5px] font-mono text-white/85 shrink-0">{year}</span>
            ) : null}
          </div>

          <div className="relative z-[1] my-auto space-y-1.5">
            {!isThesis ? (
              <BookOpen className="w-4 h-4 text-white/60" />
            ) : null}
            <p className="text-[10.5px] font-semibold leading-snug line-clamp-4 text-white/95">
              {fallbackTitle || alt}
            </p>
          </div>

          <p className="relative z-[1] text-[9px] text-white/80 truncate border-t border-white/20 pt-1">
            {author || (isThesis ? 'Học viên Cao học UIT' : 'Thư viện Trường ĐH CNTT')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900">
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-125 pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-950/25 to-slate-950/60" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="relative z-[1] max-h-[86%] max-w-[78%] w-auto h-auto object-contain rounded shadow-[0_8px_20px_rgba(0,0,0,0.45)] ring-1 ring-white/15 group-hover:scale-[1.03] transition-transform duration-300"
      />
    </div>
  );
}
