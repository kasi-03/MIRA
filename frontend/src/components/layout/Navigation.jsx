import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  ListTodo,
  ShieldAlert,
  Layers,
  Settings
} from 'lucide-react';

export default function Navigation() {
  const { activeTab, setActiveTab, pendingApprovalsCount } = useApp();

  const navItems = [
    {
      id: 'assistant',
      label: 'Assistant',
      icon: MessageSquare,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: ListTodo,
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: ShieldAlert,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
    },
    {
      id: 'artifacts',
      label: 'Activity',
      icon: Layers,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'var(--mira-surface)',
        borderTop: '1px solid var(--mira-surface-secondary)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 10px rgba(38, 37, 33, 0.05)',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '62px',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--mira-bronze)' : 'var(--mira-text-secondary)',
                position: 'relative',
                transition: 'color var(--transition-fast)',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Tab Accent Bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '32px',
                    height: '3px',
                    borderRadius: '0 0 3px 3px',
                    backgroundColor: 'var(--mira-bronze)',
                  }}
                />
              )}

              <div style={{ position: 'relative' }}>
                <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />

                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      backgroundColor: 'var(--mira-warning)',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: '700',
                      minWidth: '15px',
                      height: '15px',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 3px',
                      lineHeight: 1,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? '600' : '500',
                  letterSpacing: '0.01em',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
