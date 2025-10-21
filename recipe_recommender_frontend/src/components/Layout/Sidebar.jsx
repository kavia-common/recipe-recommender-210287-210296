import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Sidebar navigation component.
 *
 * PUBLIC_INTERFACE
 * @component Sidebar
 * @returns {JSX.Element}
 */
export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path) => location.pathname === path;

  const linkStyle = (active) => ({
    display: 'block',
    padding: '10px 12px',
    color: active ? '#2563EB' : '#374151',
    backgroundColor: active ? 'rgba(37,99,235,0.08)' : 'transparent',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: active ? 700 : 500,
    transition: 'background 160ms ease, color 160ms ease'
  });

  return (
    <aside
      aria-label="Sidebar navigation"
      style={{
        minWidth: 220,
        padding: 16,
        borderRight: '1px solid rgba(17,24,39,0.08)',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <nav aria-label="Primary">
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li><Link to="/" style={linkStyle(isActive('/'))}>Home</Link></li>
          <li><Link to="/recipes" style={linkStyle(isActive('/recipes'))}>Recipes</Link></li>
          {user && <li><Link to="/saved" style={linkStyle(isActive('/saved'))}>Saved</Link></li>}
        </ul>
      </nav>
      <div style={{ marginTop: 16, fontSize: 12, color: '#6B7280' }}>
        {user ? (
          <div>Signed in as <strong>{user.name || user.id}</strong> ({user.role})</div>
        ) : (
          <div>Not signed in</div>
        )}
      </div>
    </aside>
  );
}
