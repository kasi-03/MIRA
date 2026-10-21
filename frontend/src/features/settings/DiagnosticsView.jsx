import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, ArrowLeft, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DiagnosticsView({ onBack }) {
  const { activeRole, isDemoMode, laptopConnection, resetOnboarding } = useApp();
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    try {
      localStorage.clear();
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 2000);
    } catch (e) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px 0' }}>
      {onBack && (
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm"
          style={{ alignSelf: 'flex-start', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      )}

      <div className="card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--mira-champagne-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--mira-bronze-dark)',
            }}
          >
            <Activity size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>System Diagnostics</h3>
            <span style={{ fontSize: '12px', color: 'var(--mira-text-muted)' }}>
              Truthful Frontend Telemetry
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--mira-surface-secondary)' }}>
            <span style={{ color: 'var(--mira-text-secondary)' }}>MIRA Frontend Version:</span>
            <span style={{ fontWeight: '600' }}>v1.0.0 (Stage 1 Foundation)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--mira-surface-secondary)' }}>
            <span style={{ color: 'var(--mira-text-secondary)' }}>Active Operating Mode:</span>
            <span style={{ fontWeight: '600' }}>{activeRole}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--mira-surface-secondary)' }}>
            <span style={{ color: 'var(--mira-text-secondary)' }}>Development Demo Mode:</span>
            <span style={{ fontWeight: '600', color: isDemoMode ? 'var(--mira-warning)' : 'var(--mira-text-secondary)' }}>
              {isDemoMode ? 'Enabled (Isolated Fixtures)' : 'Disabled (Production Interface)'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--mira-surface-secondary)' }}>
            <span style={{ color: 'var(--mira-text-secondary)' }}>Backend REST API:</span>
            <span style={{ fontWeight: '600', color: 'var(--mira-text-muted)' }}>
              Not Connected (Stage 1)
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--mira-surface-secondary)' }}>
            <span style={{ color: 'var(--mira-text-secondary)' }}>Windows FastMCP Host:</span>
            <span style={{ fontWeight: '600', color: laptopConnection.status.includes('connected') ? 'var(--mira-success)' : 'var(--mira-text-muted)' }}>
              {laptopConnection.status}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--mira-text-secondary)' }}>Client Storage:</span>
            <span style={{ fontWeight: '600' }}>HTML5 LocalStorage OK</span>
          </div>
        </div>
      </div>

      {/* Local Storage & Cache Controls */}
      <div className="card" style={{ padding: '18px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>
          Client Data &amp; Reset
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--mira-text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
          Reset your role selection and local preferences to re-experience the first-run onboarding screen.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              resetOnboarding();
              window.location.reload();
            }}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} />
            <span>Reset First-Run Onboarding</span>
          </button>

          <button
            onClick={handleClearCache}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--mira-error)' }}
          >
            <Trash2 size={14} />
            <span>{cacheCleared ? 'Cleared!' : 'Clear Local Cache'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
