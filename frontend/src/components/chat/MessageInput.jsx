import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, AlertCircle } from 'lucide-react';
import { useSpeechInput } from '../../hooks/useSpeechInput';

export default function MessageInput({
  draftValue,
  onDraftChange,
  onSubmit,
  disabled = false,
  placeholder = "Message MIRA or describe a task for your laptop...",
}) {
  const [localText, setLocalText] = useState(draftValue || '');
  const textareaRef = useRef(null);

  // Speech Hook
  const {
    voiceState,
    isSupported: isSpeechSupported,
    errorMessage: speechError,
    startListening,
    stopListening,
  } = useSpeechInput({
    onTranscript: (spokenText) => {
      setLocalText(spokenText);
      if (onDraftChange) onDraftChange(spokenText);
    },
  });

  // Keep localText synced with external draft
  useEffect(() => {
    if (draftValue !== undefined && draftValue !== localText) {
      setLocalText(draftValue);
    }
  }, [draftValue]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${Math.max(newHeight, 44)}px`;
    }
  }, [localText]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalText(val);
    if (onDraftChange) onDraftChange(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = localText.trim();
    if (!trimmed || disabled) return;

    if (voiceState === 'listening') {
      stopListening();
    }

    onSubmit(trimmed);
  };

  const toggleMic = () => {
    if (voiceState === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  };

  const isListening = voiceState === 'listening';

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'var(--mira-surface)',
        borderTop: '1px solid var(--mira-surface-secondary)',
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        boxShadow: '0 -4px 12px rgba(38, 37, 33, 0.04)',
      }}
    >
      {/* Speech error indicator */}
      {speechError && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--mira-error)',
            backgroundColor: 'var(--mira-error-bg)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <AlertCircle size={14} />
          <span>{speechError}</span>
        </div>
      )}

      {/* Listening State Banner */}
      {isListening && (
        <div
          style={{
            fontSize: '12.5px',
            color: 'var(--mira-bronze-dark)',
            backgroundColor: 'var(--mira-champagne-subtle)',
            border: '1px solid var(--mira-champagne)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--mira-error)',
                animation: 'pulseGlow 1.2s infinite',
              }}
            />
            <span style={{ fontWeight: '600' }}>Listening to voice...</span>
          </div>
          <button
            onClick={stopListening}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--mira-bronze)',
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      )}

      {/* Input Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          backgroundColor: 'var(--mira-canvas)',
          border: '1px solid var(--mira-surface-secondary)',
          borderRadius: 'var(--radius-xl)',
          padding: '6px 8px 6px 14px',
          transition: 'border-color var(--transition-fast)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening... speak now" : placeholder}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            resize: 'none',
            fontSize: '14.5px',
            lineHeight: '1.4',
            maxHeight: '120px',
            padding: '6px 0',
            color: 'var(--mira-text-primary)',
          }}
        />

        {/* Mic Button */}
        <button
          type="button"
          onClick={toggleMic}
          disabled={disabled}
          className={`btn-icon ${isListening ? 'btn-danger' : 'btn-ghost'}`}
          style={{
            width: '38px',
            height: '38px',
            color: isListening ? '#FFFFFF' : 'var(--mira-bronze)',
            flexShrink: 0,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isSpeechSupported ? (isListening ? 'Stop listening' : 'Start voice input') : 'Voice input not supported in this browser'}
          aria-label={isListening ? 'Stop microphone' : 'Start microphone'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !localText.trim()}
          className="btn btn-primary btn-icon"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-full)',
            flexShrink: 0,
          }}
          title="Send task to MIRA"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', padding: '0 4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--mira-text-muted)' }}>
          Press Enter to send, Shift+Enter for new line
        </span>
        <span style={{ fontSize: '11px', color: 'var(--mira-text-muted)' }}>
          {localText.length > 0 ? `${localText.length} characters` : ''}
        </span>
      </div>
    </div>
  );
}
