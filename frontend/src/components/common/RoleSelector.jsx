import React, { useState } from 'react';
import { useApp, ROLES, ROLE_INFO } from '../../context/AppContext';
import { Smartphone, Monitor, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RoleSelector({ onDismiss }) {
  const { activeRole, completeOnboarding } = useApp();
  const [selectedRole, setSelectedRole] = useState(activeRole);

  const roleIcons = {
    [ROLES.ALEXA_COMPANION]: Smartphone,
    [ROLES.MOBILE]: Smartphone,
    [ROLES.LAPTOP]: Monitor,
  };

  const handleContinue = () => {
    completeOnboarding(selectedRole);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="modal-backdrop" style={{ alignItems: 'center', padding: '16px' }}>
      <div className="modal-content" style={{ maxWidth: '520px', padding: '28px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <span
              className="brand-wordmark-lg"
              style={{
                fontSize: '26px',
                letterSpacing: '0.14em',
              }}
            >
              MIRA
            </span>
          </div>

          <h2 style={{ fontSize: '22px', marginBottom: '6px' }}>Select Device Role</h2>
          <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto', color: 'var(--mira-text-secondary)' }}>
            Device roles represent client operating modes in the MIRA ecosystem, not separate user accounts.
          </p>
        </div>

        {/* Role Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {Object.values(ROLES).map((roleId) => {
            const info = ROLE_INFO[roleId];
            const isSelected = selectedRole === roleId;
            const Icon = roleIcons[roleId] || Smartphone;

            return (
              <div
                key={roleId}
                onClick={() => setSelectedRole(roleId)}
                className="card card-interactive"
                style={{
                  padding: '16px',
                  borderColor: isSelected ? 'var(--mira-bronze)' : 'var(--mira-surface-secondary)',
                  backgroundColor: isSelected ? 'var(--mira-champagne-subtle)' : 'var(--mira-surface)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  position: 'relative',
                  borderWidth: isSelected ? '2px' : '1px',
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'var(--mira-champagne-soft)' : 'var(--mira-surface-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  <Icon size={22} color={isSelected ? 'var(--mira-bronze-dark)' : 'var(--mira-text-secondary)'} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--mira-text-primary)' }}>
                      {info.label}
                    </span>
                    {info.primary && (
                      <span className="badge badge-bronze" style={{ fontSize: '11px' }}>
                        Recommended
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: '1.4', color: 'var(--mira-text-secondary)', marginBottom: '4px' }}>
                    {info.summary}
                  </p>
                </div>

                {/* Selection Radio Indicator */}
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? 'var(--mira-bronze)' : 'var(--mira-surface-secondary)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: isSelected ? 'var(--mira-bronze)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}>
                  {isSelected && <CheckCircle2 size={16} color="#FFFFFF" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Operating Mode Clarification Notice */}
        <div style={{
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--mira-surface-secondary)',
          fontSize: '12px',
          color: 'var(--mira-text-secondary)',
          lineHeight: '1.45',
          marginBottom: '20px'
        }}>
          <strong>Note:</strong> Selecting a role here sets this browser session’s interface profile. It does not configure or register physical workstation hardware. You can change this role anytime in Settings.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleContinue}
            className="btn btn-primary"
            style={{ flex: onDismiss ? 2 : 1 }}
          >
            <span>Continue as {ROLE_INFO[selectedRole]?.label || 'Companion'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
