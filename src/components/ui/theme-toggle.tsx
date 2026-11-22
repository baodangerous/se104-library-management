import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';

const THEME_KEY = 'uit_library_theme_v1';

export function useThemeMode() {
  const [dark, setDark] = React.useState<boolean>(() => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useThemeMode();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
      title={dark ? 'Giao diện Sáng' : 'Giao diện Tối'}
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer',
        className
      )}
    >
      {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

