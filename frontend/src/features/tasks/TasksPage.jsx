import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  Search, 
  Plus, 
  FolderCheck, 
  ShieldAlert, 
  RotateCcw, 
  Clock, 
  ChevronRight,
  Smartphone,
  SlidersHorizontal
} from 'lucide-react';

const FILTER_TABS = [
  { id: 'all', label: 'All Tasks' },
  { id: 'active', label: 'In Flight' },
  { id: 'awaiting_approval', label: 'Awaiting Approval' },
  { id: 'completed', label: 'Completed' },
  { id: 'failed', label: 'Failed' },
  { id: 'offline', label: 'Offline' },
  { id: 'unable_to_verify', label: 'Unable to Verify' }
];

export const TasksPage = () => {
  const { 
    tasks, 
    statusFilter, 
    setStatusFilter, 
    searchQuery, 
    setSearchQuery, 
    openTaskDetails, 
    openArtifactViewer,
    setActiveApprovalTaskId,
    retryTask,
    setIsComposerOpen 
  } = useApp();

  const filteredTasks = tasks.filter(task => {
    // Status Filter
    if (statusFilter === 'active') {
      if (!['waiting', 'processing', 'pending_confirmation', 'confirmed', 'validating', 'awaiting_approval', 'executing', 'verifying'].includes(task.status)) {
        return false;
      }
    } else if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(q);
      const matchPrompt = task.user_prompt?.toLowerCase().includes(q);
      const matchTool = task.tool_name?.toLowerCase().includes(q);
      const matchId = task.task_id?.toLowerCase().includes(q);
      return matchTitle || matchPrompt || matchTool || matchId;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="serif-heading" style={{ fontSize: '1.9rem', marginBottom: '4px' }}>
            Task Lifecycle &amp; Orchestration
          </h1>
          <p style={{ color: 'var(--color-espresso-secondary)', fontSize: '14px' }}>
            Inspect, authorize, and verify end-to-end task flows across Phone 2, MIRA Backend, and Windows FastMCP.
          </p>
        </div>

        <button
          type="button"
          className="mira-btn mira-btn-primary"
          onClick={() => setIsComposerOpen(true)}
        >
          <Plus size={16} />
          <span>New Task (Phone 2)</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="porcelain-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          {/* Status Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {FILTER_TABS.map(tab => {
              const count = tab.id === 'all' 
                ? tasks.length 
                : tab.id === 'active' 
                ? tasks.filter(t => ['waiting', 'processing', 'pending_confirmation', 'confirmed', 'validating', 'awaiting_approval', 'executing', 'verifying'].includes(t.status)).length
                : tasks.filter(t => t.status === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`mira-btn mira-btn-sm ${statusFilter === tab.id ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
                  style={{ fontWeight: statusFilter === tab.id ? 700 : 500 }}
                  onClick={() => setStatusFilter(tab.id)}
                >
                  <span>{tab.label}</span>
                  <span style={{ 
                    fontSize: '10.5px', 
                    padding: '1px 6px', 
                    borderRadius: 'var(--radius-full)', 
                    backgroundColor: statusFilter === tab.id ? 'var(--color-gold)' : 'var(--color-linen)',
                    color: statusFilter === tab.id ? '#FFFFFF' : 'var(--color-espresso)'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            minWidth: '240px'
          }}>
            <Search size={15} color="var(--color-espresso-muted)" />
            <input
              type="text"
              placeholder="Search tasks, tools, or UUID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '13px',
                width: '100%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredTasks.length === 0 ? (
          <div className="porcelain-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Layers size={36} color="var(--color-espresso-faint)" style={{ margin: '0 auto 12px' }} />
            <h3 className="serif-heading" style={{ fontSize: '1.25rem', marginBottom: '6px' }}>No Tasks Match Filter</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-espresso-muted)', maxWidth: '400px', margin: '0 auto 18px' }}>
              No tasks matched your current filter selection. Try changing filters or compose a new task.
            </p>
            <button
              type="button"
              className="mira-btn mira-btn-primary mira-btn-sm"
              onClick={() => setIsComposerOpen(true)}
            >
              <Plus size={14} />
              Create Task Now
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            let badgeClass = "badge-pending";
            if (task.status === 'completed') badgeClass = "badge-completed";
            else if (task.status === 'awaiting_approval') badgeClass = "badge-approval";
            else if (task.status === 'executing') badgeClass = "badge-executing";
            else if (task.status === 'verifying') badgeClass = "badge-verifying";
            else if (['failed', 'offline', 'unable_to_verify'].includes(task.status)) badgeClass = "badge-failed";

            return (
              <div 
                key={task.task_id} 
                className="porcelain-card"
                style={{ 
                  padding: '20px 24px',
                  borderLeft: task.status === 'awaiting_approval' 
                    ? '4px solid var(--color-warning)' 
                    : task.status === 'completed'
                    ? '4px solid var(--color-success)'
                    : ['failed', 'offline', 'unable_to_verify'].includes(task.status)
                    ? '4px solid var(--color-error)'
                    : '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className={`badge ${badgeClass}`}>
                        {task.status.replace(/_/g, ' ')}
                      </span>

                      <span className={`badge ${task.risk_level === 'high' ? 'badge-approval' : 'badge-pending'}`} style={{ fontSize: '10.5px' }}>
                        {task.risk_level.toUpperCase()} RISK
                      </span>

                      <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-muted)' }}>
                        Stage {task.current_stage_index + 1}/10
                      </span>

                      <span style={{ fontSize: '11.5px', color: 'var(--color-gold-hover)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Smartphone size={12} />
                        {task.source_device}
                      </span>
                    </div>

                    <h3 
                      className="serif-heading" 
                      style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                      onClick={() => openTaskDetails(task.task_id)}
                    >
                      {task.title}
                    </h3>

                    <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--color-espresso-secondary)', marginTop: '4px' }}>
                      “{task.user_prompt}”
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {task.status === 'awaiting_approval' && (
                      <button
                        type="button"
                        className="mira-btn mira-btn-primary mira-btn-sm"
                        onClick={() => setActiveApprovalTaskId(task.task_id)}
                      >
                        <ShieldAlert size={14} />
                        <span>Authorize Action</span>
                      </button>
                    )}

                    {['failed', 'offline', 'unable_to_verify'].includes(task.status) && (
                      <button
                        type="button"
                        className="mira-btn mira-btn-outline mira-btn-sm"
                        onClick={() => retryTask(task.task_id)}
                      >
                        <RotateCcw size={14} />
                        <span>Retry</span>
                      </button>
                    )}

                    {task.artifact && (
                      <button
                        type="button"
                        className="mira-btn mira-btn-secondary mira-btn-sm"
                        onClick={() => openArtifactViewer(task.artifact)}
                      >
                        <FolderCheck size={14} color="var(--color-success)" />
                        <span>View Artifact</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="mira-btn mira-btn-outline mira-btn-sm"
                      onClick={() => openTaskDetails(task.task_id)}
                    >
                      <span>10-Stage Timeline</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Technical Meta Strip */}
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span>
                      <strong style={{ color: 'var(--color-espresso)' }}>Target Tool:</strong>{' '}
                      <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold-hover)' }}>{task.tool_name}</code>
                    </span>
                    <span>
                      <strong style={{ color: 'var(--color-espresso)' }}>Workstation Host:</strong>{' '}
                      {task.target_device}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {task.verification?.status === 'verified' && (
                      <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                        ✓ Cryptographic SHA-256 Verified
                      </span>
                    )}
                    {task.error && (
                      <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>
                        Diagnostic: {task.error.code}
                      </span>
                    )}
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-muted)' }}>
                      ID: {task.task_id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
