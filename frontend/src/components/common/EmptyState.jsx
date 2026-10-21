import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No items available',
  description = 'There is currently no data to display.',
  actionLabel,
  onAction,
}) {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: '36px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--mira-surface)',
        borderColor: 'var(--mira-surface-secondary)',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          backgroundColor: 'var(--mira-champagne-subtle)',
          border: '1px solid var(--mira-champagne-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: 'var(--mira-bronze)',
        }}
      >
        <Icon size={26} />
      </div>

      <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>
        {title}
      </h3>

      <p style={{ fontSize: '13.5px', maxWidth: '340px', lineHeight: '1.45', marginBottom: actionLabel ? '20px' : '0' }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-secondary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
