import { Component, Show, createEffect } from 'solid-js';
import { Button, AutoResizeTextarea } from './ui';

interface MessageInputProps {
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  disabled: boolean;
  isWaitingForResponse?: boolean;
}

const MessageInput: Component<MessageInputProps> = (props) => {
  let textareaRef: HTMLTextAreaElement | undefined;

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      props.onSendMessage();
    }
  };

  // isWaitingForResponseがfalseになったときにフォーカス
  createEffect(() => {
    if (props.isWaitingForResponse === false && textareaRef) {
      setTimeout(() => {
        textareaRef?.focus();
      }, 100); // 少し遅延を入れてDOM更新を待つ
    }
  });

  return (
    <div class="flex-shrink-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div class="flex gap-3">
        <div class="flex-1">
          <AutoResizeTextarea
            ref={textareaRef}
            value={props.messageInput}
            onInput={(e: any) => props.onMessageInputChange(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              props.isWaitingForResponse 
                ? "返信を待っています..." 
                : "メッセージを入力... (Shift+Enterで改行、Enterで送信)"
            }
            disabled={props.isWaitingForResponse ?? false}
            minRows={1}
            maxRows={5}
          />
        </div>
        <div class="flex">
          <Button
            onClick={props.onSendMessage}
            disabled={props.disabled || props.isLoading || (props.isWaitingForResponse ?? false)}
            size="icon"
            loading={props.isLoading || (props.isWaitingForResponse ?? false)}
            style="height: 48px; width: 48px;"
          >
            <Show when={!props.isLoading && !(props.isWaitingForResponse ?? false)}>
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
