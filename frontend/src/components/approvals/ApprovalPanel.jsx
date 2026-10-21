import React from 'react';
import { useApp } from '../../context/AppContext';
import ApprovalDialog from './ApprovalDialog';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import { ShieldAlert, Clock, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

export default function ApprovalPanel() {
  const {
    approvals,
    selectedApproval,
    setSelectedApproval,
    handleApprove,
    handleReject,
    setActiveTab,
    isDemoMode,
  } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Intro Note */}
      <div
        style={{
          padding: '12px 14px',
          backgroundColor: 'var(--mira-surface)',
          border: '1px solid var(--mira-surface-secondary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          color: 'var(--mira-text-secondary)',
          lineHeight: '1.45',
        }}
      >
        <strong>MIRA Safety Governance:</strong> Tasks that alter workstation files, invoke scripts, or access sensitive tools are held in a pending state until authorized by you on Alexa Companion.
      </div>

      {approvals.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title={isDemoMode ? "No approvals pending" : "No live approvals pending"}
          description={
            isDemoMode
              ? "All simulated requests have been processed. You can trigger a new consequential request from the Assistant tab."
              : "When a consequential action is requested by a workstation tool, a time-limited authorization request will appear here for your review."
          }
          actionLabel="Go to Assistant"
          onAction={() => setActiveTab('assistant')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {approvals.map((approval) => {
            const isPending = approval.status === 'pending';

            return (
              <div
                key={approval.approval_id}
                className="card card-interactive"
                onClick={() => setSelectedApproval(approval)}
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: isPending ? '4px solid var(--mira-warning)' : '1px solid var(--mira-surface-secondary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={16} color="var(--mira-warning)" />
                    <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--mira-warning)' }}>
                      Risk Level: {approval.risk_level}
                    </span>
                  </div>
                  <StatusBadge status={approval.status} size="sm" />
                </div>

                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--mira-text-primary)', marginBottom: '4px' }}>
                    {approval.task_title || approval.action_summary}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--mira-text-secondary)', lineHeight: '1.4', margin: 0 }}>
                    {approval.action_summary}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--mira-surface-secondary)',
                    paddingTop: '10px',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ color: 'var(--mira-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    <span>Tool: <code>{approval.target_tool}</code></span>
                  </span>

                  <span style={{ fontWeight: '600', color: 'var(--mira-bronze)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <span>Inspect Ticket</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Approval Dialog Modal */}
      {selectedApproval && (
        <ApprovalDialog
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isDemoMode={isDemoMode}
        />
      )}
    </div>
  );
}
