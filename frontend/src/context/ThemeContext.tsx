import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'maritime_optimizer_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
        return savedTheme;
      }
    }
    return 'light'; // Default to light mode for initial presentation
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Compute resolved theme & apply to DOM
  useEffect(() => {
    const getSystemTheme = (): ResolvedTheme => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
      return 'dark';
    };

    const actualTheme = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(actualTheme);

    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(actualTheme);
    root.setAttribute('data-theme', actualTheme);
    root.style.colorScheme = actualTheme;

    // Listen for system theme changes if in 'system' mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newResolved = e.matches ? 'light' : 'dark';
        setResolvedTheme(newResolved);
        root.classList.remove('dark', 'light');
        root.classList.add(newResolved);
        root.setAttribute('data-theme', newResolved);
        root.style.colorScheme = newResolved;
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
