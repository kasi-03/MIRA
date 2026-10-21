/**
 * Canonical task status constants and helpers matching schemas/task.schema.json.
 */

export const TASK_STATUSES = {
  PENDING_CONFIRMATION: 'pending_confirmation',
  CONFIRMED: 'confirmed',
  VALIDATING: 'validating',
  AWAITING_APPROVAL: 'awaiting_approval',
  APPROVED: 'approved',
  EXECUTING: 'executing',
  VERIFYING: 'verifying',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUSES.PENDING_CONFIRMATION]: 'Needs Confirmation',
  [TASK_STATUSES.CONFIRMED]: 'Confirmed',
  [TASK_STATUSES.VALIDATING]: 'Validating Policies',
  [TASK_STATUSES.AWAITING_APPROVAL]: 'Awaiting Approval',
  [TASK_STATUSES.APPROVED]: 'Authorized',
  [TASK_STATUSES.EXECUTING]: 'Executing on Workstation',
  [TASK_STATUSES.VERIFYING]: 'Verifying Checksum',
  [TASK_STATUSES.COMPLETED]: 'Completed & Verified',
  [TASK_STATUSES.FAILED]: 'Failed',
  [TASK_STATUSES.REJECTED]: 'Rejected by User',
  [TASK_STATUSES.CANCELLED]: 'Cancelled',
};

export function isTaskTerminal(status) {
  return [
    TASK_STATUSES.COMPLETED,
    TASK_STATUSES.FAILED,
    TASK_STATUSES.REJECTED,
    TASK_STATUSES.CANCELLED,
  ].includes(status);
}

export function isTaskActive(status) {
  return [
    TASK_STATUSES.PENDING_CONFIRMATION,
    TASK_STATUSES.CONFIRMED,
    TASK_STATUSES.VALIDATING,
    TASK_STATUSES.AWAITING_APPROVAL,
    TASK_STATUSES.APPROVED,
    TASK_STATUSES.EXECUTING,
    TASK_STATUSES.VERIFYING,
  ].includes(status);
}
