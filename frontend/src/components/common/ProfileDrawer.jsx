import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, ShieldCheck, Smartphone, Laptop, Settings, RotateCcw } from 'lucide-react';

export const ProfileDrawer = () => {
  const { isProfileOpen, setIsProfileOpen, settings, setActiveTab, resetDemoData, devices } = useApp();

  if (!isProfileOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsProfileOpen(false)}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          position: 'fixed', 
          top: 0, 
          right: 0, 
          bottom: 0, 
          width: '380px', 
          maxWidth: '100%', 
          borderRadius: '0', 
          height: '100vh',
          animation: 'slide-in-right 0.25s ease'
        }}
      >
        <div className="modal-header">
          <div className="card-title-group">
            <div className="card-icon-bubble">
              <User size={18} />
            </div>
            <div>
              <h3 className="serif-heading" style={{ fontSize: '1.2rem' }}>
                {settings.userName}
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--color-espresso-muted)', fontFamily: 'var(--font-mono)' }}>
                {settings.userId}
              </p>
            </div>
          </div>

          <button className="mira-btn-outline mira-btn-sm" onClick={() => setIsProfileOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Identity & Role */}
          <div style={{
            padding: '14px',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12.5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-espresso-muted)' }}>Authority Level:</span>
              <span style={{ fontWeight: 600, color: 'var(--color-gold-hover)' }}>Owner (Full Permissions)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-espresso-muted)' }}>Primary Client:</span>
              <span>Phone 2 (Alexa Companion)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-espresso-muted)' }}>Workstation Host:</span>
              <span>Windows 11 Laptop</span>
            </div>
          </div>

          {/* Connected Fleet Summary */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Linked Fleet Nodes ({devices.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {devices.map(d => (
                <div key={d.device_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border-light)', backgroundColor: 'var(--color-surface)', fontSize: '12px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--color-espresso)' }}>{d.name}</span>
                  <span className={`badge ${d.status === 'online' ? 'badge-completed' : 'badge-failed'}`} style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            <button
              type="button"
              className="mira-btn mira-btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start' }}
              onClick={() => {
                setActiveTab('settings');
                setIsProfileOpen(false);
              }}
            >
              <Settings size={15} />
              <span>System Settings</span>
            </button>
            <button
              type="button"
              className="mira-btn mira-btn-outline"
              style={{ width: '100%', justifyContent: 'flex-start' }}
              onClick={() => {
                resetDemoData();
                setIsProfileOpen(false);
              }}
            >
              <RotateCcw size={15} />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
