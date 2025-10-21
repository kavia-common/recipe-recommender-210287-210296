import React from 'react';

/**
 * Topbar component for the application.
 * Provides theme toggle and basic branding per Ocean Professional style.
 * 
 * PUBLIC_INTERFACE
 * @component Topbar
 * @param {Object} props
 * @param {function} props.onToggleTheme - Callback to toggle theme.
 * @param {string} props.theme - Current theme name ('light' | 'dark').
 * @returns {JSX.Element}
 */
export default function Topbar({ onToggleTheme, theme }) {
  return (
    <header
      role="banner"
      aria-label="Top navigation bar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'linear-gradient(90deg, rgba(37,99,235,0.08), rgba(249,250,251,1))',
        borderBottom: '1px solid rgba(17,24,39,0.08)',
        backdropFilter: 'saturate(120%) blur(6px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          aria-label="App logo"
          style={{
            width: 32, height: 32, borderRadius: 8, backgroundColor: '#2563EB',
            boxShadow: '0 2px 6px rgba(37,99,235,0.3)'
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            color: '#111827',
            letterSpacing: 0.3
          }}
        >
          Recipe Recommender
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            padding: '8px 12px',
            backgroundColor: '#2563EB',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            transition: 'transform 120ms ease'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
}
