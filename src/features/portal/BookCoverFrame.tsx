import React from 'react';
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
}: BookCoverFrameProps) {
  const [failed, setFailed] = React.useState(false);
  const hasImage = Boolean(src && !failed);

  if (!hasImage && isThesis) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-100">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'radial-gradient(#94a3b8 0.85px, transparent 0.85px)',
            backgroundSize: '14px 14px',
          }}
        />
        <div
          className={cn(
            'relative z-[1] w-[54%] h-[86%] rounded-r-md rounded-l-[2px] bg-gradient-to-br border-l-4 border-amber-300/90 shadow-[0_10px_22px_rgba(15,23,42,0.35)] p-2.5 flex flex-col justify-between text-white group-hover:scale-[1.03] transition-transform duration-300',
            fallbackGradient
          )}
        >
          <div className="flex items-center justify-between gap-1 border-b border-white/20 pb-1">
            <span className="text-[9px] font-bold tracking-wider uppercase text-amber-200">
              {majorCode ? `LV · ${majorCode}` : 'Luận văn UIT'}
            </span>
            {year ? (
              <span className="text-[9px] font-mono text-white/85">{year}</span>
            ) : null}
          </div>
          <p className="text-[10.5px] font-semibold leading-snug line-clamp-4 text-white/95 my-auto">
            {fallbackTitle || alt}
          </p>
          <p className="text-[9.5px] text-sky-200/90 truncate border-t border-white/15 pt-1">
            {author || 'Học viên Cao học UIT'}
          </p>
        </div>
      </div>
    );
  }

  if (!hasImage) {
    return (
      <div className={cn('w-full h-full bg-gradient-to-br p-4 flex flex-col justify-end text-white', fallbackGradient)}>
        {fallbackTitle && (
          <p className="text-xs font-bold leading-snug line-clamp-2 drop-shadow-xs">
            {fallbackTitle}
          </p>
        )}
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
