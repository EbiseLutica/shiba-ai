import { Component, Show } from 'solid-js';

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
          <textarea
            value={props.messageInput}
            onInput={(e) => props.onMessageInputChange(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力... (Shift+Enterで改行、Enterで送信)"
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows="1"
            style="min-height: 48px; max-height: 120px;"
          />
        </div>
        <div class="flex">
          <button
            onClick={props.onSendMessage}
            disabled={props.disabled || props.isLoading}
            class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            style="height: 48px; width: 48px;"
          >
            <Show when={props.isLoading} fallback={
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            }>
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </Show>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
