import React from 'react';

/**
 * Error banner for user-friendly error messages.
 *
 * PUBLIC_INTERFACE
 * @component ErrorBanner
 * @param {object} props
 * @param {string} props.message - Display message.
 * @param {function} [props.onRetry] - Optional retry callback.
 */
export default function ErrorBanner({ message, onRetry }) {
  return (
    <div
      role="alert"
      style={{
        padding: '12px 14px',
        borderRadius: 8,
        backgroundColor: 'rgba(239,68,68,0.08)',
        color: '#991B1B',
        border: '1px solid rgba(239,68,68,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
      }}
    >
      <div>⚠️ {message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          aria-label="Retry"
          style={{
            padding: '6px 10px',
            backgroundColor: '#F59E0B',
            color: '#111827',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
