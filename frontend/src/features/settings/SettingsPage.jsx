import React, { useState } from 'react';
import { useApp, ROLE_INFO, ROLES } from '../../context/AppContext';
import {
  Smartphone,
  ShieldCheck,
  FlaskConical,
  Eye,
  Sliders,
  Laptop,
  Activity,
  ChevronRight,
  RefreshCw,
  Bell
} from 'lucide-react';

export default function SettingsPage() {
  const {
    activeRole,
    openSecondaryView,
    isDemoMode,
    toggleDemoMode,
    resetOnboarding,
    fontFamilyPref,
    setFontFamilyPref,
  } = useApp();

  const [inputModePref, setInputModePref] = useState('both'); // 'both' | 'text_only'
  const [reducedMotion, setReducedMotion] = useState(false);

  const roleMeta = ROLE_INFO[activeRole] || ROLE_INFO[ROLES.ALEXA_COMPANION];

  const handleReducedMotionToggle = () => {
    setReducedMotion(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-normal', '0ms');
      } else {
        document.documentElement.style.setProperty('--transition-fast', '150ms');
        document.documentElement.style.setProperty('--transition-normal', '220ms');
      }
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px 0' }}>
      {/* Group A: Current Operating Mode */}
      <div className="card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--mira-champagne-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--mira-bronze-dark)',
              }}
            >
              <Smartphone size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Operating Mode</h3>
              <span style={{ fontSize: '12px', color: 'var(--mira-text-muted)' }}>
                Device Profile
              </span>
            </div>
          </div>

          <span className="badge badge-bronze" style={{ fontSize: '11px' }}>
            {roleMeta.label}
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--mira-text-secondary)', lineHeight: '1.45', marginBottom: '14px' }}>
          {roleMeta.description}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => openSecondaryView('role_select')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            <span>Change Operating Mode</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Group B: Assistant Preferences */}
      <div className="card" style={{ padding: '18px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={17} color="var(--mira-bronze)" />
          <span>Interaction Preferences</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--mira-text-primary)' }}>Input Modes</div>
              <div style={{ fontSize: '12px', color: 'var(--mira-text-secondary)' }}>
                Enable microphone button alongside multiline text composer
              </div>
            </div>

            <select
              value={inputModePref}
              onChange={(e) => setInputModePref(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--mira-surface-secondary)',
                backgroundColor: 'var(--mira-surface)',
                fontSize: '13px',
              }}
            >
              <option value="both">Text &amp; Voice</option>
              <option value="text_only">Text Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Group C: Appearance & Accessibility */}
      <div className="card" style={{ padding: '18px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={17} color="var(--mira-bronze)" />
          <span>Appearance &amp; Accessibility</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--mira-text-primary)' }}>Palette Theme</div>
              <div style={{ fontSize: '12px', color: 'var(--mira-text-secondary)' }}>
                MIRA Champagne &amp; Ink Light Theme (Default)
              </div>
            </div>
            <span className="badge badge-bronze" style={{ fontSize: '11px' }}>Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--mira-surface-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--mira-text-primary)' }}>Font Family Personality</div>
                <div style={{ fontSize: '12px', color: 'var(--mira-text-secondary)' }}>
                  Curated pairings of title &amp; pure wordmark logo with complementary body typography
                </div>
              </div>
              <span className="badge badge-champagne" style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {fontFamilyPref}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '4px' }}>
              {[
                { id: 'syne', label: 'Editorial Luxury', title: 'Syne', body: 'Plus Jakarta Sans' },
                { id: 'space', label: 'Neo-Tech Precision', title: 'Space Grotesk', body: 'DM Sans' },
                { id: 'couture', label: 'Haute Couture', title: 'Cormorant', body: 'Jakarta Sans' },
                { id: 'outfit', label: 'Modern Minimal', title: 'Outfit', body: 'DM Sans' },
                { id: 'typewriter', label: 'Monospace Retro', title: 'Montserrat', body: 'Courier' },
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setFontFamilyPref(theme.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: fontFamilyPref === theme.id ? '2px solid var(--mira-bronze)' : '1px solid var(--mira-surface-secondary)',
                    backgroundColor: fontFamilyPref === theme.id ? 'var(--mira-champagne-soft)' : 'var(--mira-surface)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '700', color: fontFamilyPref === theme.id ? 'var(--mira-bronze-dark)' : 'var(--mira-text-primary)' }}>
                    {theme.label}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--mira-text-secondary)' }}>
                    {theme.title} + {theme.body}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--mira-surface-secondary)' }}>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--mira-text-primary)' }}>Reduce Animations</div>
              <div style={{ fontSize: '12px', color: 'var(--mira-text-secondary)' }}>
                Minimizes screen transition motion
              </div>
            </div>

            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={handleReducedMotionToggle}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--mira-bronze)' }}
            />
          </div>
        </div>
      </div>

      {/* Group D: Privacy & Workstation Boundary Disclosure */}
      <div className="card" style={{ padding: '18px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={17} color="var(--mira-bronze)" />
          <span>Privacy &amp; Security Boundary</span>
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--mira-text-secondary)', lineHeight: '1.45', margin: 0 }}>
          MIRA transmits natural language task requests to your local orchestrator. When actions are confirmed, work is executed strictly within your Windows workstation's sandboxed directory (<code>C:\mira\workspace\</code>). No raw screen, camera, or audio streams are persisted.
        </p>
      </div>

      {/* Group E: Development Demo Mode Switch */}
      <div
        className="card"
        style={{
          padding: '18px',
          borderColor: isDemoMode ? 'var(--mira-warning)' : 'var(--mira-surface-secondary)',
          backgroundColor: isDemoMode ? 'var(--mira-warning-bg)' : 'var(--mira-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FlaskConical size={18} color="var(--mira-warning)" />
            <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Development Demo Mode</h4>
          </div>

          <input
            type="checkbox"
            checked={isDemoMode}
            onChange={toggleDemoMode}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--mira-bronze)' }}
          />
        </div>

        <p style={{ fontSize: '12.5px', color: 'var(--mira-text-secondary)', lineHeight: '1.4', margin: 0 }}>
          Loads isolated mock tasks, simulated approvals with a live 180s countdown, and pre-verified sample SVG deliverables for evaluating the mobile UI before backend integration.
        </p>
      </div>

      {/* Group F: Secondary Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => openSecondaryView('devices')}
          className="btn btn-secondary"
          style={{ justifyContent: 'space-between', padding: '12px 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Laptop size={18} color="var(--mira-bronze)" />
            <span>Device Management &amp; Pairing</span>
          </div>
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => openSecondaryView('notifications')}
          className="btn btn-secondary"
          style={{ justifyContent: 'space-between', padding: '12px 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={18} color="var(--mira-bronze)" />
            <span>Notification Center</span>
          </div>
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => openSecondaryView('diagnostics')}
          className="btn btn-secondary"
          style={{ justifyContent: 'space-between', padding: '12px 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={18} color="var(--mira-bronze)" />
            <span>Diagnostics &amp; Storage</span>
          </div>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
