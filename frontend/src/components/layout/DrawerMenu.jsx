import React from 'react';
import { useApp, ROLE_INFO, ROLES } from '../../context/AppContext';
import {
  X,
  Smartphone,
  Laptop,
  Bell,
  Activity,
  FlaskConical,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function DrawerMenu() {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    activeRole,
    openSecondaryView,
    laptopConnection,
    unreadNotificationsCount,
    isDemoMode,
    toggleDemoMode,
  } = useApp();

  if (!isDrawerOpen) return null;

  const roleMeta = ROLE_INFO[activeRole] || ROLE_INFO[ROLES.ALEXA_COMPANION];
  const isLaptopConnected = laptopConnection.status === 'connected' || laptopConnection.status === 'simulated_connected';

  return (
    <div
      className="modal-backdrop"
      style={{
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        padding: 0,
        zIndex: 1000,
      }}
      onClick={() => setIsDrawerOpen(false)}
    >
      <div
        className="modal-content"
        style={{
          width: '85%',
          maxWidth: '340px',
          height: '100%',
          maxHeight: '100vh',
          borderRadius: 0,
          borderTopRightRadius: 'var(--radius-xl)',
          borderBottomRightRadius: 'var(--radius-xl)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--mira-surface)',
          animation: 'slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              className="brand-wordmark"
              style={{
                fontSize: '22px',
                letterSpacing: '0.14em',
              }}
            >
              MIRA
            </span>
            <span
              style={{
                fontSize: '10.5px',
                color: 'var(--mira-bronze)',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginTop: '3px',
              }}
            >
              Companion Hub
            </span>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="btn-ghost"
            style={{
              border: 'none',
              background: 'none',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--mira-text-secondary)',
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Role Card in Drawer */}
        <div
          onClick={() => openSecondaryView('role_select')}
          style={{
            backgroundColor: 'var(--mira-champagne-subtle)',
            border: '1px solid var(--mira-champagne)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--mira-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--mira-bronze)',
            }}>
              <Smartphone size={18} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--mira-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                Operating Mode
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--mira-text-primary)' }}>
                {roleMeta.label}
              </div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--mira-text-secondary)" />
        </div>

        {/* Menu Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          <button
            onClick={() => openSecondaryView('devices')}
            className="btn-ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              width: '100%',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Laptop size={18} color="var(--mira-bronze)" />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Device Management</span>
            </div>
            <span style={{ fontSize: '11px', color: isLaptopConnected ? 'var(--mira-success)' : 'var(--mira-text-muted)' }}>
              {isLaptopConnected ? 'Online' : 'Not Paired'}
            </span>
          </button>

          <button
            onClick={() => openSecondaryView('notifications')}
            className="btn-ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              width: '100%',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={18} color="var(--mira-bronze)" />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Notifications</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => openSecondaryView('diagnostics')}
            className="btn-ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              width: '100%',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={18} color="var(--mira-bronze)" />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>System Diagnostics</span>
            </div>
          </button>

          <hr style={{ border: 'none', borderTop: '1px solid var(--mira-surface-secondary)', margin: '12px 0' }} />

          {/* Development Demo Mode Switch */}
          <div
            style={{
              backgroundColor: 'var(--mira-surface-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FlaskConical size={16} color="var(--mira-warning)" />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>Demo Mode</span>
              </div>
              <input
                type="checkbox"
                id="drawer-demo-toggle"
                checked={isDemoMode}
                onChange={toggleDemoMode}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--mira-bronze)' }}
              />
            </div>
            <p style={{ fontSize: '11px', lineHeight: '1.35', color: 'var(--mira-text-secondary)' }}>
              Enables isolated fixtures to simulate tasks, approvals, and verified artifacts locally without a running backend.
            </p>
          </div>
        </div>

        {/* Drawer Footer with Core Principle */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--mira-surface-secondary)' }}>
          <div style={{
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'var(--mira-bronze-dark)',
            marginBottom: '8px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            “Say it once. Let MIRA carry it through.”
          </div>
          <div style={{ fontSize: '11px', textAlign: 'center', color: 'var(--mira-text-muted)' }}>
            MIRA Companion v1.0.0 • Stage 1 Frontend
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
