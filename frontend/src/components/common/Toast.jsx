import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: 'var(--color-espresso)',
      color: '#FFFFFF',
      padding: '12px 20px',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-dropdown)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '13.5px',
      fontWeight: 500,
      zIndex: 150,
      animation: 'modal-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <CheckCircle2 size={17} color="var(--color-gold)" />
      <span>{toastMessage}</span>
    </div>
  );
};
