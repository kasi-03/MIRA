import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEMO_TASKS,
  DEMO_APPROVALS,
  DEMO_ARTIFACTS,
  DEMO_NOTIFICATIONS
} from '../mocks/demoFixtures';
import { taskService } from '../services/taskService';
import { approvalService } from '../services/approvalService';
import { artifactService } from '../services/artifactService';
import { apiClient } from '../services/apiClient';

export const ROLES = {
  ALEXA_COMPANION: 'alexa_companion',
  MOBILE: 'mobile_secondary',
  LAPTOP: 'laptop_workstation',
};

export const ROLE_INFO = {
  [ROLES.ALEXA_COMPANION]: {
    id: ROLES.ALEXA_COMPANION,
    label: 'Alexa Companion',
    badge: 'Primary Mobile Interface',
    summary: 'The central mobile command interface for conversing with MIRA, authorizing actions, and receiving verified workstation deliverables.',
    description: 'Use your phone to submit tasks by text or voice, monitor remote execution, review safety approvals, and pan/zoom verified deliverables from your Windows laptop.',
    primary: true,
  },
  [ROLES.MOBILE]: {
    id: ROLES.MOBILE,
    label: 'Mobile Secondary',
    badge: 'Secondary Mobile Interface',
    summary: 'Optional mobile interface for monitoring task history, receiving notifications, and reviewing shared results.',
    description: 'An auxiliary mobile viewer mode. Use this when another device is already running Alexa Companion or when you simply want lightweight notification monitoring.',
    primary: false,
  },
  [ROLES.LAPTOP]: {
    id: ROLES.LAPTOP,
    label: 'Windows Laptop',
    badge: 'Execution Workstation',
    summary: 'Execution host view for monitoring the native Windows FastMCP server, workspace directory, and local tool dispatch.',
    description: 'Displays the workstation runtime perspective. Selecting this role allows monitoring tool registrations and workspace confinement on Windows.',
    primary: false,
  },
};

const AppContext = createContext(null);

const STORAGE_KEYS = {
  ROLE: 'mira_role_preference',
  ONBOARDING: 'mira_onboarding_completed',
  DEMO_MODE: 'mira_demo_mode',
  REDUCED_MOTION: 'mira_reduced_motion',
};

