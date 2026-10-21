import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

const SEVERITY_STYLES = {
  error: {
    bg: 'var(--mira-error-bg, rgba(220, 38, 38, 0.1))',
    border: 'var(--mira-error-border, rgba(220, 38, 38, 0.3))',
    color: 'var(--mira-error, #dc2626)',
  },
  warning: {
    bg: 'var(--mira-warning-bg, rgba(217, 119, 6, 0.1))',
    border: 'var(--mira-warning-border, rgba(217, 119, 6, 0.3))',
    color: 'var(--mira-warning, #d97706)',
  },
  info: {
    bg: 'var(--mira-champagne-subtle, rgba(212, 175, 55, 0.1))',
    border: 'var(--mira-champagne-soft, rgba(212, 175, 55, 0.3))',
    color: 'var(--mira-bronze-dark, #78350f)',
  },
  success: {
    bg: 'var(--mira-surface, #ffffff)',
    border: 'var(--mira-champagne-soft, #d4af37)',
    color: 'var(--mira-bronze, #92400e)',
  },
};

export default function ErrorMessage({
  title = 'An error occurred',
  message,
  onRetry,
  onDismiss,
  severity = 'error', // 'error' | 'warning' | 'info' | 'success'
}) {
  if (!message) return null;

  const styles = SEVERITY_STYLES[severity] || SEVERITY_STYLES.error;

  return (
    <div
      style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        marginBottom: '16px',
        position: 'relative',
      }}
    >
      <AlertCircle size={20} color={styles.color} style={{ flexShrink: 0, marginTop: '2px' }} />

      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: styles.color, marginBottom: '3px' }}>
            {title}
          </h4>
        )}
        <p style={{ fontSize: '13px', color: 'var(--mira-text-primary)', lineHeight: '1.4' }}>
          {message}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '8px', padding: '4px 10px', minHeight: '30px', fontSize: '12px' }}
          >
            <RefreshCw size={13} />
            <span>Retry</span>
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="btn-ghost"
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: 'var(--mira-text-secondary)',
          }}
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
