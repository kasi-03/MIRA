import React from 'react';
import ChatPanel from '../../components/chat/ChatPanel';

export default function AssistantPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      <ChatPanel />
    </div>
  );
}
