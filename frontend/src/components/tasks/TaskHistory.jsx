import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TaskCard from './TaskCard';
import TaskTimeline from './TaskTimeline';
import EmptyState from '../common/EmptyState';
import { ListTodo, CheckCircle2, ShieldAlert, Cpu, AlertCircle } from 'lucide-react';

export default function TaskHistory() {
  const {
    tasks,
    selectedTask,
    setSelectedTask,
    setActiveTab,
    isDemoMode,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') {
      return ['pending_confirmation', 'confirmed', 'validating', 'executing', 'verifying'].includes(task.status);
    }
    if (activeFilter === 'needs_approval') {
      return task.status === 'awaiting_approval';
    }
    if (activeFilter === 'completed') {
      return task.status === 'completed';
    }
    if (activeFilter === 'failed') {
      return ['failed', 'rejected', 'cancelled'].includes(task.status);
    }
    return true;
  });

  const filterTabs = [
    { id: 'all', label: 'All', count: tasks.length },
    {
      id: 'active',
      label: 'Active',
      count: tasks.filter(t => ['pending_confirmation', 'confirmed', 'validating', 'executing', 'verifying'].includes(t.status)).length,
    },
    {
      id: 'needs_approval',
      label: 'Approvals',
      count: tasks.filter(t => t.status === 'awaiting_approval').length,
    },
    {
      id: 'completed',
      label: 'Done',
      count: tasks.filter(t => t.status === 'completed').length,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Filter Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        {filterTabs.map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className="btn btn-sm"
              style={{
                backgroundColor: isSelected ? 'var(--mira-bronze)' : 'var(--mira-surface)',
                color: isSelected ? '#FFFFFF' : 'var(--mira-text-primary)',
                borderColor: isSelected ? 'var(--mira-bronze)' : 'var(--mira-surface-secondary)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
              }}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  style={{
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'var(--mira-surface-secondary)',
                    color: isSelected ? '#FFFFFF' : 'var(--mira-text-secondary)',
                    borderRadius: 'var(--radius-full)',
                    padding: '1px 6px',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tasks List or Empty State */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title={isDemoMode ? "No tasks matching filter" : "No workstation tasks yet"}
          description={
            isDemoMode
              ? "Try switching to another filter tab or submit a new task in the Assistant tab."
              : "When you submit requests to your Windows laptop through MIRA, real execution milestones and verification states will be tracked here."
          }
          actionLabel="Submit a Task in Assistant"
          onAction={() => setActiveTab('assistant')}
        />
      ) : (
        <div>
          {filteredTasks.map((task) => (
            <TaskCard key={task.task_id} task={task} onSelect={setSelectedTask} />
          ))}
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskTimeline
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onNavigateApprovals={() => setActiveTab('approvals')}
          onNavigateArtifacts={() => setActiveTab('artifacts')}
        />
      )}
    </div>
  );
}
