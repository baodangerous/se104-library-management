import React from 'react';
import { cn } from '../../lib/utils';

interface BookCoverFrameProps {
  src?: string;
  alt: string;
  fallbackGradient: string;
  fallbackTitle?: string;
}

export function BookCoverFrame({
  src,
  alt,
  fallbackGradient,
  fallbackTitle,
}: BookCoverFrameProps) {
  const [failed, setFailed] = React.useState(false);
  const hasImage = Boolean(src && !failed);

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
