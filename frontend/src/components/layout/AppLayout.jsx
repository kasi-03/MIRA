import React from 'react';
import { useApp, ROLES, ROLE_INFO } from '../../context/AppContext';
import Header from './Header';
import Navigation from './Navigation';
import DrawerMenu from './DrawerMenu';
import RoleSelector from '../common/RoleSelector';

// Primary Screens
import AssistantPage from '../../features/assistant/AssistantPage';
import TasksPage from '../../features/tasks/TasksPage';
import ApprovalsPage from '../../features/approvals/ApprovalsPage';
import ArtifactsPage from '../../features/artifacts/ArtifactsPage';
import SettingsPage from '../../features/settings/SettingsPage';

// Secondary Views
import DeviceManagementView from '../../features/settings/DeviceManagementView';
import NotificationsView from '../../features/settings/NotificationsView';
import DiagnosticsView from '../../features/settings/DiagnosticsView';

import { Smartphone, Monitor, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AppLayout() {
  const {
    activeRole,
    hasCompletedOnboarding,
    activeTab,
    secondaryView,
    closeSecondaryView,
    openSecondaryView,
  } = useApp();

  // If first run, show Role Selector onboarding
  if (!hasCompletedOnboarding) {
    return <RoleSelector />;
  }

  // Render role-specific content or primary tab
  const renderContent = () => {
    // Secondary full-screen views take precedence when opened
    if (secondaryView === 'devices') {
      return <DeviceManagementView onBack={closeSecondaryView} />;
    }
    if (secondaryView === 'notifications') {
      return <NotificationsView onBack={closeSecondaryView} />;
    }
    if (secondaryView === 'diagnostics') {
      return <DiagnosticsView onBack={closeSecondaryView} />;
    }

    // Role B: Mobile Secondary Mode Shell
    if (activeRole === ROLES.MOBILE && activeTab === 'assistant') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
          <div className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'var(--mira-champagne-soft)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--mira-bronze-dark)',
                marginBottom: '14px',
              }}
            >
              <Smartphone size={24} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              Mobile Secondary Mode
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--mira-text-secondary)', lineHeight: '1.45', maxWidth: '380px', margin: '0 auto 18px' }}>
              This device is currently operating in <strong>Secondary Mobile</strong> mode. You can monitor task history, inspect safety approvals, and view verified deliverables.
            </p>

            <div
              style={{
                backgroundColor: 'var(--mira-surface-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontSize: '12.5px',
                color: 'var(--mira-text-secondary)',
                marginBottom: '20px',
                textAlign: 'left',
                lineHeight: '1.4',
              }}
            >
              <strong>Primary Interaction Note:</strong> To express prompts by voice or text and coordinate the execution workflow, switch this device to <strong>Alexa Companion</strong> mode.
            </div>

            <button
              onClick={() => openSecondaryView('role_select')}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <span>Switch to Alexa Companion (Primary)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      );
    }

    // Role C: Windows Laptop Workstation Shell
    if (activeRole === ROLES.LAPTOP && activeTab === 'assistant') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
          <div className="card" style={{ padding: '24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--mira-champagne-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--mira-bronze-dark)',
                }}
              >
                <Monitor size={22} />
              </div>

              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Workstation Execution Device</h3>
                <span style={{ fontSize: '12px', color: 'var(--mira-text-muted)' }}>
                  Windows FastMCP Host Perspective
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--mira-text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>
              In production, this workstation hosts the native Python FastMCP server over Streamable HTTP, confining disk operations to <code>C:\mira\workspace\</code>.
            </p>

            <div
              style={{
                backgroundColor: 'var(--mira-surface-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                fontSize: '12.5px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '18px',
              }}
            >
              <div><strong>Registered Tools:</strong> <code>generate_svg_poster</code>, <code>build_document</code>, <code>export_telemetry</code>, <code>run_sandboxed_script</code></div>
              <div><strong>Confined Directory:</strong> <code>C:\mira\workspace\</code></div>
              <div><strong>Approval Shield:</strong> Mandatory Mobile Sign-off for consequential tools</div>
            </div>

            <button
              onClick={() => openSecondaryView('role_select')}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <span>Switch to Alexa Companion Mode</span>
            </button>
          </div>
        </div>
      );
    }

    // Role A (or active tab in other roles): Standard Tab Destinations
    switch (activeTab) {
      case 'assistant':
        return <AssistantPage />;
      case 'tasks':
        return <TasksPage />;
      case 'approvals':
        return <ApprovalsPage />;
      case 'artifacts':
        return <ArtifactsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AssistantPage />;
    }
  };

  return (
    <div className="app-viewport">
      <Header />

      <main className="screen-container">
        {renderContent()}
      </main>

      <Navigation />

      <DrawerMenu />

      {/* Role Selector Modal when requested from Header/Settings */}
      {secondaryView === 'role_select' && (
        <RoleSelector onDismiss={closeSecondaryView} />
      )}
    </div>
  );
}
