import { Component, For, Show } from 'solid-js';
import { Room } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  room: Room | null;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onRegenerateMessage: (messageId: string) => void;
  isLoading: boolean;
}

const MessageList: Component<MessageListProps> = (props) => {
  return (
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <Show when={props.room} fallback={
        <div class="h-full flex items-center justify-center">
          <div class="text-center text-gray-500 dark:text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-lg">ルームを選択して会話を始めましょう</p>
          </div>
        </div>
      }>
        {(room) => (
          <For each={room().messages}>
            {(message) => (
              <MessageItem
                message={message}
                onEditMessage={props.onEditMessage}
                onDeleteMessage={props.onDeleteMessage}
                onRegenerateMessage={props.onRegenerateMessage}
              />
            )}
          </For>
        )}
      </Show>

      {/* Loading indicator */}
      <Show when={props.isLoading}>
        <div class="flex justify-start">
          <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default MessageList;
