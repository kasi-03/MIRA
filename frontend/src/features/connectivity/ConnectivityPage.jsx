import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  Smartphone, 
  Laptop, 
  Server, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Globe, 
  Terminal, 
  FolderGit2, 
  ShoppingBag, 
  AppWindow,
  Wifi,
  WifiOff,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const ConnectivityPage = () => {
  const { devices, integrations, toggleLaptopStatus, openDeviceDetails } = useApp();

  const phone2 = devices.find(d => d.role === 'phone_primary');
  const backend = devices.find(d => d.role === 'backend_orchestrator');
  const laptop = devices.find(d => d.role === 'windows_workstation');
  const phone1 = devices.find(d => d.role === 'phone_secondary_optional');

  const getIntegrationIcon = (category) => {
    switch (category) {
      case 'Browser': return <Globe size={18} />;
      case 'Desktop': return <AppWindow size={18} />;
      case 'Filesystem': return <HardDrive size={18} />;
      case 'Terminal': return <Terminal size={18} />;
      case 'Git': return <FolderGit2 size={18} />;
      case 'Shopping': return <ShoppingBag size={18} />;
      default: return <Cpu size={18} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="serif-heading" style={{ fontSize: '1.9rem', marginBottom: '4px' }}>
            Device Fleet &amp; MCP Integrations
          </h1>
          <p style={{ color: 'var(--color-espresso-secondary)', fontSize: '14px' }}>
            Primary workflow operates via Phone 2 Alexa Companion and Windows FastMCP. Phone 1 provides optional secondary monitoring.
          </p>
        </div>

        {/* Demo Simulation Trigger */}
        <button
          type="button"
          className={`mira-btn ${laptop?.status === 'online' ? 'mira-btn-danger' : 'mira-btn-success'}`}
          onClick={toggleLaptopStatus}
        >
          {laptop?.status === 'online' ? <WifiOff size={15} /> : <Wifi size={15} />}
          <span>{laptop?.status === 'online' ? "Simulate Laptop Disconnect" : "Reconnect Workstation"}</span>
        </button>
      </div>

      {/* Primary Fleet Grid */}
      <div className="dashboard-grid">
        {/* Phone 2 Card (Primary) */}
        <div className="col-6">
          <div 
            className="porcelain-card highlight" 
            style={{ height: '100%', cursor: 'pointer' }}
            onClick={() => openDeviceDetails(phone2.device_id)}
          >
            <div className="card-header-bar">
              <div className="card-title-group">
                <div className="card-icon-bubble">
                  <Smartphone size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className="serif-heading" style={{ fontSize: '1.25rem' }}>
                      Phone 2 — Alexa Companion
                    </h3>
                    <span className="badge badge-completed">
                      Primary Interface
                    </span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-espresso-muted)' }}>
                    {phone2?.os_info}
                  </p>
                </div>
              </div>

              <span className="badge badge-completed">
                Connected
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-espresso-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
              The authoritative user interface for speech/text entry, confirmation dialogs, 180s countdown approvals, and artifact delivery.
            </p>

            <div style={{
              padding: '14px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Device Identifier:</span>
                <code style={{ fontFamily: 'var(--font-mono)' }}>{phone2?.device_id}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Network IP:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{phone2?.ip_address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Role in Architecture:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-gold-hover)' }}>Sole Primary User Perimeter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Windows Laptop Card (Host Execution Engine) */}
        <div className="col-6">
          <div 
            className={`porcelain-card ${laptop?.status === 'online' ? '' : 'error'}`} 
            style={{ height: '100%', cursor: 'pointer' }}
            onClick={() => openDeviceDetails(laptop.device_id)}
          >
            <div className="card-header-bar">
              <div className="card-title-group">
                <div className="card-icon-bubble" style={{ 
                  backgroundColor: laptop?.status === 'online' ? 'var(--color-gold-light)' : 'var(--color-error-bg)',
                  color: laptop?.status === 'online' ? 'var(--color-gold)' : 'var(--color-error)'
                }}>
                  <Laptop size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className="serif-heading" style={{ fontSize: '1.25rem' }}>
                      Windows Laptop
                    </h3>
                    <span className={`badge ${laptop?.status === 'online' ? 'badge-completed' : 'badge-failed'}`}>
                      {laptop?.status === 'online' ? 'Execution Device' : 'Offline'}
                    </span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-espresso-muted)' }}>
                    {laptop?.os_info}
                  </p>
                </div>
              </div>

              <span className={`badge ${laptop?.status === 'online' ? 'badge-completed' : 'badge-failed'}`}>
                {laptop?.status === 'online' ? 'Port :8000' : 'Disconnected'}
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-espresso-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
              Native host execution device running FastMCP on Uvicorn. Dispatches workstation tools within sandboxed workspace.
            </p>

            <div style={{
              padding: '14px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Workspace Root:</span>
                <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold-hover)' }}>{laptop?.workspace_root}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Workspace Guard:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                  ✓ Confined (Path Traversal Prohibited)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Resource Utilization:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  CPU: {laptop?.cpu_usage}% | RAM: {laptop?.memory_usage}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Orchestrator Card */}
        <div className="col-6">
          <div 
            className="porcelain-card" 
            style={{ height: '100%', cursor: 'pointer' }}
            onClick={() => openDeviceDetails(backend.device_id)}
          >
            <div className="card-header-bar">
              <div className="card-title-group">
                <div className="card-icon-bubble">
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="serif-heading" style={{ fontSize: '1.25rem' }}>
                    MIRA Backend / Agent
                  </h3>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-espresso-muted)' }}>
                    Coordination Layer • {backend?.os_info}
                  </p>
                </div>
              </div>

              <span className="badge badge-completed">
                Ready :5000
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-espresso-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
              Finite state machine coordinator, policy gating engine, and independent cryptographic artifact verifier.
            </p>

            <div style={{
              padding: '14px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Persistence Engine:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>SQLite 3 (WAL Mode Active)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Policy Gating:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-gold-hover)' }}>Risk Evaluation Enforced</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Event Hub:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>Server-Sent Events (SSE) Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phone 1 Card (Optional) */}
        <div className="col-6">
          <div 
            className="porcelain-card" 
            style={{ height: '100%', borderStyle: 'dashed', cursor: 'pointer' }}
            onClick={() => openDeviceDetails(phone1.device_id)}
          >
            <div className="card-header-bar">
              <div className="card-title-group">
                <div className="card-icon-bubble" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-espresso-muted)' }}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className="serif-heading" style={{ fontSize: '1.25rem' }}>
                      Phone 1 — Secondary Dashboard
                    </h3>
                    <span style={{ fontSize: '10.5px', color: 'var(--color-espresso-muted)', fontStyle: 'italic' }}>
                      (Optional Node)
                    </span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-espresso-muted)' }}>
                    {phone1?.os_info}
                  </p>
                </div>
              </div>

              <span className="badge badge-pending">
                Linked
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-espresso-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
              Optional secondary mobile client for remote status viewing and secondary inspection. Disconnecting Phone 1 does not block the primary Phone 2 workflow.
            </p>

            <div style={{
              padding: '14px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Workflow Mandate:</span>
                <span style={{ color: 'var(--color-espresso)' }}>Never Required (100% Optional)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Capabilities:</span>
                <span>Artifact Viewer, Read-Only Telemetry</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Context Protocol (MCP) Tool Integrations */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h2 className="serif-heading" style={{ fontSize: '1.45rem', marginBottom: '4px' }}>
            Workstation MCP Tool Integrations
          </h2>
          <p style={{ color: 'var(--color-espresso-secondary)', fontSize: '13.5px' }}>
            Registered tools on the Windows FastMCP engine with risk policies and path boundaries.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
          {integrations.map(tool => (
            <div key={tool.id} className="porcelain-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="card-icon-bubble">
                    {getIntegrationIcon(tool.category)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-espresso)' }}>
                      {tool.name}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--color-espresso-muted)' }}>
                      {tool.provider}
                    </span>
                  </div>
                </div>

                <span className={`badge ${tool.risk_level === 'high' ? 'badge-approval' : 'badge-pending'}`} style={{ fontSize: '10.5px' }}>
                  {tool.risk_level.toUpperCase()} RISK
                </span>
              </div>

              <p style={{ fontSize: '12.5px', color: 'var(--color-espresso-secondary)', lineHeight: '1.45' }}>
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
