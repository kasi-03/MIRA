import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { X, CheckCircle2, Clock, AlertTriangle, Cpu, ShieldCheck, Download, ArrowRight } from 'lucide-react';

export default function TaskTimeline({ task, onClose, onNavigateApprovals, onNavigateArtifacts }) {
  if (!task) return null;

  // The 9 Canonical MIRA Lifecycle Stages
  const stages = [
    { key: 'pending_confirmation', label: '1. Ingest & Interpret' },
    { key: 'confirmed', label: '2. User Plan Confirmed' },
    { key: 'validating', label: '3. Policy & Risk Gating' },
    { key: 'awaiting_approval', label: '4. Consequential Approval' },
    { key: 'approved', label: '5. Authorization Granted' },
    { key: 'executing', label: '6. Windows FastMCP Execution' },
    { key: 'verifying', label: '7. SHA-256 & Structure Probe' },
    { key: 'completed', label: '8. Artifact Delivered' },
  ];

  const getStageStatus = (stageKey) => {
    const current = task.status;
    const stageOrder = [
      'pending_confirmation',
      'confirmed',
      'validating',
      'awaiting_approval',
      'approved',
      'executing',
      'verifying',
      'completed'
    ];

    const currentIndex = stageOrder.indexOf(current);
    const stageIndex = stageOrder.indexOf(stageKey);

    if (current === 'failed' || current === 'rejected') {
      if (stageKey === 'awaiting_approval' && current === 'rejected') return 'error';
      return 'pending';
    }

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <StatusBadge status={task.status} />
              <span style={{ fontSize: '12px', color: 'var(--mira-text-muted)' }}>
                {task.task_id.slice(0, 8)}...
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--mira-text-primary)' }}>
              {task.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{
              border: 'none',
              background: 'none',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--mira-text-secondary)',
            }}
            aria-label="Close task details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Original Prompt Card */}
        <div
          style={{
            backgroundColor: 'var(--mira-surface-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '18px',
          }}
        >
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--mira-text-muted)', marginBottom: '4px' }}>
            Original Prompt
          </div>
          <div style={{ fontSize: '13.5px', color: 'var(--mira-text-primary)', fontStyle: 'italic', lineHeight: '1.4' }}>
            "{task.raw_prompt}"
          </div>
        </div>

        {/* 8-Stage Progress Stepper */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mira-text-muted)', marginBottom: '12px' }}>
            Lifecycle Progression
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stages.map((stg) => {
              const status = getStageStatus(stg.key);
              let icon = <Clock size={14} color="var(--mira-text-muted)" />;
              let textColor = 'var(--mira-text-muted)';
              let dotBg = 'var(--mira-surface-secondary)';

              if (status === 'completed') {
                icon = <CheckCircle2 size={14} color="var(--mira-success)" />;
                textColor = 'var(--mira-text-primary)';
                dotBg = 'var(--mira-success-bg)';
              } else if (status === 'current') {
                icon = <Cpu size={14} color="var(--mira-bronze)" />;
                textColor = 'var(--mira-bronze-dark)';
                dotBg = 'var(--mira-champagne-soft)';
              } else if (status === 'error') {
                icon = <AlertTriangle size={14} color="var(--mira-error)" />;
                textColor = 'var(--mira-error)';
                dotBg = 'var(--mira-error-bg)';
              }

              return (
                <div
                  key={stg.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: status === 'current' ? 'var(--mira-champagne-subtle)' : 'transparent',
                    border: status === 'current' ? '1px solid var(--mira-champagne)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: dotBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: status === 'current' ? '700' : '500', color: textColor }}>
                    {stg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tool Call Log */}
        {task.tool_calls && task.tool_calls.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mira-text-muted)', marginBottom: '8px' }}>
              Workstation Tool Invocations
            </div>
            {task.tool_calls.map((call, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--mira-surface-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: 'var(--mira-text-primary)',
                  marginBottom: '6px',
                }}
              >
                <div style={{ fontWeight: '700', color: 'var(--mira-bronze-dark)' }}>
                  {call.tool_name} ({call.status})
                </div>
                <div style={{ color: 'var(--mira-text-secondary)', marginTop: '4px', overflowX: 'auto' }}>
                  {JSON.stringify(call.arguments, null, 2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Contextual Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--mira-surface-secondary)' }}>
          {task.status === 'awaiting_approval' && onNavigateApprovals && (
            <button
              onClick={() => {
                onClose();
                onNavigateApprovals();
              }}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <ShieldCheck size={16} />
              <span>Review Approval Ticket</span>
            </button>
          )}

          {task.status === 'completed' && onNavigateArtifacts && (
            <button
              onClick={() => {
                onClose();
                onNavigateArtifacts();
              }}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <Download size={16} />
              <span>View Verified Deliverable</span>
            </button>
          )}

          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
