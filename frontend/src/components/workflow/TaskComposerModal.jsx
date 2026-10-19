import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSpeechInput } from '../../hooks/useSpeechInput';
import { Mic, Send, Sparkles, X, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

const PRESET_PROMPTS = [
  {
    title: "AI Summit Event Poster",
    prompt: "Generate an event poster for AI Summit 2026 with emerald and champagne gold accents.",
    tool: "generate_svg_poster",
    risk: "low"
  },
  {
    title: "Run Database Migration",
    prompt: "Run the database migration script migrate_users.py with --apply-schema on workstation.",
    tool: "run_sandboxed_script",
    risk: "high"
  },
  {
    title: "System Architecture Brief",
    prompt: "Compile the MIRA architecture specifications into an executive technical brief.",
    tool: "build_document",
    risk: "low"
  },
  {
    title: "Workstation Telemetry",
    prompt: "Query laptop hardware utilization, CPU, and FastMCP workspace counters.",
    tool: "export_telemetry",
    risk: "low"
  }
];

export const TaskComposerModal = () => {
  const { isComposerOpen, setIsComposerOpen, submitNewTask, showToast } = useApp();
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [riskLevel, setRiskLevel] = useState('low');
  const [selectedTool, setSelectedTool] = useState('generate_svg_poster');

  const {
    isListening,
    transcript,
    isSupported: isSpeechSupported,
    toggleListening
  } = useSpeechInput({
    onTranscript: (liveText) => {
      setPrompt(liveText);
      if (!title) {
        setTitle(liveText.slice(0, 40));
      }
    },
    onError: (errMsg) => {
      if (showToast) showToast(errMsg);
    }
  });

  const handleMicClick = () => {
    if (!isSpeechSupported) {
      if (showToast) showToast("Web Speech API not supported in this browser. Inserted voice sample.");
      setPrompt("Generate an event poster for AI Summit 2026 with emerald and champagne gold accents.");
      setTitle("AI Summit 2026 Event Poster");
      return;
    }
    const started = toggleListening((liveText) => {
      setPrompt(liveText);
      if (!title) {
        setTitle(liveText.slice(0, 40));
      }
    });
    if (started && showToast) {
      showToast("Listening... Speak your task request into your microphone.");
    }
  };

  if (!isComposerOpen) return null;

  const handleSelectPreset = (preset) => {
    setPrompt(preset.prompt);
    setTitle(preset.title);
    setSelectedTool(preset.tool);
    setRiskLevel(preset.risk);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    submitNewTask({
      prompt: prompt.trim(),
      title: title.trim() || undefined,
      riskLevel,
      toolName: selectedTool,
      toolParams: { prompt: prompt.trim() }
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setIsComposerOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="card-title-group">
            <div className="card-icon-bubble">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="serif-heading">New MIRA Task</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-espresso-muted)' }}>
                Simulating Phone 2 (Alexa Companion) Voice or Text Submission
              </p>
            </div>
          </div>
          <button className="mira-btn-outline mira-btn-sm" onClick={() => setIsComposerOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Quick Presets */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                Preset Demo Scenarios
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {PRESET_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: prompt === p.prompt ? '1.5px solid var(--color-gold)' : '1px solid var(--color-border)',
                      backgroundColor: prompt === p.prompt ? 'var(--color-gold-light)' : 'var(--color-bg)',
                      textAlign: 'left',
                      fontSize: '12.5px',
                      color: 'var(--color-espresso)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{p.title}</span>
                      <span className={`badge ${p.risk === 'high' ? 'badge-approval' : 'badge-pending'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                        {p.risk}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-espresso-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      Tool: {p.tool}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Input Microphone Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              backgroundColor: isListening ? 'var(--color-gold-light)' : 'var(--color-surface)',
              border: isListening ? '1.5px solid var(--color-gold)' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  type="button"
                  onClick={handleMicClick}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: isListening ? 'var(--color-gold)' : 'var(--color-linen)',
                    color: isListening ? '#FFFFFF' : 'var(--color-gold-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: isListening ? '0 0 0 6px rgba(176, 138, 80, 0.25)' : 'none',
                    cursor: 'pointer'
                  }}
                  title={isListening ? "Click to stop microphone" : "Click to speak via microphone"}
                >
                  <Mic size={20} />
                </button>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-espresso)' }}>
                    {isListening ? "Listening to Microphone... (Speak Now)" : "Phone 2 Alexa Speech Engine"}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-espresso-muted)' }}>
                    {isListening 
                      ? (transcript ? `Transcribed: "${transcript}"` : "Audio stream active: speak your prompt clearly...") 
                      : (isSpeechSupported ? "Tap microphone to speak your task request directly" : "Microphone unsupported in browser: tap for sample")}
                  </div>
                </div>
              </div>

              {isListening && (
                <div className="voice-wave-container">
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                </div>
              )}
            </div>

            {/* Prompt Text Input */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                Task Request Prompt
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="What should MIRA coordinate on your workstation?"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-espresso)',
                  resize: 'vertical',
                  lineHeight: '1.45'
                }}
              />
            </div>

            {/* Tool & Risk Settings */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                  Target MCP Tool
                </label>
                <select
                  value={selectedTool}
                  onChange={e => setSelectedTool(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-espresso)'
                  }}
                >
                  <option value="generate_svg_poster">generate_svg_poster (Low Risk)</option>
                  <option value="build_document">build_document (Low Risk)</option>
                  <option value="export_telemetry">export_telemetry (Low Risk)</option>
                  <option value="run_sandboxed_script">run_sandboxed_script (High Risk / Shield)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                  Risk Classification
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRiskLevel('low')}
                    className={`mira-btn mira-btn-sm ${riskLevel === 'low' ? 'mira-btn-secondary' : 'mira-btn-outline'}`}
                    style={{ flex: 1, fontWeight: riskLevel === 'low' ? 700 : 500 }}
                  >
                    Low (Safe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskLevel('high')}
                    className={`mira-btn mira-btn-sm ${riskLevel === 'high' ? 'mira-btn-danger' : 'mira-btn-outline'}`}
                    style={{ flex: 1, fontWeight: riskLevel === 'high' ? 700 : 500 }}
                  >
                    High (Approval)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="mira-btn mira-btn-outline"
              onClick={() => setIsComposerOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="mira-btn mira-btn-primary"
            >
              <Send size={15} />
              Submit to MIRA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
