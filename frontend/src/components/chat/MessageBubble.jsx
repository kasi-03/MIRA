import React from 'react';
import { User, Sparkles } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          flexDirection: isUser ? 'row-reverse' : 'row',
          maxWidth: '85%',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: isUser ? 'var(--mira-bronze)' : 'var(--mira-champagne-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: isUser ? '#FFFFFF' : 'var(--mira-bronze-dark)',
          }}
        >
          {isUser ? <User size={15} /> : <Sparkles size={15} />}
        </div>

        {/* Message Content Bubble */}
        <div
          style={{
            backgroundColor: isUser ? 'var(--mira-bronze)' : 'var(--mira-surface)',
            color: isUser ? '#FFFFFF' : 'var(--mira-text-primary)',
            border: isUser ? 'none' : '1px solid var(--mira-surface-secondary)',
            borderRadius: '16px',
            borderBottomRightRadius: isUser ? '4px' : '16px',
            borderBottomLeftRadius: isUser ? '16px' : '4px',
            padding: '12px 16px',
            fontSize: '14.5px',
            lineHeight: '1.45',
            boxShadow: 'var(--shadow-sm)',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {message.text}
        </div>
      </div>

      {/* Timestamp */}
      {message.timestamp && (
        <span
          style={{
            fontSize: '11px',
            color: 'var(--mira-text-muted)',
            marginTop: '4px',
            paddingLeft: isUser ? '0' : '36px',
            paddingRight: isUser ? '36px' : '0',
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}
