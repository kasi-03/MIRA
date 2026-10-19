import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSpeechInput } from '../../hooks/useSpeechInput';
import { 
  Sparkles, 
  Send, 
  Mic, 
  Layers, 
  ShieldAlert, 
  FolderCheck, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Laptop, 
  Smartphone, 
  Server, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Radio
} from 'lucide-react';

export const DashboardPage = () => {
  const { 
    tasks, 
    devices, 
    suggestedTasks,
    pendingApprovalsCount, 
    openTaskDetails, 
    openArtifactViewer, 
    openDeviceDetails,
    setActiveApprovalTaskId, 
    setIsComposerOpen,
    submitNewTask,
    setActiveTab,
    showToast
  } = useApp();

  const [quickInput, setQuickInput] = useState('');

  const {
    isListening: isVoiceActive,
    isSupported: isSpeechSupported,
    toggleListening: toggleVoiceListening
  } = useSpeechInput({
    onTranscript: (liveText) => {
      setQuickInput(liveText);
    },
    onError: (errMsg) => {
      if (showToast) showToast(errMsg);
    }
  });

  const activeTasks = tasks.filter(t => ['waiting', 'processing', 'pending_confirmation', 'confirmed', 'validating', 'awaiting_approval', 'executing', 'verifying'].includes(t.status));
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const awaitingApprovalTasks = tasks.filter(t => t.status === 'awaiting_approval');
  
  const laptop = devices.find(d => d.role === 'windows_workstation');
  const phone2 = devices.find(d => d.role === 'phone_primary');
  const backend = devices.find(d => d.role === 'backend_orchestrator');
  const phone1 = devices.find(d => d.role === 'phone_secondary_optional');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    submitNewTask({
      prompt: quickInput.trim(),
      toolName: 'generate_svg_poster',
      riskLevel: 'low'
    });
    setQuickInput('');
  };

  const handleSelectSuggested = (suggested) => {
    submitNewTask({
      prompt: suggested.prompt,
      title: suggested.title,
      riskLevel: suggested.risk,
      toolName: suggested.tool
    });
  };

  const handleVoiceClick = () => {
    if (!isSpeechSupported) {
      if (showToast) showToast("Web Speech API not supported in this browser. Inserted voice sample.");
      setQuickInput("Generate an event poster for AI Summit 2026 with emerald and champagne gold accents.");
      return;
    }
    const started = toggleVoiceListening((liveText) => {
      setQuickInput(liveText);
    });
    if (started && showToast) {
      showToast("Listening... Speak into your microphone.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Welcome & Task Composer */}
      <div className="porcelain-card highlight" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F1 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-hover)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              <Sparkles size={14} />
              AI Workflow Companion
            </div>
            <h1 className="serif-heading" style={{ fontSize: '1.95rem', marginBottom: '6px' }}>
              MIRA Command Center
            </h1>
            <p style={{ color: 'var(--color-espresso-secondary)', maxWidth: '640px', fontSize: '14px' }}>
              Say it once. Let MIRA carry it through. Voice input on Phone 2 orchestrates verified execution on your Windows laptop.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="mira-btn mira-btn-secondary mira-btn-sm"
              onClick={() => setActiveTab('connectivity')}
            >
              <Radio size={14} />
              Fleet Status
            </button>
            <button
              type="button"
              className="mira-btn mira-btn-primary mira-btn-sm"
              onClick={() => setIsComposerOpen(true)}
            >
              <Mic size={14} />
              Task Composer
            </button>
          </div>
        </div>

        {/* Inline Task Composer Box */}
        <form onSubmit={handleQuickSubmit}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: isVoiceActive ? '2px solid var(--color-gold)' : '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 8px 6px 16px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all 0.2s ease',
            gap: '8px'
          }}>
            <button
              type="button"
              onClick={handleVoiceClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isVoiceActive ? 'var(--color-gold)' : 'var(--color-linen)',
                color: isVoiceActive ? '#FFFFFF' : 'var(--color-gold-hover)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={isVoiceActive ? "Click to stop listening" : "Speak via Phone 2 Alexa microphone"}
            >
              <Mic size={16} />
            </button>

            <input
              type="text"
              placeholder={isVoiceActive ? "Listening to your microphone... Speak now..." : "Speak or type: 'Alexa, tell MIRA to generate an event poster for AI Summit 2026'..."}
              value={quickInput}
              onChange={e => setQuickInput(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14.5px',
                color: 'var(--color-espresso)'
              }}
            />

            {isVoiceActive && (
              <div className="voice-wave-container" style={{ marginRight: '8px' }}>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            )}

            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="mira-btn mira-btn-primary"
              style={{ padding: '8px 18px' }}
            >
              <Send size={15} />
              <span>Dispatch</span>
            </button>
          </div>
        </form>
      </div>

      {/* Suggested Task Cards */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Lightbulb size={16} color="var(--color-gold-hover)" />
          <h3 className="serif-heading" style={{ fontSize: '1.15rem' }}>
            Suggested Workflow Demonstrations
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--color-espresso-muted)' }}>
            (Click to simulate end-to-end task journey)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {suggestedTasks.map(s => (
            <div
              key={s.id}
              onClick={() => handleSelectSuggested(s)}
              className="porcelain-card"
              style={{
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-gold-hover)', textTransform: 'uppercase' }}>
                    {s.category}
                  </span>
                  <span className={`badge ${s.risk === 'high' ? 'badge-approval' : 'badge-pending'}`} style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                    {s.risk} risk
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--color-espresso-muted)', lineHeight: '1.4' }}>
                  “{s.prompt.slice(0, 58)}...”
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '10px', color: 'var(--color-gold-hover)', fontSize: '11px', fontWeight: 600 }}>
                <span>Run Demo Flow</span>
                <ChevronRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="dashboard-grid">
        <div className="col-3">
          <div className="porcelain-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase' }}>
                Active Tasks
              </span>
              <div className="card-icon-bubble" style={{ width: '32px', height: '32px' }}>
                <Layers size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-espresso)', fontFamily: 'var(--font-serif)' }}>
              {activeTasks.length}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-gold-hover)', marginTop: '4px' }}>
              Coordinating across pipeline
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className={`porcelain-card ${pendingApprovalsCount > 0 ? 'warning' : ''}`} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase' }}>
                Approvals Needed
              </span>
              <div className="card-icon-bubble" style={{ 
                width: '32px', 
                height: '32px', 
                backgroundColor: pendingApprovalsCount > 0 ? 'var(--color-warning-bg)' : 'var(--color-gold-light)',
                color: pendingApprovalsCount > 0 ? 'var(--color-warning)' : 'var(--color-gold)'
              }}>
                <ShieldAlert size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: pendingApprovalsCount > 0 ? 'var(--color-warning)' : 'var(--color-espresso)', fontFamily: 'var(--font-serif)' }}>
              {pendingApprovalsCount}
            </div>
            <div style={{ fontSize: '11.5px', color: pendingApprovalsCount > 0 ? 'var(--color-warning)' : 'var(--color-espresso-muted)', marginTop: '4px' }}>
              {pendingApprovalsCount > 0 ? '180s Countdown active!' : 'All policies clear'}
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="porcelain-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase' }}>
                Verified Outputs
              </span>
              <div className="card-icon-bubble" style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                <FolderCheck size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-espresso)', fontFamily: 'var(--font-serif)' }}>
              {completedTasks.length}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-success)', marginTop: '4px' }}>
              ✓ SHA-256 Checksums match
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="porcelain-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase' }}>
                Windows Workstation
              </span>
              <div className="card-icon-bubble" style={{ width: '32px', height: '32px' }}>
                <Cpu size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-espresso)', fontFamily: 'var(--font-serif)' }}>
              {laptop?.cpu_usage || 18}%
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-espresso-muted)', marginTop: '4px' }}>
              FastMCP Server :8000
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Approval Shield Alert Banner if applicable */}
      {awaitingApprovalTasks.length > 0 && (
        <div className="porcelain-card warning" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-subtle)'
              }}>
                <ShieldAlert size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-espresso)' }}>
                  Approval Shield Activated: {awaitingApprovalTasks[0].title}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--color-espresso-secondary)' }}>
                  A high-impact workstation script execution requires mobile authorization within the 180s window.
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mira-btn mira-btn-primary"
              onClick={() => setActiveApprovalTaskId(awaitingApprovalTasks[0].task_id)}
            >
              <Clock size={15} />
              Review &amp; Authorize Ticket
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Active Pipeline & Device Connectivity */}
      <div className="dashboard-grid">
        {/* Left Column: Active Tasks & Recent Outputs */}
        <div className="col-8" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="porcelain-card">
            <div className="card-header-bar">
              <div className="card-title-group">
                <div className="card-icon-bubble">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="serif-heading">Active Task Orchestration</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                    Phone 2 Alexa Voice → MIRA Backend → Windows FastMCP Pipeline
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mira-btn-outline mira-btn-sm"
                onClick={() => setActiveTab('tasks')}
              >
                <span>View All ({tasks.length})</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Task Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.slice(0, 4).map(task => {
                let badgeClass = "badge-pending";
                if (task.status === 'completed') badgeClass = "badge-completed";
                else if (task.status === 'awaiting_approval') badgeClass = "badge-approval";
                else if (task.status === 'executing') badgeClass = "badge-executing";
                else if (task.status === 'verifying') badgeClass = "badge-verifying";
                else if (task.status === 'failed' || task.status === 'offline' || task.status === 'unable_to_verify') badgeClass = "badge-failed";

                return (
                  <div
                    key={task.task_id}
                    onClick={() => openTaskDetails(task.task_id)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.16s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border-light)'}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className={`badge ${badgeClass}`}>
                          {task.status.replace(/_/g, ' ')}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-espresso-muted)', fontFamily: 'var(--font-mono)' }}>
                          Stage {task.current_stage_index + 1}/10
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-gold-hover)' }}>
                          • {task.tool_name}
                        </span>
                      </div>

                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-espresso)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {task.title}
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--color-espresso-muted)', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        “{task.user_prompt}”
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {task.artifact && (
                        <button
                          type="button"
                          className="mira-btn mira-btn-secondary mira-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openArtifactViewer(task.artifact);
                          }}
                        >
                          <FolderCheck size={14} color="var(--color-success)" />
                          <span>View Artifact</span>
                        </button>
                      )}

                      {task.status === 'awaiting_approval' && (
                        <button
                          type="button"
                          className="mira-btn mira-btn-primary mira-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveApprovalTaskId(task.task_id);
                          }}
                        >
                          <ShieldAlert size={14} />
                          <span>Authorize</span>
                        </button>
                      )}

                      <ChevronRight size={16} color="var(--color-espresso-muted)" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest Verified Artifact Showcase */}
          {completedTasks[0]?.artifact && (
            <div className="porcelain-card success">
              <div className="card-header-bar">
                <div className="card-title-group">
                  <div className="card-icon-bubble" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                    <FolderCheck size={18} />
                  </div>
                  <div>
                    <h3 className="serif-heading">Latest Verified Artifact</h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                      Cryptographic SHA-256 and XML parser verified
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mira-btn mira-btn-secondary mira-btn-sm"
                  onClick={() => openArtifactViewer(completedTasks[0].artifact)}
                >
                  <ExternalLink size={14} />
                  Inspect Vector
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '16px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)'
              }}>
                <div 
                  style={{
                    width: '140px',
                    height: '180px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-card)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#FFFFFF',
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                  onClick={() => openArtifactViewer(completedTasks[0].artifact)}
                  dangerouslySetInnerHTML={{ __html: completedTasks[0].artifact.content }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-completed">
                      ✓ Verified Output
                    </span>
                    <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-muted)' }}>
                      {completedTasks[0].artifact.size}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '4px' }}>
                    {completedTasks[0].artifact.filename}
                  </h4>

                  <p style={{ fontSize: '12.5px', color: 'var(--color-espresso-secondary)', marginBottom: '10px' }}>
                    Produced by FastMCP tool <code>generate_svg_poster</code>. Confined within workspace <code>C:\mira\workspace\tasks\</code>.
                  </p>

                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--color-espresso-muted)',
                    border: '1px solid var(--color-border)'
                  }}>
                    SHA-256: {completedTasks[0].artifact.sha256}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Multi-Device Status & Architecture */}
        <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Device Fleet Cards */}
          <div className="porcelain-card">
            <div className="card-header-bar">
              <div className="card-title-group">
                <div className="card-icon-bubble">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h3 className="serif-heading">Connected Fleet</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                    Primary workflow &amp; optional nodes
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mira-btn-outline mira-btn-sm"
                onClick={() => setActiveTab('connectivity')}
              >
                Fleet
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Phone 2 */}
              <div 
                onClick={() => openDeviceDetails(phone2.device_id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--color-gold)',
                  backgroundColor: 'var(--color-gold-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--color-gold-light)',
                    color: 'var(--color-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-espresso)' }}>
                      Phone 2 (Alexa Companion)
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gold-hover)', fontWeight: 600 }}>
                      ★ Primary Interface
                    </div>
                  </div>
                </div>
                <span className="badge badge-completed" style={{ fontSize: '10px' }}>
                  Online
                </span>
              </div>

              {/* Backend */}
              <div 
                onClick={() => openDeviceDetails(backend.device_id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--color-linen)',
                    color: 'var(--color-espresso)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Server size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-espresso)' }}>
                      MIRA Backend / Agent
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-espresso-muted)' }}>
                      Coordination Layer
                    </div>
                  </div>
                </div>
                <span className="badge badge-completed" style={{ fontSize: '10px' }}>
                  Ready
                </span>
              </div>

              {/* Windows Laptop */}
              <div 
                onClick={() => openDeviceDetails(laptop.device_id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: laptop?.status === 'online' ? 'var(--color-gold-light)' : 'var(--color-error-bg)',
                    color: laptop?.status === 'online' ? 'var(--color-gold-hover)' : 'var(--color-error)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Laptop size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-espresso)' }}>
                      Windows Laptop
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-espresso-muted)' }}>
                      Execution Device :8000
                    </div>
                  </div>
                </div>
                <span className={`badge ${laptop?.status === 'online' ? 'badge-completed' : 'badge-failed'}`} style={{ fontSize: '10px' }}>
                  {laptop?.status === 'online' ? 'Connected' : 'Offline'}
                </span>
              </div>

              {/* Phone 1 Optional */}
              <div 
                onClick={() => openDeviceDetails(phone1.device_id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-espresso-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-espresso)' }}>
                      Phone 1 (Secondary)
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-espresso-muted)' }}>
                      Optional Dashboard (Not Required)
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--color-espresso-muted)', fontStyle: 'italic' }}>
                  Optional
                </span>
              </div>
            </div>
          </div>

          {/* Safety & Workspace Confinement Box */}
          <div className="porcelain-card" style={{ backgroundColor: 'var(--color-linen)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <CheckCircle2 size={18} color="var(--color-success)" />
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-espresso)' }}>
                Workspace Guard Active
              </h4>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-espresso-secondary)', lineHeight: '1.45', marginBottom: '10px' }}>
              Workstation operations are strictly confined within <code>C:\mira\workspace\</code>. Path traversal sequences (<code>..</code>) and raw system file modifications are blocked.
            </p>
            <div style={{ fontSize: '11.5px', color: 'var(--color-espresso-muted)', fontStyle: 'italic' }}>
              Zero Live Streaming • 180s Countdown Approval Shield
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
