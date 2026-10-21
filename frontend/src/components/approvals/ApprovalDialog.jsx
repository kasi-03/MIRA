import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  FileCode,
  AlertTriangle,
  FolderLock
} from 'lucide-react';

export default function ApprovalDialog({
  approval,
  onClose,
  onApprove,
  onReject,
  isDemoMode = false,
}) {
  if (!approval) return null;

  // Simulated countdown timer (180s TTL based on MIRA safety standard)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(165);

  useEffect(() => {
    if (approval.status !== 'pending') return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [approval]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const isExpiring = timeLeftSeconds < 45;
  const isPending = approval.status === 'pending';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--mira-warning-bg)',
                border: '1px solid var(--mira-warning-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--mira-warning)',
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-warning" style={{ fontSize: '11px' }}>
                  Consequential Action
                </span>
                {isDemoMode && (
                  <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                    Simulated Ticket
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--mira-text-primary)', marginTop: '2px' }}>
                Authorization Request
              </h3>
            </div>
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
            aria-label="Close approval dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Countdown Timer (MIRA 180s Safety TTL) */}
        {isPending && (
          <div
            style={{
              backgroundColor: isExpiring ? 'var(--mira-error-bg)' : 'var(--mira-warning-bg)',
              border: `1px solid ${isExpiring ? 'var(--mira-error-border)' : 'var(--mira-warning-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color={isExpiring ? 'var(--mira-error)' : 'var(--mira-warning)'} />
              <span style={{ fontSize: '12.5px', fontWeight: '600', color: isExpiring ? 'var(--mira-error)' : 'var(--mira-warning)' }}>
                {isDemoMode ? 'Simulated TTL Expiry Window' : 'Authorization Window'}
              </span>
            </div>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '15px',
                fontWeight: '700',
                color: isExpiring ? 'var(--mira-error)' : 'var(--mira-warning)',
              }}
            >
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        )}

        {/* Target Action Summary */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--mira-text-muted)', marginBottom: '4px' }}>
            Action Summary
          </div>
          <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--mira-text-primary)', lineHeight: '1.4' }}>
            {approval.action_summary}
          </div>
        </div>

        {/* Rationale */}
        {approval.rationale && (
          <div
            style={{
              backgroundColor: 'var(--mira-surface-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: '13px',
              color: 'var(--mira-text-secondary)',
              lineHeight: '1.45',
              marginBottom: '16px',
            }}
          >
            <strong>Why is approval required?</strong> {approval.rationale}
          </div>
        )}

        {/* Affected Workspace Resources */}
        {approval.affected_resources && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--mira-text-muted)', marginBottom: '6px' }}>
              Affected Workstation Paths (Sandboxed)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {approval.affected_resources.map((res, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    backgroundColor: 'var(--mira-surface)',
                    border: '1px solid var(--mira-surface-secondary)',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--mira-text-primary)',
                  }}
                >
                  <FolderLock size={13} color="var(--mira-bronze)" />
                  <span>{res}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parameters Inspector */}
        {approval.parameters && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--mira-text-muted)', marginBottom: '6px' }}>
              Exact Tool Parameters
            </div>
            <pre
              style={{
                backgroundColor: 'var(--mira-canvas)',
                border: '1px solid var(--mira-surface-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'var(--mira-text-primary)',
                maxHeight: '120px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}
            >
              {JSON.stringify(approval.parameters, null, 2)}
            </pre>
          </div>
        )}

        {/* Approval Decision Controls */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--mira-surface-secondary)' }}>
          {isPending ? (
            <>
              <button
                onClick={() => onReject(approval.approval_id)}
                className="btn btn-secondary"
                style={{ flex: 1, color: 'var(--mira-error)' }}
              >
                <XCircle size={16} />
                <span>Deny Action</span>
              </button>
              <button
                onClick={() => onApprove(approval.approval_id)}
                className="btn btn-primary"
                style={{ flex: 1.6 }}
              >
                <CheckCircle2 size={16} />
                <span>Authorize Execution</span>
              </button>
            </>
          ) : (
            <div style={{ width: '100%', textAlign: 'center', padding: '8px' }}>
              <span className={`badge ${approval.status === 'approved' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
                Action {approval.status.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
