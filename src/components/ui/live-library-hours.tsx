import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LibraryStatus {
  isOpen: boolean;
  timeStr: string;
  dayLabel: string;
  statusText: string;
  countdownText: string;
}

function getVietnamNow(): Date {
  const now = new Date();
  const vnString = now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
  return new Date(vnString);
}

function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h <= 0) return `${m} phút`;
  return m > 0 ? `${h}g ${m}p` : `${h} giờ`;
}

function computeLibraryStatus(now: Date): LibraryStatus {
  const day = now.getDay(); // 0: CN, 1..5: T2..T6, 6: T7
  const mins = now.getHours() * 60 + now.getMinutes();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const dayLabel = dayNames[day];

  if (day >= 1 && day <= 5) {
    const open = 7 * 60 + 30;
    const close = 18 * 60;
    if (mins >= open && mins < close) {
      return {
        isOpen: true,
        timeStr,
        dayLabel,
        statusText: 'Đang mở cửa',
        countdownText: `Đóng sau ${formatDuration(close - mins)}`,
      };
    }
    if (mins < open) {
      return {
        isOpen: false,
        timeStr,
        dayLabel,
        statusText: 'Chưa mở cửa',
        countdownText: `Mở sau ${formatDuration(open - mins)} (07:30)`,
      };
    }
    const nextOpenLabel = day === 5 ? '08:00 Thứ 7' : '07:30 ngày mai';
    return {
      isOpen: false,
      timeStr,
      dayLabel,
      statusText: 'Đã đóng cửa',
      countdownText: `Mở lại lúc ${nextOpenLabel}`,
    };
  }

  if (day === 6) {
    const open = 8 * 60;
    const close = 16 * 60;
    if (mins >= open && mins < close) {
      return {
        isOpen: true,
        timeStr,
        dayLabel,
        statusText: 'Đang mở cửa',
        countdownText: `Đóng sau ${formatDuration(close - mins)}`,
      };
    }
    if (mins < open) {
      return {
        isOpen: false,
        timeStr,
        dayLabel,
        statusText: 'Chưa mở cửa',
        countdownText: `Mở sau ${formatDuration(open - mins)} (08:00)`,
      };
    }
    return {
      isOpen: false,
      timeStr,
      dayLabel,
      statusText: 'Đã đóng cửa',
      countdownText: 'Mở lại lúc 07:30 Thứ 2',
    };
  }

  return {
    isOpen: false,
    timeStr,
    dayLabel,
    statusText: 'Nghỉ Chủ nhật',
    countdownText: 'Mở lại lúc 07:30 Thứ 2',
  };
}

export function LiveLibraryHours({ variant = 'footer' }: { variant?: 'footer' | 'card' }) {
  const [status, setStatus] = React.useState<LibraryStatus>(() => computeLibraryStatus(getVietnamNow()));

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setStatus(computeLibraryStatus(getVietnamNow()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (variant === 'card') {
    return (
      <div className="p-3 rounded-xl bg-[#f3f8ff] border border-[#1556d6]/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={cn(
              'w-2.5 h-2.5 rounded-full shrink-0',
              status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            )}
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#0a1f4d]">
              {status.statusText} · <span className="text-[#1556d6]">{status.countdownText}</span>
            </p>
            <p className="text-[11px] text-slate-500">{status.dayLabel} (Giờ VN)</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mono text-xs font-bold text-[#0a1f4d] shrink-0">
          {status.timeStr}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="flex items-center gap-2 text-slate-300">
        <Clock className="w-4 h-4 text-sky-400 shrink-0" />
        <span>T2–T6: 07:30–18:00 | T7: 08:00–16:00</span>
      </p>
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-[11px]">
        <span
          className={cn(
            'w-2 h-2 rounded-full shrink-0',
            status.isOpen ? 'bg-[#5be0a3] animate-pulse' : 'bg-amber-400'
          )}
        />
        <span className={status.isOpen ? 'font-bold text-[#5be0a3]' : 'font-bold text-amber-300'}>
          {status.statusText}
        </span>
        <span className="text-slate-400">·</span>
        <span className="text-slate-300">{status.countdownText}</span>
        <span className="font-mono text-sky-300 font-bold">{status.timeStr}</span>
      </div>
    </div>
  );
}

