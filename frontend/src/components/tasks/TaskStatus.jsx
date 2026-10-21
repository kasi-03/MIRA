import React from 'react';
import StatusBadge from '../common/StatusBadge';

/**
 * TaskStatus — standalone status badge wrapper with stage description.
 */
export default function TaskStatus({ status, stage, size = 'md' }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
      <StatusBadge status={status} size={size} />
      {stage && (
        <span style={{ fontSize: '11px', color: 'var(--mira-text-muted)', paddingLeft: '2px' }}>
          {stage}
        </span>
      )}
    </div>
  );
}