export function AppProvider({ children }) {
  // Device Role State
  const [activeRole, setActiveRoleState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (stored && Object.values(ROLES).includes(stored)) {
        return stored;
      }
    } catch (e) {
      // Storage access disabled or error
    }
    return ROLES.ALEXA_COMPANION;
  });

  // Onboarding / First-Run State
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Development Demo Mode State (defaults to false for honest initial state)
  const [isDemoMode, setIsDemoMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Font Family Theme Preference ('syne' | 'space' | 'couture' | 'outfit' | 'typewriter')
  const [fontFamilyPref, setFontFamilyPrefState] = useState(() => {
    try {
      return localStorage.getItem('mira_font_family_pref') || 'syne';
    } catch (e) {
      return 'syne';
    }
  });

  const setFontFamilyPref = (theme) => {
    setFontFamilyPrefState(theme);
    try {
      localStorage.setItem('mira_font_family_pref', theme);
    } catch (e) {}
    document.body.classList.remove(
      'font-theme-syne',
      'font-theme-space',
      'font-theme-couture',
      'font-theme-outfit',
      'font-theme-typewriter'
    );
    document.body.classList.add(`font-theme-${theme}`);
  };

  useEffect(() => {
    document.body.classList.remove(
      'font-theme-syne',
      'font-theme-space',
      'font-theme-couture',
      'font-theme-outfit',
      'font-theme-typewriter'
    );
    document.body.classList.add(`font-theme-${fontFamilyPref}`);
  }, [fontFamilyPref]);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState('assistant'); // 'assistant' | 'tasks' | 'approvals' | 'artifacts' | 'settings'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [secondaryView, setSecondaryView] = useState(null); // null | 'devices' | 'notifications' | 'diagnostics' | 'role_select'

  // Modal / Detail State
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [confirmationTask, setConfirmationTask] = useState(null);

  // Composer State
  const [composerDraft, setComposerDraft] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  // Data Collections (Honest empty state in normal mode, populated in demo mode)
  const [tasks, setTasks] = useState(() => (isDemoMode ? DEMO_TASKS : []));
  const [approvals, setApprovals] = useState(() => (isDemoMode ? DEMO_APPROVALS : []));
  const [artifacts, setArtifacts] = useState(() => (isDemoMode ? DEMO_ARTIFACTS : []));
  const [notifications, setNotifications] = useState(() => (isDemoMode ? DEMO_NOTIFICATIONS : []));

  // Connection Telemetry (Honest initial state: Not connected)
  const [laptopConnection, setLaptopConnection] = useState({
    status: isDemoMode ? 'simulated_connected' : 'not_connected',
    hostname: isDemoMode ? 'WINDOWS-WORKSTATION-11' : null,
    ipAddress: isDemoMode ? '192.168.1.142' : null,
    mcpVersion: isDemoMode ? '1.3.0' : null,
    lastSeen: isDemoMode ? new Date().toISOString() : null,
    workspacePath: isDemoMode ? 'C:\\mira\\workspace' : null,
  });

  // Synchronize collections live with Backend & Workstation
  const refreshLiveCollections = async () => {
    if (isDemoMode) return;
    try {
      const [taskRes, appRes, artRes, healthRes] = await Promise.all([
        taskService.getTasks(),
        approvalService.getPendingApprovals(),
        artifactService.getArtifacts(),
        apiClient.get('/api/health'),
      ]);

      const liveTasks = taskRes?.data?.data || taskRes?.data;
      const liveApprovals = appRes?.data?.data || appRes?.data;
      const liveArtifacts = artRes?.data?.data || artRes?.data;

      if (Array.isArray(liveTasks)) {
        setTasks(liveTasks);
      }
      if (Array.isArray(liveApprovals)) {
        setApprovals(liveApprovals);
      }
      if (Array.isArray(liveArtifacts)) {
        setArtifacts(liveArtifacts);
      }

      if (healthRes?.success) {
        setLaptopConnection({
          status: 'connected',
          hostname: 'WINDOWS-WORKSTATION-11',
          ipAddress: '127.0.0.1:8000',
          mcpVersion: '1.0.0',
          lastSeen: new Date().toISOString(),
          workspacePath: healthRes?.data?.workspace_root || 'C:\\mira\\workspace',
        });
      }
    } catch (e) {
      console.warn('Live backend sync:', e);
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      setTasks(DEMO_TASKS);
      setApprovals(DEMO_APPROVALS);
      setArtifacts(DEMO_ARTIFACTS);
      setNotifications(DEMO_NOTIFICATIONS);
      setLaptopConnection(prev => ({
        ...prev,
        status: 'simulated_connected',
        hostname: 'WINDOWS-WORKSTATION-11',
        ipAddress: '192.168.1.142',
        mcpVersion: '1.3.0',
        workspacePath: 'C:\\mira\\workspace',
      }));
    } else {
      refreshLiveCollections();
      const interval = setInterval(refreshLiveCollections, 2500);
      return () => clearInterval(interval);
    }
  }, [isDemoMode]);

  // Actions
  const setRole = (role) => {
    if (Object.values(ROLES).includes(role)) {
      setActiveRoleState(role);
      try {
        localStorage.setItem(STORAGE_KEYS.ROLE, role);
      } catch (e) {}
    }
  };

  const completeOnboarding = (role) => {
    setRole(role);
    setHasCompletedOnboarding(true);
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
    } catch (e) {}
    setSecondaryView(null);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
    } catch (e) {}
  };

  const toggleDemoMode = () => {
    setIsDemoMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.DEMO_MODE, String(next));
      } catch (e) {}
      return next;
    });
  };

  const openSecondaryView = (viewName) => {
    setSecondaryView(viewName);
    setIsDrawerOpen(false);
  };

  const closeSecondaryView = () => {
    setSecondaryView(null);
  };

  // Task Submission Handler (Live with Demo Fallback)
  const submitTask = async (promptText) => {
    if (!promptText || !promptText.trim()) return;

    if (!isDemoMode) {
      try {
        const createRes = await taskService.submitTask(promptText.trim());
        const newTask = createRes?.data?.data || createRes?.data;
        if (!newTask) throw new Error('Task creation returned empty');

        setTasks(prev => [newTask, ...prev.filter(t => t.task_id !== newTask.task_id)]);

        // Safe/Low risk (consequential === false): execute immediately!
        if (!newTask.consequential) {
          const confirmRes = await taskService.confirmTask(newTask.task_id);
          const executedTask = confirmRes?.data?.data || confirmRes?.data || newTask;
          setTasks(prev => [executedTask, ...prev.filter(t => t.task_id !== executedTask.task_id)]);
          setComposerDraft('');
          setSubmissionFeedback({
            type: 'success',
            title: 'Task Executed',
            message: 'Output delivered directly to Tasks and Artifacts sections.',
          });
          if (newTask.tool_calls?.[0]?.tool_name === 'generate_svg_poster') {
            setActiveTab('artifacts');
          } else {
            setActiveTab('tasks');
          }
        } else {
          // Risky or moderate work: confirm to issue approval ticket
          const confirmRes = await taskService.confirmTask(newTask.task_id);
          const awaitingTask = confirmRes?.data?.data || confirmRes?.data || newTask;
          setTasks(prev => [awaitingTask, ...prev.filter(t => t.task_id !== awaitingTask.task_id)]);
          setComposerDraft('');
          setSubmissionFeedback({
            type: 'warning',
            title: 'Action Approval Required',
            message: 'This is a moderate/risky operation on your laptop. Please review and approve in the Approvals tab.',
          });
          setActiveTab('approvals');
        }

        await refreshLiveCollections();
        return;
      } catch (err) {
        console.error('Failed to submit task to live backend:', err);
      }
    }

    // Demo Mode: Explicitly simulated workflow
    const newTask = {
      task_id: `task-sim-${Date.now().toString(36)}`,
      title: promptText.length > 40 ? promptText.slice(0, 40) + '...' : promptText,
      description: `Simulated task execution for prompt: "${promptText}"`,
      raw_prompt: promptText,
      status: 'pending_confirmation',
      risk_level: promptText.toLowerCase().includes('script') || promptText.toLowerCase().includes('run') ? 'high' : 'low',
      consequential: promptText.toLowerCase().includes('script') || promptText.toLowerCase().includes('run'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      device_label: 'Alienware Workstation (Simulated)',
      current_stage: 'Plan Interpretation Awaiting User Confirmation',
      tool_calls: [
        {
          tool_name: promptText.toLowerCase().includes('poster') ? 'generate_svg_poster' : 'build_document',
          status: 'simulated_pending',
          arguments: { prompt: promptText }
        }
      ]
    };

    setTasks(prev => [newTask, ...prev]);
    setConfirmationTask(newTask);
    setComposerDraft('');
    setSubmissionFeedback({
      type: 'success',
      title: 'Plan Interpreted (Demo Mode)',
      message: 'MIRA parsed your prompt. Please review the plan card above to confirm execution.',
    });
  };

  // Confirm Task Handler (Live with Demo Fallback)
  const confirmTask = async (taskId) => {
    if (!isDemoMode) {
      try {
        await taskService.confirmTask(taskId);
        await refreshLiveCollections();
      } catch (e) {
        console.error('Live confirm error:', e);
      }
      setConfirmationTask(null);
      return;
    }

    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        return {
          ...t,
          status: t.consequential ? 'awaiting_approval' : 'executing',
          current_stage: t.consequential ? 'Consequential Gating: Approval Ticket Issued' : 'Workstation Dispatch',
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    }));
    setConfirmationTask(null);
  };

  // Approval Handlers (Live with Demo Fallback)
  const handleApprove = async (approvalId) => {
    if (!isDemoMode) {
      try {
        await approvalService.approve(approvalId);
        await refreshLiveCollections();
        setActiveTab('tasks');
      } catch (e) {
        console.error('Live approval error:', e);
      }
      if (selectedApproval && selectedApproval.approval_id === approvalId) {
        setSelectedApproval(null);
      }
      return;
    }

    setApprovals(prev => prev.map(a => {
      if (a.approval_id === approvalId) {
        return { ...a, status: 'approved', decision_at: new Date().toISOString() };
      }
      return a;
    }));
    // Update parent task
    setTasks(prev => prev.map(t => {
      if (t.approval_id === approvalId) {
        return {
          ...t,
          status: 'executing',
          current_stage: 'Authorized: Workstation executing tool with dropped privilege sandbox',
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    }));
    if (selectedApproval && selectedApproval.approval_id === approvalId) {
      setSelectedApproval(null);
    }
  };

  const handleReject = async (approvalId) => {
    if (!isDemoMode) {
      try {
        await approvalService.reject(approvalId, 'Rejected by user');
        await refreshLiveCollections();
      } catch (e) {
        console.error('Live reject error:', e);
      }
      if (selectedApproval && selectedApproval.approval_id === approvalId) {
        setSelectedApproval(null);
      }
      return;
    }

    setApprovals(prev => prev.map(a => {
      if (a.approval_id === approvalId) {
        return { ...a, status: 'rejected', decision_at: new Date().toISOString() };
      }
      return a;
    }));
    // Update parent task
    setTasks(prev => prev.map(t => {
      if (t.approval_id === approvalId) {
        return {
          ...t,
          status: 'rejected',
          current_stage: 'Task Rejected by Mobile User',
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    }));
    if (selectedApproval && selectedApproval.approval_id === approvalId) {
      setSelectedApproval(null);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  const value = {
    activeRole,
    setRole,
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
    isDemoMode,
    toggleDemoMode,
    activeTab,
    setActiveTab,
    isDrawerOpen,
    setIsDrawerOpen,
    secondaryView,
    openSecondaryView,
    closeSecondaryView,
    selectedTask,
    setSelectedTask,
    selectedApproval,
    setSelectedApproval,
    selectedArtifact,
    setSelectedArtifact,
    confirmationTask,
    setConfirmationTask,
    composerDraft,
    setComposerDraft,
    submissionFeedback,
    setSubmissionFeedback,
    tasks,
    approvals,
    artifacts,
    notifications,
    laptopConnection,
    setLaptopConnection,
    submitTask,
    confirmTask,
    handleApprove,
    handleReject,
    unreadNotificationsCount,
    pendingApprovalsCount,
    fontFamilyPref,
    setFontFamilyPref,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
