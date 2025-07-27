import { Component, Show } from 'solid-js';
import { Button, Textarea } from './ui';

interface MessageInputProps {
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const MessageInput: Component<MessageInputProps> = (props) => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      props.onSendMessage();
    }
  };

  return (
    <div class="flex-shrink-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div class="flex gap-3">
        <div class="flex-1">
          <Textarea
            value={props.messageInput}
            onInput={(e) => props.onMessageInputChange(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力... (Shift+Enterで改行、Enterで送信)"
            rows="1"
            style="min-height: 48px; max-height: 120px;"
          />
        </div>
        <div class="flex">
          <Button
            onClick={props.onSendMessage}
            disabled={props.disabled || props.isLoading}
            size="icon"
            loading={props.isLoading}
            style="height: 48px; width: 48px;"
          >
            <Show when={!props.isLoading}>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Show>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
