import React from 'react';
import { useApp, ROLE_INFO, ROLES } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Laptop,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Smartphone
} from 'lucide-react';

export default function Header() {
  const {
    activeRole,
    activeTab,
    setIsDrawerOpen,
    openSecondaryView,
    laptopConnection,
    unreadNotificationsCount,
    pendingApprovalsCount,
    isDemoMode,
  } = useApp();

  const roleMeta = ROLE_INFO[activeRole] || ROLE_INFO[ROLES.ALEXA_COMPANION];

  const sectionTitles = {
    assistant: 'Assistant',
    tasks: 'Tasks',
    approvals: 'Safety Approvals',
    artifacts: 'Activity & Artifacts',
    settings: 'Settings',
  };

  const isLaptopConnected = laptopConnection.status === 'connected' || laptopConnection.status === 'simulated_connected';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--mira-surface)',
        borderBottom: '1px solid var(--mira-surface-secondary)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Brand & Context Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="btn-ghost"
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--mira-text-primary)',
          }}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="brand-wordmark"
              style={{
                fontSize: '18px',
                letterSpacing: '0.12em',
              }}
            >
              MIRA
            </span>

            {/* Role Chip - Tappable to open role selector */}
            <button
              onClick={() => openSecondaryView('role_select')}
              style={{
                border: 'none',
                background: 'var(--mira-champagne-subtle)',
                color: 'var(--mira-bronze-dark)',
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                fontSize: '10.5px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
              title="Click to change operating mode"
            >
              <Smartphone size={10} />
              <span>{roleMeta.label}</span>
            </button>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--mira-text-secondary)', fontWeight: '500' }}>
            {sectionTitles[activeTab] || 'Companion'}
          </div>
        </div>
      </div>

      {/* Status Badges & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Demo Mode Badge */}
        {isDemoMode && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: '600',
              backgroundColor: 'var(--mira-warning-bg)',
              color: 'var(--mira-warning)',
              border: '1px solid var(--mira-warning-border)',
            }}
            title="Development Demo Mode active with isolated simulation data"
          >
            <FlaskConical size={12} />
            <span>Demo</span>
          </span>
        )}

        {/* Laptop Connection Chip */}
        <button
          onClick={() => openSecondaryView('devices')}
          style={{
            border: 'none',
            background: isLaptopConnected ? 'var(--mira-success-bg)' : 'var(--mira-surface-secondary)',
            color: isLaptopConnected ? 'var(--mira-success)' : 'var(--mira-text-secondary)',
            padding: '4px 9px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
          title={isLaptopConnected ? 'Windows laptop connected via FastMCP' : 'Windows laptop not connected — click for pairing instructions'}
        >
          <Laptop size={12} />
          <span>{isLaptopConnected ? 'Laptop Online' : 'Not Connected'}</span>
          {isLaptopConnected ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={() => openSecondaryView('notifications')}
          className="btn-ghost"
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-full)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--mira-text-primary)',
          }}
          aria-label="View notifications"
        >
          <Bell size={20} />
          {unreadNotificationsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--mira-warning)',
                borderRadius: '50%',
              }}
            />
          )}
        </button>
      </div>
    </header>
  );
}
