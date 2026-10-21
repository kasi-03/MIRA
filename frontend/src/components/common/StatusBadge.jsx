import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const normalized = (status || '').toLowerCase();

  const config = {
    // Task States
    pending_confirmation: {
      label: 'Needs Confirmation',
      className: 'badge-warning',
      icon: Clock,
    },
    confirmed: {
      label: 'Confirmed',
      className: 'badge-bronze',
      icon: CheckCircle2,
    },
    validating: {
      label: 'Validating',
      className: 'badge-bronze',
      icon: RefreshCw,
    },
    awaiting_approval: {
      label: 'Awaiting Approval',
      className: 'badge-warning',
      icon: ShieldAlert,
    },
    approved: {
      label: 'Approved',
      className: 'badge-success',
      icon: CheckCircle2,
    },
    executing: {
      label: 'Executing on Laptop',
      className: 'badge-bronze',
      icon: Cpu,
    },
    verifying: {
      label: 'Verifying Result',
      className: 'badge-bronze',
      icon: RefreshCw,
    },
    completed: {
      label: 'Completed & Verified',
      className: 'badge-success',
      icon: CheckCircle2,
    },
    failed: {
      label: 'Failed',
      className: 'badge-error',
      icon: XCircle,
    },
    rejected: {
      label: 'Rejected',
      className: 'badge-neutral',
      icon: XCircle,
    },
    cancelled: {
      label: 'Cancelled',
      className: 'badge-neutral',
      icon: XCircle,
    },

    // Approval States
    pending: {
      label: 'Pending Approval',
      className: 'badge-warning',
      icon: Clock,
    },
    expired: {
      label: 'Expired',
      className: 'badge-neutral',
      icon: Clock,
    },

    // Verification States
    verified: {
      label: 'SHA-256 Verified',
      className: 'badge-success',
      icon: CheckCircle2,
    },
    unverified: {
      label: 'Unverified',
      className: 'badge-neutral',
      icon: Clock,
    },
    verification_failed: {
      label: 'Verification Failed',
      className: 'badge-error',
      icon: AlertTriangle,
    },

    // Connection States
    connected: {
      label: 'Workstation Connected',
      className: 'badge-success',
      icon: CheckCircle2,
    },
    simulated_connected: {
      label: 'Simulated Connected',
      className: 'badge-bronze',
      icon: CheckCircle2,
    },
    not_connected: {
      label: 'Laptop Disconnected',
      className: 'badge-neutral',
      icon: AlertTriangle,
    },
  }[normalized] || {
    label: status || 'Unknown',
    className: 'badge-neutral',
    icon: Clock,
  };

  const Icon = config.icon;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`badge ${config.className}`}
      style={{
        fontSize: size === 'sm' ? '11px' : '12px',
        padding: size === 'sm' ? '2px 7px' : '4px 10px',
      }}
    >
      <Icon size={iconSize} />
      <span>{config.label}</span>
    </span>
  );
}
