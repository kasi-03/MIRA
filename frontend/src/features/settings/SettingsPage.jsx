import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  User, 
  Bell, 
  ShieldCheck, 
  Sliders, 
  HardDrive, 
  RotateCcw, 
  Laptop, 
  Lock, 
  EyeOff,
  Check,
  Smartphone
} from 'lucide-react';

export const SettingsPage = () => {
  const { settings, setSettings, resetDemoData, toggleLaptopStatus, devices } = useApp();
  const laptop = devices.find(d => d.role === 'windows_workstation');

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      {/* Header */}
      <div>
        <h1 className="serif-heading" style={{ fontSize: '1.9rem', marginBottom: '4px' }}>
          System Configuration &amp; Governance
        </h1>
        <p style={{ color: 'var(--color-espresso-secondary)', fontSize: '14px' }}>
          Configure user identity, safety policy thresholds, and workstation sandboxing rules.
        </p>
      </div>

      {/* User Identity Section */}
      <div className="porcelain-card">
        <div className="card-header-bar">
          <div className="card-title-group">
            <div className="card-icon-bubble">
              <User size={18} />
            </div>
            <div>
              <h3 className="serif-heading" style={{ fontSize: '1.25rem' }}>
                User Identity &amp; Device Authority
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                Governed by JSON Schema user_id separation rules
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
              Authorized Name
            </label>
            <input
              type="text"
              value={settings.userName}
              onChange={e => handleChange('userName', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
              System User UUID
            </label>
            <input
              type="text"
              disabled
              value={settings.userId}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-linen)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-espresso-muted)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Security & Policy Thresholds */}
      <div className="porcelain-card highlight">
        <div className="card-header-bar">
          <div className="card-title-group">
            <div className="card-icon-bubble">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="serif-heading" style={{ fontSize: '1.25rem' }}>
                Approval Shield &amp; Risk Policies
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                Guarding Windows 11 host against unauthorized execution
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-espresso)' }}>
                Approval Countdown TTL Window
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                Active safety duration before unapproved consequential actions automatically abort.
              </div>
            </div>
            <select
              value={settings.approvalTtlSeconds}
              onChange={e => handleChange('approvalTtlSeconds', Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px'
              }}
            >
              <option value={60}>60 seconds</option>
              <option value={120}>120 seconds</option>
              <option value={180}>180 seconds (Standard)</option>
              <option value={300}>300 seconds</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-espresso)' }}>
                Auto-Confirm Low-Risk Creations
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                Skip Step 2 intent confirmation for safe sandboxed SVG generation.
              </div>
            </div>
            <button
              type="button"
              className={`mira-btn mira-btn-sm ${settings.autoConfirmLowRisk ? 'mira-btn-success' : 'mira-btn-outline'}`}
              onClick={() => handleToggle('autoConfirmLowRisk')}
            >
              {settings.autoConfirmLowRisk ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-espresso)' }}>
                Prohibit Live Screen / Video Streaming
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                Inviolable MIRA rule: Zero transmission or recording of desktop video or camera feeds.
              </div>
            </div>
            <span className="badge badge-completed" style={{ fontSize: '11px' }}>
              ✓ Enforced by Architecture
            </span>
          </div>
        </div>
      </div>

      {/* Workspace Confinement */}
      <div className="porcelain-card">
        <div className="card-header-bar">
          <div className="card-title-group">
            <div className="card-icon-bubble">
              <HardDrive size={18} />
            </div>
            <div>
              <h3 className="serif-heading" style={{ fontSize: '1.25rem' }}>
                Workspace Guard Confinement
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                FastMCP path validation policy on Windows Workstation
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
              Canonical Workspace Root Directory
            </label>
            <input
              type="text"
              disabled
              value={settings.workspaceGuardPath}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-espresso-muted)', fontStyle: 'italic' }}>
            Path confinement is enforced at runtime by FastMCP middleware. Requests referencing <code>C:\Windows\</code>, <code>AppData</code>, or parent directory traversal (<code>..</code>) are rejected with error <code>-32001 WORKSPACE_VIOLATION</code>.
          </div>
        </div>
      </div>

      {/* Developer & Demo Reset Controls */}
      <div className="porcelain-card" style={{ backgroundColor: 'var(--color-linen)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '4px' }}>
              Demo State Controls
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--color-espresso-secondary)' }}>
              Reset demo tasks, reload initial scenarios, or test error recovery flows.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="mira-btn mira-btn-outline mira-btn-sm"
              onClick={toggleLaptopStatus}
            >
              <Laptop size={14} />
              <span>Toggle Laptop ({laptop?.status})</span>
            </button>
            <button
              type="button"
              className="mira-btn mira-btn-secondary mira-btn-sm"
              onClick={resetDemoData}
            >
              <RotateCcw size={14} />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
