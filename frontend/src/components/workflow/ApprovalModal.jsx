import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Check, X, Clock, Terminal, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ApprovalModal = () => {
  const { activeApprovalTask, approveTask, rejectTask, setActiveApprovalTaskId } = useApp();
  const [secondsRemaining, setSecondsRemaining] = useState(180);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (!activeApprovalTask?.approval_ticket) return;

    const expiresAt = new Date(activeApprovalTask.approval_ticket.expires_at).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setSecondsRemaining(diff);

      if (diff <= 0) {
        rejectTask(activeApprovalTask.task_id, "Approval ticket expired (180s TTL elapsed)");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeApprovalTask]);

  if (!activeApprovalTask) return null;

  const ticket = activeApprovalTask.approval_ticket || {
    action_summary: "High-impact tool execution",
    justification: "Operation alters local filesystem or processes.",
    ttl_seconds: 180,
    requested_by: "Alex Sterling"
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timerFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="modal-overlay" onClick={() => setActiveApprovalTaskId(null)}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Urgent Header */}
        <div className="modal-header" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
          <div className="card-title-group">
            <div className="card-icon-bubble" style={{ backgroundColor: '#FFFFFF', color: 'var(--color-warning)' }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="serif-heading" style={{ fontSize: '1.25rem', color: 'var(--color-espresso)' }}>
                Approval Shield Activated
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--color-warning)', fontWeight: 600 }}>
                High-Risk Workstation Action Gated by Mobile Authorization Policy
              </p>
            </div>
          </div>
          <button className="mira-btn-outline mira-btn-sm" onClick={() => setActiveApprovalTaskId(null)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Live Countdown Chip */}
          <div className="countdown-shield-bar">
            <Clock size={18} />
            <div style={{ flex: 1, fontSize: '13px' }}>
              Authorization Window Active:
            </div>
            <div className="countdown-timer-chip">
              {timerFormatted}
            </div>
          </div>

          {/* Action Summary Card */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Requested Consequential Action
            </div>
            <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '8px' }}>
              {ticket.action_summary}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--color-espresso-secondary)', lineHeight: '1.5' }}>
              <strong>Safety Rationale:</strong> {ticket.justification}
            </div>
          </div>

          {/* Tool Parameters Box */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: '#2A2420',
            color: '#FAF7F1',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px'
          }}>
            <div style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase' }}>
              <Terminal size={13} />
              Tool Invocation Signature
            </div>
            <div>tool: {activeApprovalTask.tool_name}</div>
            <div>target: Windows 11 Workstation (C:\mira\workspace\)</div>
            {activeApprovalTask.tool_params && (
              <pre style={{ margin: '6px 0 0', color: '#D0DFE8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(activeApprovalTask.tool_params, null, 2)}
              </pre>
            )}
          </div>

          {/* Reject Input Expansion */}
          {showRejectForm && (
            <div style={{ animation: 'modal-enter 0.2s ease' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                Reason for Rejection (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Unauthorized script parameters or unverified migration"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)'
                }}
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!showRejectForm ? (
            <>
              <button
                type="button"
                className="mira-btn mira-btn-outline"
                onClick={() => setShowRejectForm(true)}
              >
                Reject Action
              </button>
              <button
                type="button"
                className="mira-btn mira-btn-success"
                onClick={() => approveTask(activeApprovalTask.task_id)}
              >
                <ShieldCheck size={16} />
                Authorize &amp; Execute ({timerFormatted})
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="mira-btn mira-btn-outline"
                onClick={() => setShowRejectForm(false)}
              >
                Back
              </button>
              <button
                type="button"
                className="mira-btn mira-btn-danger"
                onClick={() => rejectTask(activeApprovalTask.task_id, rejectReason || "User rejected execution")}
              >
                <X size={16} />
                Confirm Rejection
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
