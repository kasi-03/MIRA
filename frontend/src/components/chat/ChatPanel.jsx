import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatPanel() {
  const {
    composerDraft,
    setComposerDraft,
    submitTask,
    isDemoMode,
  } = useApp();

  const [conversationHistory, setConversationHistory] = useState([]);

  const handleSendMessage = (text) => {
    // Append user message turn
    const userTurn = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setConversationHistory(prev => [...prev, userTurn]);

    // Dispatch task
    submitTask(text);

    // If in demo mode, add simulated acknowledgment turn
    if (isDemoMode) {
      setTimeout(() => {
        const assistantTurn = {
          id: `msg-${Date.now()}-assistant`,
          sender: 'assistant',
          text: `I have received your request: "${text}". Interpreting plan and validating workstation tool policies...`,
          timestamp: new Date().toISOString(),
        };
        setConversationHistory(prev => [...prev, assistantTurn]);
      }, 400);
    }
  };

  const handleSelectPrompt = (promptText) => {
    setComposerDraft(promptText);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
        <MessageList
          messages={conversationHistory}
          onSelectPrompt={handleSelectPrompt}
        />
      </div>

      <MessageInput
        draftValue={composerDraft}
        onDraftChange={setComposerDraft}
        onSubmit={handleSendMessage}
      />
    </div>
  );
}
