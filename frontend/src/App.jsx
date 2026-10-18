import React from 'react';
import { useApp } from './context/AppContext';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { DesktopTopbar } from './components/layout/DesktopTopbar';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { TasksPage } from './features/tasks/TasksPage';
import { OutputPage } from './features/output/OutputPage';
import { ConnectivityPage } from './features/connectivity/ConnectivityPage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { Phone1MobileView } from './features/mobile/Phone1MobileView';

// Workflow Modals & Drawers
import { TaskComposerModal } from './components/workflow/TaskComposerModal';
import { IntentConfirmationModal } from './components/workflow/IntentConfirmationModal';
import { ApprovalModal } from './components/workflow/ApprovalModal';
import { ArtifactViewerModal } from './components/workflow/ArtifactViewerModal';
import { TaskDetailPage } from './features/tasks/TaskDetailPage';
import { DeviceDetailsModal } from './components/common/DeviceDetailsModal';
import { ProfileDrawer } from './components/common/ProfileDrawer';
import { Toast } from './components/common/Toast';

import { Monitor, Smartphone } from 'lucide-react';

export const App = () => {
  const { viewMode, setViewMode, activeTab } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home': return <DashboardPage />;
      case 'tasks': return <TasksPage />;
      case 'output': return <OutputPage />;
      case 'connectivity': return <ConnectivityPage />;
      case 'notifications': return <NotificationsPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-container">
      {viewMode === 'desktop' ? (
        <>
          {/* Desktop Sidebar Navigation */}
          <DesktopSidebar />

          {/* Main Desktop Workspace */}
          <main className="main-workspace">
            <DesktopTopbar />
            <div className="content-body">
              {renderActiveTab()}
            </div>
          </main>
        </>
      ) : (
        /* Phone 1 Mobile Simulator View */
        <div style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '24px 16px 40px',
          backgroundColor: '#F1E9DD'
        }}>
          {/* Top Switcher Banner */}
          <div style={{
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-espresso)' }}>
              Phone 1 (Optional Secondary Dashboard)
            </span>
            <button
              type="button"
              className="mira-btn mira-btn-primary mira-btn-sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor size={14} />
              <span>Switch to Desktop</span>
            </button>
          </div>

          {/* Mobile Screen Container */}
          <Phone1MobileView />
        </div>
      )}

      {/* Global Interactive Workflow Modals & Drawers */}
      <TaskComposerModal />
      <IntentConfirmationModal />
      <ApprovalModal />
      <ArtifactViewerModal />
      <TaskDetailPage />
      <DeviceDetailsModal />
      <ProfileDrawer />
      <Toast />
    </div>
  );
};

export default App;
