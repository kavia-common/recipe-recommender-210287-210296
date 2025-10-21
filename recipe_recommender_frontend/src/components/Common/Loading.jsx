import React from 'react';

/**
 * Loading spinner with accessible label.
 *
 * PUBLIC_INTERFACE
 * @component Loading
 * @param {object} props
 * @param {string} [props.label='Loading'] - Accessible label text.
 */
export default function Loading({ label = 'Loading' }) {
  return (
    <div role="status" aria-live="polite" style={{ padding: 16, color: '#2563EB' }}>
      <span className="sr-only">{label}</span>
      ⏳ {label}...
    </div>
  );
}
