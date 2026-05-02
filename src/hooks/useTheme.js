import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'app_theme';
const THEME_EVENT = 'app:theme';

function normalizeTheme(value) {
  return value === 'dark' ? 'dark' : 'light';
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'light' || saved === 'dark' ? saved : getSystemTheme();
}

function applyTheme(theme) {
  const nextTheme = normalizeTheme(theme);
  document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  localStorage.setItem(STORAGE_KEY, nextTheme);
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        setThemeState(normalizeTheme(event.newValue));
      }
    };

    const handleThemeEvent = (event) => {
      if (event.detail) {
        setThemeState((current) => {
          const next = normalizeTheme(event.detail);
          return current === next ? current : next;
        });
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(THEME_EVENT, handleThemeEvent);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(THEME_EVENT, handleThemeEvent);
    };
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState((current) => {
      const resolved = normalizeTheme(typeof next === 'function' ? next(current) : next);
      return resolved;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    setIsDark: (checked) => setTheme(checked ? 'dark' : 'light'),
  };
}
