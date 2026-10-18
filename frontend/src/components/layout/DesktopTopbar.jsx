import React from 'react';
import { useApp } from '../../context/AppContext';
import { Monitor, Smartphone, Bell, Plus, Sparkles, User } from 'lucide-react';

export const DesktopTopbar = () => {
  const { 
    viewMode, 
    setViewMode, 
    unreadCount, 
    setActiveTab, 
    setIsComposerOpen,
    setIsProfileOpen,
    settings 
  } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="serif-heading" style={{ fontSize: '1.35rem' }}>
              {getGreeting()}, {settings.userName.split(' ')[0]}
            </h2>
            <span style={{ 
              fontSize: '11px', 
              color: 'var(--color-gold-hover)', 
              fontStyle: 'italic',
              fontWeight: 500,
              backgroundColor: 'var(--color-gold-light)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)'
            }}>
              “Say it once. Let MIRA carry it through.”
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
            Phone 2 Alexa Companion &amp; Windows FastMCP Orchestration Center
          </p>
        </div>
      </div>

      <div className="topbar-right">
        {/* Device Viewport Mode Switcher */}
        <div className="device-view-switcher">
          <button
            type="button"
            className={`device-view-pill ${viewMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setViewMode('desktop')}
            title="Desktop Workstation Dashboard"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            className={`device-view-pill ${viewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setViewMode('mobile')}
            title="Phone 1 Optional Mobile View"
          >
            <Smartphone size={14} />
            <span>Phone 1 (Mobile)</span>
          </button>
        </div>

        {/* Presentation Demo Indicator */}
        <div className="mode-badge-indicator">
          <span className="status-dot online" style={{ width: '6px', height: '6px' }} />
          <span>Interactive Demo Mode</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          className="mira-btn-outline"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: 'var(--radius-sm)', position: 'relative' }}
          onClick={() => setActiveTab('notifications')}
          title="Notifications"
        >
          <Bell size={17} color="var(--color-espresso)" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--color-gold)',
              borderRadius: '50%'
            }} />
          )}
        </button>

        {/* Profile Avatar Button */}
        <button
          type="button"
          className="mira-btn-outline"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: 'var(--radius-sm)' }}
          onClick={() => setIsProfileOpen(true)}
          title="User Authority & Fleet Profile"
        >
          <User size={17} color="var(--color-espresso)" />
        </button>

        {/* New Task Trigger */}
        <button
          type="button"
          className="mira-btn mira-btn-primary mira-btn-sm"
          onClick={() => setIsComposerOpen(true)}
        >
          <Plus size={15} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
