import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Smartphone, Laptop, Server, Cpu, CheckCircle2, Shield, Wifi, HardDrive } from 'lucide-react';

export const DeviceDetailsModal = () => {
  const { selectedDevice, closeDeviceDetails, toggleLaptopStatus } = useApp();

  if (!selectedDevice) return null;

  const getDeviceIcon = () => {
    switch (selectedDevice.role) {
      case 'phone_primary':
      case 'phone_secondary_optional':
        return <Smartphone size={22} />;
      case 'windows_workstation':
        return <Laptop size={22} />;
      case 'backend_orchestrator':
        return <Server size={22} />;
      default:
        return <Cpu size={22} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={closeDeviceDetails}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div className="card-title-group">
            <div className="card-icon-bubble">
              {getDeviceIcon()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="serif-heading" style={{ fontSize: '1.25rem' }}>
                  {selectedDevice.name}
                </h3>
                <span className={`badge ${selectedDevice.status === 'online' ? 'badge-completed' : 'badge-failed'}`}>
                  {selectedDevice.status}
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--color-espresso-muted)' }}>
                {selectedDevice.badge} • ID: {selectedDevice.device_id}
              </p>
            </div>
          </div>

          <button className="mira-btn-outline mira-btn-sm" onClick={closeDeviceDetails}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Note */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            color: 'var(--color-espresso-secondary)',
            lineHeight: '1.45'
          }}>
            {selectedDevice.note}
          </div>

          {/* Device Telemetry Table */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '12.5px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-espresso-muted)' }}>Operating System:</span>
              <span style={{ fontWeight: 500, color: 'var(--color-espresso)' }}>{selectedDevice.os_info}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-espresso-muted)' }}>Network Address:</span>
              <code style={{ fontFamily: 'var(--font-mono)' }}>{selectedDevice.ip_address}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-espresso-muted)' }}>Last Activity:</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{selectedDevice.last_seen}</span>
            </div>
            {selectedDevice.workspace_root && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Workspace Root:</span>
                <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold-hover)' }}>{selectedDevice.workspace_root}</code>
              </div>
            )}
            {selectedDevice.cpu_usage !== undefined && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-espresso-muted)' }}>Hardware Utilization:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>CPU: {selectedDevice.cpu_usage}% | RAM: {selectedDevice.memory_usage}</span>
              </div>
            )}
          </div>

          {/* Capabilities */}
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Registered Capabilities
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedDevice.capabilities.map((cap, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: 'var(--color-linen)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--color-espresso)'
                  }}
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {selectedDevice.role === 'windows_workstation' && (
            <button
              type="button"
              className="mira-btn mira-btn-outline mira-btn-sm"
              onClick={toggleLaptopStatus}
            >
              Toggle Online / Offline
            </button>
          )}
          <button
            type="button"
            className="mira-btn mira-btn-primary mira-btn-sm"
            onClick={closeDeviceDetails}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
