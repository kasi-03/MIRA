import React from 'react';
import { useApp } from '../../context/AppContext';
import MessageBubble from './MessageBubble';
import ErrorMessage from '../common/ErrorMessage';
import { EXAMPLE_PROMPTS } from '../../mocks/demoFixtures';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  FileText,
  Palette
} from 'lucide-react';

export default function MessageList({ messages = [], onSelectPrompt }) {
  const {
    confirmationTask,
    confirmTask,
    setConfirmationTask,
    submissionFeedback,
    setSubmissionFeedback,
    isDemoMode,
  } = useApp();

  const promptIcons = {
    Creative: Palette,
    System: Terminal,
    Documentation: FileText,
    Diagnostics: HelpCircle,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
      {/* Welcome & Context Banner (Only when no conversational messages yet) */}
      {messages.length === 0 && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, var(--mira-surface) 0%, var(--mira-champagne-subtle) 100%)',
            borderColor: 'var(--mira-champagne-soft)',
            padding: '20px',
            marginBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'var(--mira-champagne-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--mira-bronze-dark)',
              }}
            >
              <Sparkles size={16} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Hello. I'm MIRA.</h2>
          </div>

          <p style={{ fontSize: '13.5px', color: 'var(--mira-text-primary)', lineHeight: '1.45', marginBottom: '12px' }}>
            I coordinate verified work on your Windows workstation. Express your task in natural language, and I will parse the intent, verify safety policies, and deliver real artifacts back to your phone.
          </p>

          <div
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.65)',
              border: '1px solid var(--mira-champagne-soft)',
              fontSize: '12px',
              fontStyle: 'italic',
              color: 'var(--mira-bronze-dark)',
              fontWeight: '600',
            }}
          >
            “Say it once. Let MIRA carry it through.”
          </div>
        </div>
      )}

      {/* Submission Feedback Banner */}
      {submissionFeedback && (
        <ErrorMessage
          title={submissionFeedback.title}
          message={submissionFeedback.message}
          severity={submissionFeedback.type}
          onDismiss={() => setSubmissionFeedback(null)}
        />
      )}

      {/* Confirmation Card for Pending Task Plan */}
      {confirmationTask && (
        <div
          className="card"
          style={{
            borderColor: 'var(--mira-bronze)',
            backgroundColor: 'var(--mira-surface)',
            boxShadow: 'var(--shadow-md)',
            padding: '18px',
            borderWidth: '2px',
            animation: 'slideUp 0.2s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: 'var(--mira-champagne-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--mira-bronze-dark)',
              }}
            >
              <ShieldCheck size={16} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Confirm Execution Plan</h3>
          </div>

          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--mira-text-primary)', marginBottom: '4px' }}>
            {confirmationTask.title}
          </div>

          <p style={{ fontSize: '13px', color: 'var(--mira-text-secondary)', lineHeight: '1.4', marginBottom: '14px' }}>
            {confirmationTask.description}
          </p>

          <div
            style={{
              backgroundColor: 'var(--mira-surface-secondary)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              color: 'var(--mira-text-secondary)',
              marginBottom: '14px',
            }}
          >
            <strong>Target Workstation:</strong> {confirmationTask.device_label} • <strong>Risk Rating:</strong> {confirmationTask.risk_level.toUpperCase()}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setConfirmationTask(null)}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <XCircle size={15} />
              <span>Dismiss</span>
            </button>
            <button
              onClick={() => confirmTask(confirmationTask.task_id)}
              className="btn btn-primary btn-sm"
              style={{ flex: 2 }}
            >
              <CheckCircle2 size={15} />
              <span>Confirm &amp; Dispatch</span>
            </button>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Suggested Prompts Grid */}
      {messages.length === 0 && (
        <div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--mira-text-muted)',
              marginBottom: '10px',
              paddingLeft: '4px',
            }}
          >
            Example Task Prompts
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {EXAMPLE_PROMPTS.map((item, idx) => {
              const Icon = promptIcons[item.category] || Sparkles;

              return (
                <div
                  key={idx}
                  onClick={() => onSelectPrompt(item.prompt)}
                  className="card card-interactive"
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    backgroundColor: 'var(--mira-surface)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--mira-champagne-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--mira-bronze)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--mira-text-primary)', marginBottom: '2px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--mira-text-secondary)', lineHeight: '1.35' }}>
                      "{item.prompt}"
                    </div>
                  </div>

                  <ArrowRight size={14} color="var(--mira-text-muted)" style={{ marginTop: '6px', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
