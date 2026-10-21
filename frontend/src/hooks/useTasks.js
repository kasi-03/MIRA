import { useApp } from '../context/AppContext';

/**
 * useTasks hook — convenient access to task collection and submission actions.
 */
export function useTasks() {
  const {
    tasks,
    selectedTask,
    setSelectedTask,
    submitTask,
    confirmTask,
    isDemoMode,
  } = useApp();

  return {
    tasks,
    selectedTask,
    setSelectedTask,
    submitTask,
    confirmTask,
    isDemoMode,
  };
}
