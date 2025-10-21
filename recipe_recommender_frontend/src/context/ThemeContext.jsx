import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useTheme provides access to theme state.
 * @returns {{theme: 'light'|'dark', toggleTheme: Function}}
 */
export const useTheme = () => useContext(ThemeContext);

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

/**
 * PUBLIC_INTERFACE
 * ThemeProvider persists theme preference and syncs data-theme attribute.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rr_theme');
      if (saved) setTheme(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('rr_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => prev === 'light' ? 'dark' : 'light');

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
