import React, { useState } from 'react';
import ArtifactGallery from '../../components/artifacts/ArtifactGallery';
import { useApp } from '../../context/AppContext';
import { Layers, Activity, Clock, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function ArtifactsPage() {
  const [subTab, setSubTab] = useState('artifacts'); // 'artifacts' | 'timeline'
  const { isDemoMode, tasks } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '4px 0' }}>
      {/* Sub-tab Switcher */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--mira-surface)',
          border: '1px solid var(--mira-surface-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
        }}
      >
        <button
          onClick={() => setSubTab('artifacts')}
          className="btn btn-sm"
          style={{
            flex: 1,
            backgroundColor: subTab === 'artifacts' ? 'var(--mira-bronze)' : 'transparent',
            color: subTab === 'artifacts' ? '#FFFFFF' : 'var(--mira-text-primary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
          }}
        >
          <Layers size={14} />
          <span>Deliverables</span>
        </button>

        <button
          onClick={() => setSubTab('timeline')}
          className="btn btn-sm"
          style={{
            flex: 1,
            backgroundColor: subTab === 'timeline' ? 'var(--mira-bronze)' : 'transparent',
            color: subTab === 'timeline' ? '#FFFFFF' : 'var(--mira-text-primary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
          }}
        >
          <Activity size={14} />
          <span>Activity Stream</span>
        </button>
      </div>

      {subTab === 'artifacts' ? (
        <ArtifactGallery />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No activity events"
              description="Real-time execution milestones (task dispatched, tool progress, SHA-256 verification, deliverable saved) stream here."
            />
          ) : (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>
                Recent Workstation Events
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tasks.map((task, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      paddingBottom: '10px',
                      borderBottom: i < tasks.length - 1 ? '1px solid var(--mira-surface-secondary)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--mira-champagne-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--mira-bronze-dark)',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <Cpu size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--mira-text-primary)' }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--mira-text-secondary)' }}>
                        Stage: {task.current_stage || task.status}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--mira-text-muted)' }}>
                        {new Date(task.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
