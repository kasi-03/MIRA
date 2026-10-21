import React from 'react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/common/EmptyState';
import { Bell, ArrowLeft, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export default function NotificationsView({ onBack }) {
  const { notifications, setActiveTab, openSecondaryView } = useApp();

  const handleNotificationClick = (item) => {
    if (item.target_tab) {
      setActiveTab(item.target_tab);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px 0' }}>
      {onBack && (
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm"
          style={{ alignSelf: 'flex-start', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="Updates regarding pending safety approvals, completed deliverables, and workstation status changes will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((n) => {
            const isApproval = n.type === 'approval_required';
            const Icon = isApproval ? ShieldAlert : CheckCircle2;

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className="card card-interactive"
                style={{
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  borderLeft: !n.read ? '3px solid var(--mira-warning)' : '1px solid var(--mira-surface-secondary)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isApproval ? 'var(--mira-warning-bg)' : 'var(--mira-success-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isApproval ? 'var(--mira-warning)' : 'var(--mira-success)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Icon size={16} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--mira-text-primary)' }}>
                      {n.title}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--mira-text-muted)' }}>
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--mira-text-secondary)', lineHeight: '1.4', margin: 0 }}>
                    {n.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
