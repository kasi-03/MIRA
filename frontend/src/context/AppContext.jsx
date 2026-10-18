import React, { createContext, useContext, useState } from 'react';
import { 
  INITIAL_DEVICES, 
  INITIAL_TASKS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_INTEGRATIONS,
  SUGGESTED_TASKS,
  SAMPLE_POSTER_SVG,
  WORKFLOW_STAGES,
  VISUAL_STATES
} from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Navigation & Viewport Mode
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile' (Phone 1)
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'tasks', 'output', 'connectivity', 'notifications', 'settings'
  
  // Core Entities (Pure Local Mock State)
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [suggestedTasks] = useState(SUGGESTED_TASKS);
  
  // Interactive Dialogs & Focus Targets
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [activeConfirmationTaskId, setActiveConfirmationTaskId] = useState(null);
  const [activeApprovalTaskId, setActiveApprovalTaskId] = useState(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Filter & Search Controls
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // User Settings
  const [settings, setSettings] = useState({
    userName: "Alex Sterling",
    userId: "usr-alex-sterling-01",
    theme: "warm_ivory",
    notificationsEnabled: true,
    soundEffects: true,
    approvalTtlSeconds: 180,
    autoConfirmLowRisk: false,
    workspaceGuardPath: "C:\\mira\\workspace\\",
    liveScreenStreamingProhibited: true,
    phone1Notifications: true
  });

  // Derived selected entities
  const selectedTask = tasks.find(t => t.task_id === selectedTaskId) || null;
  const selectedDevice = devices.find(d => d.device_id === selectedDeviceId) || null;
  const activeApprovalTask = tasks.find(t => t.task_id === activeApprovalTaskId) || null;
  const activeConfirmationTask = tasks.find(t => t.task_id === activeConfirmationTaskId) || null;

  // Counts
  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingApprovalsCount = tasks.filter(t => t.status === 'awaiting_approval').length;

  // Toast Helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Dialog Controls
  const openTaskDetails = (taskId) => setSelectedTaskId(taskId);
  const closeTaskDetails = () => setSelectedTaskId(null);

  const openArtifactViewer = (artifact) => setSelectedArtifact(artifact);
  const closeArtifactViewer = () => setSelectedArtifact(null);

  const openDeviceDetails = (deviceId) => setSelectedDeviceId(deviceId);
  const closeDeviceDetails = () => setSelectedDeviceId(null);

  // Workflow State Switcher in Demo Mode
  const setTaskWorkflowState = (taskId, targetState) => {
    setTasks(prev => prev.map(t => {
      if (t.task_id !== taskId) return t;

      let stageIdx = 0;
      switch (targetState) {
        case 'waiting': stageIdx = 0; break;
        case 'processing': stageIdx = 2; break;
        case 'pending_confirmation': stageIdx = 1; break;
        case 'awaiting_approval': stageIdx = 4; break;
        case 'executing': stageIdx = 5; break;
        case 'verifying': stageIdx = 7; break;
        case 'completed': stageIdx = 9; break;
        case 'failed': stageIdx = 5; break;
        case 'offline': stageIdx = 5; break;
        case 'unable_to_verify': stageIdx = 7; break;
        default: stageIdx = t.current_stage_index;
      }

      return {
        ...t,
        status: targetState,
        current_stage_index: stageIdx,
        completed_at: targetState === 'completed' ? new Date().toISOString() : null
      };
    }));
    showToast(`Task status switched to: ${targetState.replace(/_/g, ' ')}`);
  };

  // 1. Task Submission (Step 1)
  const submitNewTask = ({ prompt, title, riskLevel = 'low', toolName = 'generate_svg_poster', toolParams = {} }) => {
    const newTaskId = `task-${Date.now().toString(16)}`;
    const nowIso = new Date().toISOString();
    const timeStr = new Date().toTimeString().split(' ')[0];

    const newTask = {
      task_id: newTaskId,
      title: title || (prompt.slice(0, 48) + "..."),
      user_prompt: prompt,
      interpreted_intent: `Invoke tool \`${toolName}\` on Windows Workstation.`,
      status: "pending_confirmation",
      risk_level: riskLevel,
      created_at: nowIso,
      completed_at: null,
      source_device: "Phone 2 — Alexa Companion",
      target_device: "Windows Laptop",
      current_stage_index: 1, // Confirm Intent
      tool_name: toolName,
      tool_params: toolParams,
      verification: null,
      artifact: null,
      events: [
        { time: timeStr, stage: "1. Speak or Type", description: "Prompt submitted via Alexa Companion." },
        { time: timeStr, stage: "2. Confirm Intent", description: `Parsed intent: ${toolName}. Awaiting confirmation.` }
      ]
    };

    setTasks(prev => [newTask, ...prev]);
    setIsComposerOpen(false);

    if (!settings.autoConfirmLowRisk || riskLevel === 'high') {
      setActiveConfirmationTaskId(newTaskId);
    } else {
      confirmTask(newTaskId);
    }

    showToast("Task submitted via Phone 2 Companion");
    return newTaskId;
  };

  // 2. Intent Confirmation (Step 2)
  const confirmTask = (taskId) => {
    setActiveConfirmationTaskId(null);
    const timeStr = new Date().toTimeString().split(' ')[0];

    setTasks(prev => prev.map(t => {
      if (t.task_id !== taskId) return t;

      const isHighRisk = t.risk_level === 'high';
      const updatedEvents = [
        ...t.events,
        { time: timeStr, stage: "2. Confirm Intent", description: "User confirmed interpreted plan." },
        { time: timeStr, stage: "3. Process Request", description: "Dispatched to backend policy engine." }
      ];

      if (isHighRisk) {
        const expiresAt = new Date(Date.now() + settings.approvalTtlSeconds * 1000).toISOString();
        const approvalTicket = {
          approval_id: `appr-${Date.now().toString(16)}`,
          expires_at: expiresAt,
          ttl_seconds: settings.approvalTtlSeconds,
          risk_level: "high",
          action_summary: `Execute high-impact operation: ${t.tool_name}`,
          justification: "Operation could alter system or workstation configuration. Explicit user authorization required.",
          requested_by: `${settings.userName} (${settings.userId})`
        };

        const notif = {
          id: `notif-${Date.now()}`,
          title: "Approval Shield Activated",
          message: `Task '${t.title}' requires mobile authorization (180s countdown active).`,
          type: "approval",
          task_id: taskId,
          read: false,
          timestamp: timeStr,
          urgent: true
        };
        setNotifications(nPrev => [notif, ...nPrev]);
        setActiveApprovalTaskId(taskId);

        return {
          ...t,
          status: "awaiting_approval",
          current_stage_index: 4,
          approval_ticket: approvalTicket,
          events: [
            ...updatedEvents,
            { time: timeStr, stage: "5. Request Approval", description: "Approval Shield activated (180s TTL countdown)." }
          ]
        };
      }

      setTimeout(() => simulateExecutionPipeline(taskId), 800);

      return {
        ...t,
        status: "executing",
        current_stage_index: 5,
        events: [
          ...updatedEvents,
          { time: timeStr, stage: "4. Select Tools", description: "Tool selection cleared. Dispatched to Windows FastMCP." }
        ]
      };
    }));
  };

  // 3. Approval Action (Step 5)
  const approveTask = (taskId) => {
    setActiveApprovalTaskId(null);
    const timeStr = new Date().toTimeString().split(' ')[0];

    setTasks(prev => prev.map(t => {
      if (t.task_id !== taskId) return t;
      return {
        ...t,
        status: "executing",
        current_stage_index: 5,
        events: [
          ...t.events,
          { time: timeStr, stage: "5. Approval Granted", description: "Authorized by user on Phone 2." },
          { time: timeStr, stage: "6. Execute on Laptop", description: "Dispatched to FastMCP server with authorization token." }
        ]
      };
    }));

    showToast("Action approved. Dispatching to Windows Laptop...");
    setTimeout(() => simulateExecutionPipeline(taskId), 1000);
  };

  const rejectTask = (taskId, reason = "User rejected authorization") => {
    setActiveApprovalTaskId(null);
    const timeStr = new Date().toTimeString().split(' ')[0];

    setTasks(prev => prev.map(t => {
      if (t.task_id !== taskId) return t;
      return {
        ...t,
        status: "failed",
        events: [
          ...t.events,
          { time: timeStr, stage: "Approval Rejected", description: `Task aborted by user: ${reason}` }
        ]
      };
    }));
    showToast("Action rejected. Task aborted.");
  };

  // 4. Execution & Verification Simulation
  const simulateExecutionPipeline = (taskId) => {
    const timeStr = new Date().toTimeString().split(' ')[0];

    // Stage 7 -> 8: MCP Tool Activity & Verification
    setTasks(prev => prev.map(t => {
      if (t.task_id !== taskId) return t;
      return {
        ...t,
        status: "verifying",
        current_stage_index: 7,
        events: [
          ...t.events,
          { time: timeStr, stage: "7. MCP Tool Activity", description: "Tool executed within C:\\mira\\workspace\\." },
          { time: timeStr, stage: "8. Verify Outcome", description: "Backend calculating SHA-256 and validating document structure." }
        ]
      };
    }));

    // Stage 9 -> 10: Complete
    setTimeout(() => {
      const completionTime = new Date().toTimeString().split(' ')[0];
      const sampleArtifact = {
        id: `art-${taskId.slice(0, 8)}`,
        filename: `output_${taskId.slice(0, 8)}.svg`,
        type: "image/svg+xml",
        size: "28.4 KB",
        content: SAMPLE_POSTER_SVG,
        sha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
        local_path: `C:\\mira\\workspace\\tasks\\${taskId}\\output.svg`
      };

      setTasks(prev => prev.map(t => {
        if (t.task_id !== taskId) return t;
        return {
          ...t,
          status: "completed",
          completed_at: new Date().toISOString(),
          current_stage_index: 9,
          verification: {
            status: "verified",
            sha256: sampleArtifact.sha256,
            file_size_bytes: 28410,
            xml_structure_valid: true,
            script_injection_detected: false,
            verification_timestamp: new Date().toISOString()
          },
          artifact: sampleArtifact,
          events: [
            ...t.events,
            { time: completionTime, stage: "9. Display Result", description: "SHA-256 digest verified. Result delivered to Phone 2 and dashboard." },
            { time: completionTime, stage: "10. Complete Task", description: "Task completed successfully." }
          ]
        };
      }));

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: "Task Verified & Complete",
          message: "Workstation finished execution. Digital artifact verified and ready for download.",
          type: "success",
          task_id: taskId,
          read: false,
          timestamp: completionTime,
          urgent: false
        },
        ...prev
      ]);

      showToast("✓ Task verified and output ready!");
    }, 1600);
  };

  // Safe retry
  const retryTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.task_id !== taskId) return t;
      return {
        ...t,
        status: "executing",
        error: null,
        current_stage_index: 5,
        events: [
          ...t.events,
          { time: new Date().toTimeString().split(' ')[0], stage: "Retry Initiated", description: "Safe manual retry triggered by user." }
        ]
      };
    }));
    showToast("Retrying task execution...");
    setTimeout(() => simulateExecutionPipeline(taskId), 1000);
  };

  // Toggle Laptop Disconnect State
  const toggleLaptopStatus = () => {
    setDevices(prev => prev.map(d => {
      if (d.role !== 'windows_workstation') return d;
      const isOnline = d.status === 'online';
      return {
        ...d,
        status: isOnline ? 'offline' : 'online',
        last_seen: isOnline ? 'Disconnected' : 'Active now'
      };
    }));
    showToast("Workstation connection state toggled.");
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read.");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast("Notification history cleared.");
  };

  // Reset to initial demo dataset
  const resetDemoData = () => {
    setTasks(INITIAL_TASKS);
    setDevices(INITIAL_DEVICES);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast("Demo state reset to initial scenarios.");
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        tasks,
        devices,
        integrations,
        notifications,
        suggestedTasks,
        selectedTaskId,
        selectedTask,
        selectedArtifact,
        selectedDevice,
        activeApprovalTask,
        activeConfirmationTask,
        isComposerOpen,
        isProfileOpen,
        toastMessage,
        statusFilter,
        searchQuery,
        settings,
        unreadCount,
        pendingApprovalsCount,
        openTaskDetails,
        closeTaskDetails,
        openArtifactViewer,
        closeArtifactViewer,
        openDeviceDetails,
        closeDeviceDetails,
        setIsComposerOpen,
        setIsProfileOpen,
        setActiveApprovalTaskId,
        setActiveConfirmationTaskId,
        setStatusFilter,
        setSearchQuery,
        setSettings,
        setTaskWorkflowState,
        submitNewTask,
        confirmTask,
        approveTask,
        rejectTask,
        retryTask,
        toggleLaptopStatus,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        resetDemoData,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
