import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { ChevronRight, Cpu, Clock, ShieldAlert } from 'lucide-react';

export default function TaskCard({ task, onSelect }) {
  const isConsequential = task.consequential || task.risk_level === 'high';

  return (
    <div
      onClick={() => onSelect(task)}
      className="card card-interactive"
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '12px',
        backgroundColor: 'var(--mira-surface)',
      }}
    >
      {/* Top Header: Status and Risk */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <StatusBadge status={task.status} />

        {isConsequential && (
          <span
            className="badge badge-warning"
            style={{ fontSize: '11px', gap: '4px' }}
            title="Consequential task requiring authorization before execution"
          >
            <ShieldAlert size={12} />
            <span>High Risk</span>
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px', color: 'var(--mira-text-primary)' }}>
          {task.title}
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--mira-text-secondary)', lineHeight: '1.4', margin: 0 }}>
          {task.description || task.raw_prompt}
        </p>
      </div>

      {/* Progress / Current Stage */}
      {task.current_stage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--mira-bronze-dark)',
            backgroundColor: 'var(--mira-champagne-subtle)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <Cpu size={14} />
          <span style={{ fontWeight: '500' }}>{task.current_stage}</span>
        </div>
      )}

      {/* Footer Info & Details Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--mira-surface-secondary)',
          paddingTop: '8px',
          marginTop: '2px',
        }}
      >
        <span style={{ fontSize: '11.5px', color: 'var(--mira-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} />
          <span>{new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </span>

        <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--mira-bronze)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
          <span>View Details</span>
          <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}
