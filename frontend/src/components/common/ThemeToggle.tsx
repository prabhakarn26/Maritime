import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented' | 'sidebar';
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
  showLabels = false
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'segmented') {
    const options: { value: Theme; label: string; icon: React.FC<{ className?: string }> }[] = [
      { value: 'light', label: 'Light', icon: Sun },
      { value: 'dark', label: 'Dark', icon: Moon },
      { value: 'system', label: 'System', icon: Laptop }
    ];

    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-700/60 light:border-slate-300 backdrop-blur-sm ${className}`}
        role="group"
        aria-label="Theme selector"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900 hover:bg-slate-800/50 light:hover:bg-slate-200/60'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {(showLabels || true) && <span>{opt.label}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'sidebar') {
    const isDark = resolvedTheme === 'dark';
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-slate-300 hover:text-white hover:bg-slate-900/80 light:text-slate-700 light:hover:text-slate-900 light:hover:bg-slate-100 border border-transparent hover:border-slate-800 light:hover:border-slate-200 ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        <div className="flex items-center gap-2.5">
          {isDark ? (
            <Moon className="h-4 w-4 text-cyan-400" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
          <span>Theme Mode</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-800 border border-slate-700/60 light:border-slate-300">
          <span>{isDark ? 'Dark' : 'Light'}</span>
        </div>
      </button>
    );
  }

  // Compact variant for Header & Navbars
  const isDark = resolvedTheme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-all duration-300 group ${
        isDark
          ? 'bg-slate-900 border border-slate-700/70 text-amber-400 hover:text-amber-300 hover:border-amber-400/40 hover:bg-slate-800/90 shadow-sm'
          : 'bg-white border border-slate-200 text-slate-700 hover:text-cyan-600 hover:border-cyan-400/50 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
      title={`Current: ${isDark ? 'Dark Mode' : 'Light Mode'} (Click to toggle)`}
    >
      <div className="relative h-4 w-4 overflow-hidden flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={`h-4 w-4 text-amber-500 transition-all duration-300 transform ${
            isDark ? 'opacity-0 rotate-90 scale-50 absolute' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`h-4 w-4 text-cyan-400 transition-all duration-300 transform ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50 absolute'
          }`}
        />
      </div>
    </button>
  );
};
