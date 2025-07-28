import { Component, createSignal, Show } from 'solid-js';
import { Room } from '../types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatAreaProps {
  room: Room | null;
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onRegenerateMessage: (messageId: string) => void;
  onToggleMobileSidebar: () => void;
  onEditRoom?: () => void;
  onSearch: () => void;
  isMobile: boolean;
  isWaitingForResponse?: boolean;
}

const ChatArea: Component<ChatAreaProps> = (props) => {
  const [messageInput, setMessageInput] = createSignal('');
  const [isLoading] = createSignal(false);

  const handleSendMessage = () => {
    const content = messageInput().trim();
    if (!content || isLoading() || (props.isWaitingForResponse ?? false)) return;

    props.onSendMessage(content);
    setMessageInput('');
  };

  return (
    <div class="h-full flex flex-col bg-white dark:bg-gray-900">
      <ChatHeader
        room={props.room}
        onToggleMobileSidebar={props.onToggleMobileSidebar}
        onEditRoom={props.onEditRoom}
        onSearch={props.onSearch}
        isMobile={props.isMobile}
      />

      <MessageList
        room={props.room}
        onEditMessage={props.onEditMessage}
        onDeleteMessage={props.onDeleteMessage}
        onRegenerateMessage={props.onRegenerateMessage}
        isLoading={isLoading()}
      />

      <Show when={props.room}>
        <MessageInput
          messageInput={messageInput()}
          onMessageInputChange={setMessageInput}
          onSendMessage={handleSendMessage}
          isLoading={isLoading()}
          disabled={!messageInput().trim() || (props.isWaitingForResponse ?? false)}
          isWaitingForResponse={props.isWaitingForResponse}
        />
      </Show>
    </div>
  );
};

export default ChatArea;
