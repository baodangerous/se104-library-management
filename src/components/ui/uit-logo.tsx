import * as React from 'react';
import { cn } from '../../lib/utils';

interface UitLogoProps {
  className?: string;
  alt?: string;
}

export function UitLogo({
  className = 'w-10 h-10',
  alt = 'Logo Thư viện Trường Đại học Công nghệ Thông tin – ĐHQG-HCM',
}: UitLogoProps) {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <div
        aria-label={alt}
        className={cn(
          'rounded-xl bg-[#0054A6] text-white font-bold text-xs tracking-tight flex items-center justify-center shrink-0 ring-2 ring-white/25',
          className
        )}
      >
        UIT
      </div>
    );
  }

  return (
    <img
      src="/images/uit-library-logo.png"
      alt={alt}
      onError={() => setFailed(true)}
      className={cn(
        'rounded-xl object-contain p-0.5 bg-white shrink-0 shadow-xs ring-1 ring-slate-900/5',
        className
      )}
    />
  );
}
