import { useMemo } from 'react';
import { isTaskTerminal, isTaskActive, TASK_STATUS_LABELS } from '../utils/taskStatus';

/**
 * useTaskStatus — helper hook to query active vs completed metrics.
 */
export function useTaskStatus(tasks = []) {
  return useMemo(() => {
    const activeTasks = tasks.filter(t => isTaskActive(t.status));
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const awaitingApproval = tasks.filter(t => t.status === 'awaiting_approval');
    const failedTasks = tasks.filter(t => t.status === 'failed' || t.status === 'rejected');

    return {
      activeCount: activeTasks.length,
      completedCount: completedTasks.length,
      awaitingApprovalCount: awaitingApproval.length,
      failedCount: failedTasks.length,
      totalCount: tasks.length,
      getStatusLabel: (status) => TASK_STATUS_LABELS[status] || status,
      isTerminal: isTaskTerminal,
      isActive: isTaskActive,
    };
  }, [tasks]);
}
