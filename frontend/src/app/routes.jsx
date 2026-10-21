/**
 * MIRA Navigation Routes Definition
 */

export const ROUTES = {
  ASSISTANT: 'assistant',
  TASKS: 'tasks',
  APPROVALS: 'approvals',
  ARTIFACTS: 'artifacts',
  SETTINGS: 'settings',
};

export const ROUTE_CONFIG = [
  { id: ROUTES.ASSISTANT, label: 'Assistant', path: '/' },
  { id: ROUTES.TASKS, label: 'Tasks', path: '/tasks' },
  { id: ROUTES.APPROVALS, label: 'Approvals', path: '/approvals' },
  { id: ROUTES.ARTIFACTS, label: 'Activity', path: '/artifacts' },
  { id: ROUTES.SETTINGS, label: 'Settings', path: '/settings' },
];
