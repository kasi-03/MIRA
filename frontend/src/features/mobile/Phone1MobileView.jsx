import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSpeechInput } from '../../hooks/useSpeechInput';
import { 
  Home, 
  Layers, 
  FolderCheck, 
  Radio, 
  Bell, 
  Sparkles, 
  Mic, 
  Send, 
  ShieldAlert, 
  Clock, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  Download, 
  Smartphone, 
  Laptop, 
  Server,
  Info,
  User,
  SlidersHorizontal,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

export const Phone1MobileView = () => {
  const { 
    tasks, 
    devices, 
    notifications, 
    suggestedTasks,
    unreadCount, 
    openTaskDetails, 
    openArtifactViewer, 
    openDeviceDetails,
    setActiveApprovalTaskId,
    setIsComposerOpen,
    setIsProfileOpen,
    submitNewTask,
    retryTask,
    markNotificationRead,
    showToast
  } = useApp();

  const [mobileTab, setMobileTab] = useState('home'); // 'home', 'tasks', 'output', 'devices', 'notifications'
  const [mobileFilter, setMobileFilter] = useState('all');
  const [mobileInput, setMobileInput] = useState('');

  const {
    isListening: isVoiceListening,
    isSupported: isSpeechSupported,
    toggleListening: toggleVoiceListening
  } = useSpeechInput({
    onTranscript: (liveText) => {
      setMobileInput(liveText);
    },
    onError: (errMsg) => {
      if (showToast) showToast(errMsg);
    }
  });

  const activeTasks = tasks.filter(t => ['waiting', 'processing', 'pending_confirmation', 'confirmed', 'validating', 'awaiting_approval', 'executing', 'verifying'].includes(t.status));
  const awaitingApproval = tasks.filter(t => t.status === 'awaiting_approval');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const laptop = devices.find(d => d.role === 'windows_workstation');
  const phone2 = devices.find(d => d.role === 'phone_primary');

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!mobileInput.trim()) return;
    submitNewTask({
      prompt: mobileInput.trim(),
      toolName: 'generate_svg_poster',
      riskLevel: 'low'
    });
    setMobileInput('');
  };

  const handleVoiceTap = () => {
    if (!isSpeechSupported) {
      if (showToast) showToast("Web Speech API not supported in this browser. Inserted voice sample.");
      setMobileInput("Generate an event poster for AI Summit 2026 with emerald and champagne gold accents.");
      return;
    }
    const started = toggleVoiceListening((liveText) => {
      setMobileInput(liveText);
    });
    if (started && showToast) {
      showToast("Listening... Speak into mobile microphone.");
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      backgroundColor: 'var(--color-bg)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-card)',
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--color-border)'
    }}>
      {/* Compact Mobile Header (Without simulated OS battery/time/signal bar) */}
      <div style={{
        padding: '14px 18px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="brand-logo-gem" style={{ width: '30px', height: '30px' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '15px', color: 'var(--color-espresso)', lineHeight: 1.1 }}>
              MIRA
            </div>
            <div style={{ fontSize: '9.5px', color: 'var(--color-gold-hover)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Phone 1 Dashboard
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="card-icon-bubble"
            style={{ width: '32px', height: '32px', position: 'relative' }}
            onClick={() => setMobileTab('notifications')}
            title="Alerts"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', backgroundColor: 'var(--color-gold)', borderRadius: '50%' }} />
            )}
          </button>

          <button
            type="button"
            className="card-icon-bubble"
            style={{ width: '32px', height: '32px' }}
            onClick={() => setIsProfileOpen(true)}
            title="Profile & Authority"
          >
            <User size={15} />
          </button>
        </div>
      </div>

      {/* Mobile Content Scroll Body */}
      <div style={{
        flex: 1,
        padding: '16px 16px calc(var(--mobile-bottom-nav-height) + 24px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Optional Secondary Monitor Notification */}
        <div style={{
          padding: '8px 12px',
          backgroundColor: 'var(--color-linen)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '11px',
          color: 'var(--color-espresso-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid var(--color-border)'
        }}>
          <Info size={14} color="var(--color-gold-hover)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Phone 1 (Secondary Monitor):</strong> Optional remote dashboard. Primary voice workflow operates via Phone 2.
          </span>
        </div>

        {/* =========================================================================
            TAB 1: MOBILE HOME
            ========================================================================= */}
        {mobileTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Elegant Serif Greeting */}
            <div>
              <h2 className="serif-heading" style={{ fontSize: '1.45rem', marginBottom: '2px' }}>
                Good evening, Alex
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                Say it once. Let MIRA carry it through.
              </p>
            </div>

            {/* Rounded Command-Center Card & Task Composer */}
            <div className="porcelain-card highlight" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-gold-hover)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Quick Task Composer
              </div>

              <form onSubmit={handleMobileSubmit}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  padding: '4px 6px 4px 12px',
                  border: isVoiceListening ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-subtle)',
                  gap: '6px'
                }}>
                  <button
                    type="button"
                    onClick={handleVoiceTap}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isVoiceListening ? 'var(--color-gold)' : 'var(--color-linen)',
                      color: isVoiceListening ? '#FFFFFF' : 'var(--color-gold-hover)',
                      cursor: 'pointer'
                    }}
                    title={isVoiceListening ? "Click to stop listening" : "Click to speak via mobile microphone"}
                  >
                    <Mic size={14} />
                  </button>

                  <input
                    type="text"
                    placeholder={isVoiceListening ? "Listening to mobile microphone... Speak now..." : "Ask MIRA or request task..."}
                    value={mobileInput}
                    onChange={e => setMobileInput(e.target.value)}
                    style={{ flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: '13px', color: 'var(--color-espresso)' }}
                  />

                  <button
                    type="submit"
                    disabled={!mobileInput.trim()}
                    className="mira-btn mira-btn-primary mira-btn-sm"
                    style={{ padding: '6px 12px' }}
                  >
                    <Send size={13} />
                  </button>
                </div>
              </form>
            </div>

            {/* Urgent Approval Banner */}
            {awaitingApproval.length > 0 && (
              <div 
                className="porcelain-card warning"
                style={{ padding: '14px', backgroundColor: 'var(--color-warning-bg)', cursor: 'pointer' }}
                onClick={() => setActiveApprovalTaskId(awaitingApproval[0].task_id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '12.5px', color: 'var(--color-warning)' }}>
                    <ShieldAlert size={15} />
                    Approval Shield Active
                  </div>
                  <span className="countdown-timer-chip" style={{ fontSize: '11px', padding: '1px 6px' }}>
                    180s TTL
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--color-espresso)', fontWeight: 600 }}>
                  {awaitingApproval[0].title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-espresso-muted)', marginTop: '2px' }}>
                  Tap to authorize consequential script.
                </div>
              </div>
            )}

            {/* Suggested Tasks */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-espresso)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lightbulb size={13} color="var(--color-gold-hover)" />
                Suggested Tasks
              </div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {suggestedTasks.slice(0, 3).map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      submitNewTask({
                        prompt: s.prompt,
                        title: s.title,
                        riskLevel: s.risk,
                        toolName: s.tool
                      });
                    }}
                    style={{
                      minWidth: '170px',
                      padding: '10px 12px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <div style={{ fontSize: '10px', color: 'var(--color-gold-hover)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {s.category}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso)', marginTop: '2px' }}>
                      {s.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Fleet Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="porcelain-card" style={{ padding: '12px' }} onClick={() => openDeviceDetails(phone2.device_id)}>
                <div style={{ fontSize: '10.5px', color: 'var(--color-espresso-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Phone 2 (Primary)
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-espresso)', marginTop: '2px' }}>
                  Alexa Listening
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-success)', marginTop: '2px' }}>
                  ● Connected
                </div>
              </div>

              <div className="porcelain-card" style={{ padding: '12px' }} onClick={() => openDeviceDetails(laptop.device_id)}>
                <div style={{ fontSize: '10.5px', color: 'var(--color-espresso-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Windows Laptop
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-espresso)', marginTop: '2px' }}>
                  FastMCP :8000
                </div>
                <div style={{ fontSize: '10px', color: laptop?.status === 'online' ? 'var(--color-success)' : 'var(--color-error)', marginTop: '2px' }}>
                  ● {laptop?.status === 'online' ? 'Ready' : 'Offline'}
                </div>
              </div>
            </div>

            {/* In-Flight Tasks Summary */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-espresso)', textTransform: 'uppercase' }}>
                  In-Flight Pipeline ({activeTasks.length})
                </span>
                <button
                  type="button"
                  style={{ fontSize: '11px', color: 'var(--color-gold-hover)', fontWeight: 600 }}
                  onClick={() => setMobileTab('tasks')}
                >
                  View All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tasks.slice(0, 3).map(task => (
                  <div
                    key={task.task_id}
                    onClick={() => openTaskDetails(task.task_id)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className={`badge ${task.status === 'completed' ? 'badge-completed' : task.status === 'awaiting_approval' ? 'badge-approval' : ['failed', 'offline', 'unable_to_verify'].includes(task.status) ? 'badge-failed' : 'badge-pending'}`} style={{ fontSize: '9.5px' }}>
                        {task.status.replace(/_/g, ' ')}
                      </span>
                      <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-muted)' }}>
                        Stage {task.current_stage_index + 1}/10
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-espresso)' }}>
                      {task.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Output Banner */}
            {completedTasks[0]?.artifact && (
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-espresso)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Verified Output
                </div>
                <div 
                  className="porcelain-card success"
                  style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onClick={() => openArtifactViewer(completedTasks[0].artifact)}
                >
                  <div 
                    style={{ width: '48px', height: '64px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', flexShrink: 0 }}
                    dangerouslySetInnerHTML={{ __html: completedTasks[0].artifact.content }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--color-espresso)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {completedTasks[0].artifact.filename}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-success)', fontWeight: 600, marginTop: '2px' }}>
                      ✓ SHA-256 Verified
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-espresso-muted)' }}>
                      {completedTasks[0].artifact.size} • Tap to view vector
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: MOBILE TASKS
            ========================================================================= */}
        {mobileTab === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 className="serif-heading" style={{ fontSize: '1.35rem' }}>
              Tasks &amp; Lifecycle
            </h2>

            {/* Mobile Filter Chips */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['all', 'active', 'awaiting_approval', 'completed', 'failed'].map(f => (
                <button
                  key={f}
                  type="button"
                  className={`mira-btn mira-btn-sm ${mobileFilter === f ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
                  style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                  onClick={() => setMobileFilter(f)}
                >
                  {f.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.filter(t => {
                if (mobileFilter === 'active') return ['waiting', 'processing', 'pending_confirmation', 'confirmed', 'validating', 'awaiting_approval', 'executing', 'verifying'].includes(t.status);
                if (mobileFilter === 'failed') return ['failed', 'offline', 'unable_to_verify'].includes(t.status);
                if (mobileFilter !== 'all') return t.status === mobileFilter;
                return true;
              }).map(task => (
                <div
                  key={task.task_id}
                  className="porcelain-card"
                  style={{ padding: '14px', cursor: 'pointer' }}
                  onClick={() => openTaskDetails(task.task_id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className={`badge ${task.status === 'completed' ? 'badge-completed' : task.status === 'awaiting_approval' ? 'badge-approval' : ['failed', 'offline', 'unable_to_verify'].includes(task.status) ? 'badge-failed' : 'badge-pending'}`} style={{ fontSize: '9.5px' }}>
                      {task.status.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-muted)' }}>
                      Stage {task.current_stage_index + 1}/10
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-espresso)' }}>
                    {task.title}
                  </div>

                  <div style={{ fontSize: '11.5px', fontStyle: 'italic', color: 'var(--color-espresso-muted)', marginTop: '4px' }}>
                    “{task.user_prompt}”
                  </div>

                  {task.status === 'awaiting_approval' && (
                    <div style={{ marginTop: '10px' }}>
                      <button
                        type="button"
                        className="mira-btn mira-btn-primary mira-btn-sm"
                        style={{ width: '100%', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveApprovalTaskId(task.task_id);
                        }}
                      >
                        <ShieldAlert size={13} />
                        Authorize Consequential Action
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: MOBILE OUTPUT
            ========================================================================= */}
        {mobileTab === 'output' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 className="serif-heading" style={{ fontSize: '1.35rem' }}>
              Verified Outputs
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.filter(t => t.artifact).map(t => (
                <div
                  key={t.artifact.id}
                  className="porcelain-card"
                  style={{ padding: '14px', cursor: 'pointer' }}
                  onClick={() => openArtifactViewer(t.artifact)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge badge-completed" style={{ fontSize: '9.5px' }}>
                      ✓ Verified SHA-256
                    </span>
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-muted)' }}>
                      {t.artifact.size}
                    </span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-espresso)', marginBottom: '8px' }}>
                    {t.artifact.filename}
                  </div>

                  <div 
                    style={{ height: '140px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#FAF7F1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}
                    dangerouslySetInnerHTML={{ __html: t.artifact.content }}
                  />

                  <button
                    type="button"
                    className="mira-btn mira-btn-primary mira-btn-sm"
                    style={{ width: '100%', fontSize: '11px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openArtifactViewer(t.artifact);
                    }}
                  >
                    Inspect Full Vector
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MOBILE DEVICES
            ========================================================================= */}
        {mobileTab === 'devices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 className="serif-heading" style={{ fontSize: '1.35rem' }}>
              Fleet Nodes
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {devices.map(dev => (
                <div 
                  key={dev.device_id} 
                  className="porcelain-card" 
                  style={{ padding: '14px', cursor: 'pointer' }}
                  onClick={() => openDeviceDetails(dev.device_id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-espresso)' }}>
                      {dev.name}
                    </div>
                    <span className={`badge ${dev.status === 'online' ? 'badge-completed' : 'badge-failed'}`} style={{ fontSize: '9.5px' }}>
                      {dev.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-espresso-secondary)', lineHeight: '1.4' }}>
                    {dev.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: MOBILE NOTIFICATIONS
            ========================================================================= */}
        {mobileTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 className="serif-heading" style={{ fontSize: '1.35rem' }}>
              Notifications
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className="porcelain-card"
                  style={{
                    padding: '12px',
                    backgroundColor: notif.read ? 'var(--color-surface)' : 'var(--color-gold-subtle)',
                    borderLeft: notif.urgent ? '3px solid var(--color-warning)' : '1px solid var(--color-border)',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.type === 'approval' && notif.task_id) {
                      setActiveApprovalTaskId(notif.task_id);
                    } else if (notif.task_id) {
                      openTaskDetails(notif.task_id);
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--color-espresso)' }}>
                      {notif.title}
                    </span>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-espresso-muted)' }}>
                      {notif.timestamp}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-espresso-secondary)' }}>
                    {notif.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-bar">
        <button
          type="button"
          className={`mobile-nav-item ${mobileTab === 'home' ? 'active' : ''}`}
          onClick={() => setMobileTab('home')}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${mobileTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setMobileTab('tasks')}
        >
          <Layers size={18} />
          <span>Tasks</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${mobileTab === 'output' ? 'active' : ''}`}
          onClick={() => setMobileTab('output')}
        >
          <FolderCheck size={18} />
          <span>Output</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${mobileTab === 'devices' ? 'active' : ''}`}
          onClick={() => setMobileTab('devices')}
        >
          <Radio size={18} />
          <span>Devices</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${mobileTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setMobileTab('notifications')}
        >
          <Bell size={18} />
          <span>Alerts</span>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '8px',
              width: '6px',
              height: '6px',
              backgroundColor: 'var(--color-gold)',
              borderRadius: '50%'
            }} />
          )}
        </button>
      </div>

      {/* Mobile Home Bar Pill */}
      <div className="mobile-home-indicator" />
    </div>
  );
};
