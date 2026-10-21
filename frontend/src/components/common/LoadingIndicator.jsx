import React from 'react';

export default function LoadingIndicator({ label = 'Processing...', size = 'md' }) {
  const dimension = size === 'sm' ? 18 : size === 'lg' ? 36 : 24;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '8px',
        color: 'var(--mira-bronze)',
      }}
    >
      <div
        style={{
          width: `${dimension}px`,
          height: `${dimension}px`,
          borderRadius: '50%',
          border: '2.5px solid var(--mira-champagne-soft)',
          borderTopColor: 'var(--mira-bronze)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {label && (
        <span style={{ fontSize: size === 'sm' ? '12px' : '14px', color: 'var(--mira-text-secondary)', fontWeight: '500' }}>
          {label}
        </span>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
