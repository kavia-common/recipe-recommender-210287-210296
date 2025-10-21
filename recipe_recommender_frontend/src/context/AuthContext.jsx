import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useAuth hook to access auth context
 * @returns {{user: {id: string, role: 'viewer'|'editor'|'admin', name?: string}|null, token: string|null, login: Function, logout: Function}}
 */
export const useAuth = () => useContext(AuthContext);

const AuthContext = createContext({
  user: null,
  token: null,
  // eslint-disable-next-line no-unused-vars
  login: (user, token) => {},
  logout: () => {},
});

/**
 * PUBLIC_INTERFACE
 * AuthProvider manages a minimal auth state with role awareness.
 * Token stored in memory only; persisted user preference non-sensitive.
 * For real-world use, integrate with secure cookies/SSO.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load from sessionStorage (non-sensitive demo only)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('rr_auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (u, t) => {
    setUser(u);
    setToken(t || null);
    try {
      sessionStorage.setItem('rr_auth', JSON.stringify({ user: u, token: t || null }));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      sessionStorage.removeItem('rr_auth');
    } catch {
      // ignore
    }
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
