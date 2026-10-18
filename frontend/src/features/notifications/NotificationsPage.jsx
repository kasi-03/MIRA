import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ShieldAlert, 
  FolderCheck, 
  AlertTriangle, 
  Info, 
  ChevronRight,
  Clock
} from 'lucide-react';

export const NotificationsPage = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearAllNotifications,
    openTaskDetails,
    setActiveApprovalTaskId
  } = useApp();

  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case 'approval': return <ShieldAlert size={18} color="var(--color-warning)" />;
      case 'success': return <FolderCheck size={18} color="var(--color-success)" />;
      case 'error': return <AlertTriangle size={18} color="var(--color-error)" />;
      default: return <Info size={18} color="var(--color-gold-hover)" />;
    }
  };

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.type === 'approval' && notif.task_id) {
      setActiveApprovalTaskId(notif.task_id);
    } else if (notif.task_id) {
      openTaskDetails(notif.task_id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="serif-heading" style={{ fontSize: '1.9rem', marginBottom: '4px' }}>
            System Notification Center
          </h1>
          <p style={{ color: 'var(--color-espresso-secondary)', fontSize: '14px' }}>
            Telemetry stream for approval countdowns, verified output delivery, and workstation alerts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="mira-btn mira-btn-outline mira-btn-sm"
            onClick={markAllNotificationsRead}
          >
            <CheckCheck size={14} />
            <span>Mark All Read</span>
          </button>
          <button
            type="button"
            className="mira-btn mira-btn-outline mira-btn-sm"
            onClick={clearAllNotifications}
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="porcelain-card" style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`mira-btn mira-btn-sm ${filter === 'all' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
            style={{ fontWeight: filter === 'all' ? 700 : 500 }}
            onClick={() => setFilter('all')}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            type="button"
            className={`mira-btn mira-btn-sm ${filter === 'unread' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
            style={{ fontWeight: filter === 'unread' ? 700 : 500 }}
            onClick={() => setFilter('unread')}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredNotifs.length === 0 ? (
          <div className="porcelain-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Bell size={36} color="var(--color-espresso-faint)" style={{ margin: '0 auto 12px' }} />
            <h3 className="serif-heading" style={{ fontSize: '1.25rem', marginBottom: '6px' }}>No Notifications</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-espresso-muted)' }}>
              All alerts and task completion updates have been reviewed.
            </p>
          </div>
        ) : (
          filteredNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className="porcelain-card"
              style={{
                padding: '16px 20px',
                backgroundColor: notif.read ? 'var(--color-surface)' : 'var(--color-gold-subtle)',
                borderLeft: notif.urgent ? '4px solid var(--color-warning)' : notif.type === 'error' ? '4px solid var(--color-error)' : '1px solid var(--color-border)',
                cursor: notif.task_id ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.16s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getNotifIcon(notif.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-espresso)' }}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-gold)' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-espresso-secondary)' }}>
                    {notif.message}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-muted)' }}>
                  {notif.timestamp}
                </span>
                {notif.task_id && (
                  <ChevronRight size={16} color="var(--color-espresso-muted)" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
