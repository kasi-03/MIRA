import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Layers, 
  FolderCheck, 
  Radio, 
  Bell, 
  Settings, 
  Plus, 
  Smartphone, 
  Laptop, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const DesktopSidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    unreadCount, 
    pendingApprovalsCount, 
    setIsComposerOpen,
    devices 
  } = useApp();

  const laptop = devices.find(d => d.role === 'windows_workstation');
  const isLaptopOnline = laptop?.status === 'online';

  return (
    <aside className="desktop-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <a href="#home" className="brand-badge" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>
          <div className="brand-logo-gem">
            <Sparkles size={20} />
          </div>
          <div className="brand-title">
            <span>MIRA</span>
            <span className="brand-tagline">AI Workflow Companion</span>
          </div>
        </a>
      </div>

      {/* Primary Action Button */}
      <div style={{ padding: '16px 16px 4px' }}>
        <button
          type="button"
          className="mira-btn mira-btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => setIsComposerOpen(true)}
        >
          <Plus size={16} />
          <span>New Task (Phone 2)</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <button
          type="button"
          className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={18} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`nav-link-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <Layers size={18} />
          <span>Tasks &amp; Lifecycle</span>
          {pendingApprovalsCount > 0 && (
            <span className="nav-badge-pill warning">
              {pendingApprovalsCount} Action
            </span>
          )}
        </button>

        <button
          type="button"
          className={`nav-link-btn ${activeTab === 'output' ? 'active' : ''}`}
          onClick={() => setActiveTab('output')}
        >
          <FolderCheck size={18} />
          <span>Verified Output</span>
        </button>

        <button
          type="button"
          className={`nav-link-btn ${activeTab === 'connectivity' ? 'active' : ''}`}
          onClick={() => setActiveTab('connectivity')}
        >
          <Radio size={18} />
          <span>Connectivity &amp; MCP</span>
        </button>

        <button
          type="button"
          className={`nav-link-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={18} />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="nav-badge-pill">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`nav-link-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} />
          <span>System Settings</span>
        </button>
      </nav>

      {/* Primary Architecture Banner */}
      <div className="sidebar-workflow-banner">
        <div className="workflow-banner-title">
          <ShieldCheck size={13} />
          Primary Pipeline
        </div>
        <div className="workflow-banner-flow">
          <span>Phone 2</span>
          <ArrowRight size={11} color="var(--color-gold)" />
          <span>Backend</span>
          <ArrowRight size={11} color="var(--color-gold)" />
          <span>Laptop</span>
        </div>
        <div style={{ fontSize: '10.5px', color: 'var(--color-espresso-muted)', marginTop: '4px' }}>
          Alexa voice → MCP tool dispatch
        </div>
      </div>

      {/* Workstation Status Footer */}
      <div className="sidebar-footer">
        <div className="workstation-status-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`status-dot ${isLaptopOnline ? 'online' : 'offline'}`} />
            <span style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>
              Windows Laptop
            </span>
          </div>
          <span style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '11px', 
            color: isLaptopOnline ? 'var(--color-success)' : 'var(--color-error)' 
          }}>
            {isLaptopOnline ? 'FastMCP :8000' : 'Offline'}
          </span>
        </div>
      </div>
    </aside>
  );
};
