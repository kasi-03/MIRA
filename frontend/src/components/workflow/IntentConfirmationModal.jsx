import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, ArrowRight, X, Shield, Laptop, Smartphone } from 'lucide-react';

export const IntentConfirmationModal = () => {
  const { activeConfirmationTask, confirmTask, setActiveConfirmationTaskId, rejectTask } = useApp();

  if (!activeConfirmationTask) return null;

  return (
    <div className="modal-overlay" onClick={() => setActiveConfirmationTaskId(null)}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header" style={{ backgroundColor: 'var(--color-gold-light)' }}>
          <div className="card-title-group">
            <div className="card-icon-bubble" style={{ backgroundColor: '#FFFFFF' }}>
              <CheckCircle2 size={18} color="var(--color-gold)" />
            </div>
            <div>
              <h3 className="serif-heading" style={{ fontSize: '1.2rem' }}>Confirm Task Intent</h3>
              <p style={{ fontSize: '11.5px', color: 'var(--color-espresso-secondary)' }}>
                Step 2: Verify parsed instructions before workstation dispatch
              </p>
            </div>
          </div>
          <button className="mira-btn-outline mira-btn-sm" onClick={() => setActiveConfirmationTaskId(null)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* User Request Bubble */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--color-gold-hover)', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Smartphone size={13} />
              Original Voice / Text Request (Phone 2)
            </div>
            <div style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--color-espresso)', lineHeight: '1.45' }}>
              “{activeConfirmationTask.user_prompt}”
            </div>
          </div>

          {/* Workflow Transition Diagram */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>Phone 2</div>
              <div style={{ color: 'var(--color-espresso-muted)', fontSize: '10.5px' }}>Alexa Input</div>
            </div>
            <ArrowRight size={16} color="var(--color-gold)" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-gold-hover)' }}>MIRA Backend</div>
              <div style={{ color: 'var(--color-espresso-muted)', fontSize: '10.5px' }}>Policy & Gating</div>
            </div>
            <ArrowRight size={16} color="var(--color-gold)" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>Windows Laptop</div>
              <div style={{ color: 'var(--color-espresso-muted)', fontSize: '10.5px' }}>FastMCP Engine</div>
            </div>
          </div>

          {/* Interpreted Action Breakdown */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Interpreted Execution Plan
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Target Tool:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-espresso)', backgroundColor: 'var(--color-linen)', padding: '2px 8px', borderRadius: '4px' }}>
                  {activeConfirmationTask.tool_name}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Target Host:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500, color: 'var(--color-espresso)' }}>
                  <Laptop size={14} color="var(--color-espresso-muted)" />
                  Windows 11 Workstation (FastMCP 127.0.0.1:8000)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Workspace Confinement:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-success)' }}>
                  C:\mira\workspace\ (Sandboxed)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Risk Tier:</span>
                <span className={`badge ${activeConfirmationTask.risk_level === 'high' ? 'badge-approval' : 'badge-pending'}`}>
                  {activeConfirmationTask.risk_level === 'high' ? 'High Risk (Approval Shield Required)' : 'Low Risk (Safe Auto-pass)'}
                </span>
              </div>
            </div>
          </div>

          {activeConfirmationTask.risk_level === 'high' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: 'var(--color-warning-bg)',
              border: '1px solid var(--color-warning-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              color: 'var(--color-warning)'
            }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>
                <strong>Notice:</strong> This action executes a workstation script. Following confirmation, the 180s Approval Shield will activate on your mobile screen.
              </span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="mira-btn mira-btn-outline"
            onClick={() => rejectTask(activeConfirmationTask.task_id, "User cancelled during intent review")}
          >
            Cancel Task
          </button>
          <button
            type="button"
            className="mira-btn mira-btn-primary"
            onClick={() => confirmTask(activeConfirmationTask.task_id)}
          >
            <CheckCircle2 size={16} />
            Confirm &amp; Proceed
          </button>
        </div>
      </div>
    </div>
  );
};
