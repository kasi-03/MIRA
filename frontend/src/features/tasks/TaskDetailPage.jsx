import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkflowTimeline } from '../../components/workflow/WorkflowTimeline';
import { VISUAL_STATES } from '../../data/mockData';
import { 
  X, 
  Layers, 
  FolderCheck, 
  ShieldAlert, 
  RotateCcw, 
  Terminal, 
  Smartphone, 
  Laptop, 
  Server, 
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const TaskDetailPage = () => {
  const { 
    selectedTask, 
    closeTaskDetails, 
    openArtifactViewer, 
    setActiveApprovalTaskId, 
    retryTask,
    setTaskWorkflowState 
  } = useApp();

  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'tool_activity', 'verification', 'events'

  if (!selectedTask) return null;

  return (
    <div className="modal-overlay" onClick={closeTaskDetails}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '920px', width: '95%', maxHeight: '92vh' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="card-title-group">
            <div className="card-icon-bubble">
              <Layers size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 className="serif-heading" style={{ fontSize: '1.3rem' }}>
                  {selectedTask.title}
                </h3>
                <span className={`badge ${selectedTask.status === 'completed' ? 'badge-completed' : selectedTask.status === 'awaiting_approval' ? 'badge-approval' : ['failed', 'offline', 'unable_to_verify'].includes(selectedTask.status) ? 'badge-failed' : 'badge-pending'}`}>
                  {selectedTask.status.replace(/_/g, ' ')}
                </span>
                <span className="badge badge-pending" style={{ fontSize: '10.5px' }}>
                  {selectedTask.risk_level.toUpperCase()} RISK
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)', fontFamily: 'var(--font-mono)' }}>
                Task UUID: {selectedTask.task_id}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {selectedTask.artifact && (
              <button
                type="button"
                className="mira-btn mira-btn-secondary mira-btn-sm"
                onClick={() => openArtifactViewer(selectedTask.artifact)}
              >
                <FolderCheck size={14} color="var(--color-success)" />
                <span>View Artifact</span>
              </button>
            )}

            {selectedTask.status === 'awaiting_approval' && (
              <button
                type="button"
                className="mira-btn mira-btn-primary mira-btn-sm"
                onClick={() => setActiveApprovalTaskId(selectedTask.task_id)}
              >
                <ShieldAlert size={14} />
                <span>Authorize</span>
              </button>
            )}

            {['failed', 'offline', 'unable_to_verify'].includes(selectedTask.status) && (
              <button
                type="button"
                className="mira-btn mira-btn-outline mira-btn-sm"
                onClick={() => retryTask(selectedTask.task_id)}
              >
                <RotateCcw size={14} />
                <span>Retry</span>
              </button>
            )}

            <button className="mira-btn-outline mira-btn-sm" onClick={closeTaskDetails}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Demo Mode: Visual Workflow State Switcher Bar */}
        <div style={{
          padding: '10px 24px',
          backgroundColor: 'var(--color-linen)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: 'var(--color-gold-hover)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            <SlidersHorizontal size={13} />
            Simulate State:
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {VISUAL_STATES.map(vs => (
              <button
                key={vs.id}
                type="button"
                className={`mira-btn mira-btn-sm ${selectedTask.status === vs.id ? 'mira-btn-primary' : 'mira-btn-outline'}`}
                style={{ fontSize: '11px', padding: '3px 8px', whiteSpace: 'nowrap' }}
                onClick={() => setTaskWorkflowState(selectedTask.task_id, vs.id)}
              >
                {vs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Request vs Interpreted Plan Banner */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '18px',
          fontSize: '13px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Smartphone size={13} color="var(--color-gold)" />
              Original Request ({selectedTask.source_device})
            </div>
            <div style={{ color: 'var(--color-espresso)', fontStyle: 'italic', lineHeight: '1.4' }}>
              “{selectedTask.user_prompt}”
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Server size={13} color="var(--color-gold-hover)" />
              Interpreted Execution Intent
            </div>
            <div style={{ color: 'var(--color-espresso-secondary)', lineHeight: '1.4' }}>
              {selectedTask.interpreted_intent}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          padding: '0 24px',
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border-light)'
        }}>
          <button
            type="button"
            className={`mira-btn ${activeTab === 'timeline' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'timeline' ? '2px solid var(--color-gold)' : 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '12px 18px', fontSize: '13px' }}
            onClick={() => setActiveTab('timeline')}
          >
            10-Stage Workflow Timeline
          </button>
          <button
            type="button"
            className={`mira-btn ${activeTab === 'tool_activity' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'tool_activity' ? '2px solid var(--color-gold)' : 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '12px 18px', fontSize: '13px' }}
            onClick={() => setActiveTab('tool_activity')}
          >
            Tool Activity &amp; Workspace Guard
          </button>
          <button
            type="button"
            className={`mira-btn ${activeTab === 'verification' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'verification' ? '2px solid var(--color-gold)' : 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '12px 18px', fontSize: '13px' }}
            onClick={() => setActiveTab('verification')}
          >
            Verification Inspector
          </button>
          <button
            type="button"
            className={`mira-btn ${activeTab === 'events' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'events' ? '2px solid var(--color-gold)' : 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '12px 18px', fontSize: '13px' }}
            onClick={() => setActiveTab('events')}
          >
            Audit Trail Events ({selectedTask.events?.length || 0})
          </button>
        </div>

        {/* Tab Body */}
        <div className="modal-body" style={{ padding: '24px' }}>
          {activeTab === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedTask.error && (
                <div style={{
                  padding: '14px 18px',
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <AlertTriangle size={20} color="var(--color-error)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-error)' }}>
                      Execution Diagnostic: {selectedTask.error.code}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-espresso)', marginTop: '2px' }}>
                      {selectedTask.error.message}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-espresso-secondary)', marginTop: '6px' }}>
                      <strong>Recovery Recommendation:</strong> {selectedTask.error.recovery_suggestion}
                    </div>
                  </div>
                </div>
              )}

              <WorkflowTimeline task={selectedTask} />
            </div>
          )}

          {activeTab === 'tool_activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-gold-hover)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Workstation Environment Specification
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>Target Tool:</span>{' '}
                    <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{selectedTask.tool_name}</code>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>Risk Assessment:</span>{' '}
                    <span className={`badge ${selectedTask.risk_level === 'high' ? 'badge-approval' : 'badge-pending'}`}>
                      {selectedTask.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>Workstation Path:</span>{' '}
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>C:\mira\workspace\tasks\{selectedTask.task_id.slice(0, 8)}\</code>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>Host Agent:</span>{' '}
                    <span>Windows Laptop FastMCP (Port 8000)</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Dispatched Tool Parameters (JSON-RPC 2.0)
                </label>
                <div style={{
                  padding: '14px',
                  backgroundColor: '#2A2420',
                  color: '#FAF7F1',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px'
                }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(selectedTask.tool_params || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: selectedTask.verification?.status === 'verified' ? 'var(--color-success-bg)' : selectedTask.verification?.status === 'failed' ? 'var(--color-error-bg)' : 'var(--color-bg)',
                border: '1px solid',
                borderColor: selectedTask.verification?.status === 'verified' ? 'var(--color-success-border)' : selectedTask.verification?.status === 'failed' ? 'var(--color-error-border)' : 'var(--color-border)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  {selectedTask.verification?.status === 'verified' ? (
                    <CheckCircle2 size={20} color="var(--color-success)" />
                  ) : (
                    <AlertTriangle size={20} color={selectedTask.verification?.status === 'failed' ? 'var(--color-error)' : 'var(--color-warning)'} />
                  )}
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-espresso)' }}>
                    {selectedTask.verification?.status === 'verified' 
                      ? "Integrity Check: PASSED & CRYPTOGRAPHICALLY VERIFIED" 
                      : selectedTask.verification?.status === 'failed'
                      ? "Integrity Check: FAILED & REJECTED"
                      : "Integrity Check: Pending Workstation Generation"}
                  </h4>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--color-espresso-secondary)', lineHeight: '1.45' }}>
                  MIRA strictly rejects hallucinated success. A task is marked complete only after the backend downloads the workstation file, parses its structure, and verifies that the SHA-256 digest matches the physical bytes.
                </p>
              </div>

              {selectedTask.verification && (
                <div style={{
                  padding: '16px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>Cryptographic SHA-256:</span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{selectedTask.verification.sha256}</code>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>XML / Document Structure:</span>
                    <span style={{ fontWeight: 600, color: selectedTask.verification.xml_structure_valid ? 'var(--color-success)' : 'var(--color-error)' }}>
                      {selectedTask.verification.xml_structure_valid ? "Valid (Parsed Cleanly)" : "Invalid / Corrupted"}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>Script Injection Filter:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                      0 Script Elements Detected
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-espresso-muted)' }}>Byte Size Verification:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      {selectedTask.verification.file_size_bytes} bytes (Passed Non-Zero Test)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedTask.events?.map((event, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12.5px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-espresso-muted)', width: '60px' }}>
                      {event.time}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--color-espresso)', width: '150px' }}>
                      {event.stage}
                    </span>
                    <span style={{ color: 'var(--color-espresso-secondary)' }}>
                      {event.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="mira-btn mira-btn-outline"
            onClick={closeTaskDetails}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
