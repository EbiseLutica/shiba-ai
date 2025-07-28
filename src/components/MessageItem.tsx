import { Component, Show, createSignal } from 'solid-js';
import { Message } from '../types';
import { AutoResizeTextarea } from './ui';
import { SolidMarkdown } from 'solid-markdown';

interface MessageItemProps {
  message: Message;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onRegenerateMessage: (messageId: string) => void;
}

const MessageItem: Component<MessageItemProps> = (props) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [editingContent, setEditingContent] = createSignal('');

  const startEditing = () => {
    setIsEditing(true);
    setEditingContent(props.message.content);
  };

  const saveEdit = () => {
    props.onEditMessage(props.message.id, editingContent());
    setIsEditing(false);
    setEditingContent('');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingContent('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Show when={isEditing()} fallback={
      <div class={`flex ${props.message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div class={`max-w-[70%] ${props.message.role === 'user' ? 'order-2' : 'order-1'}`}>
          <div class={`p-3 rounded-lg ${
            props.message.role === 'user'
              ? 'bg-blue-600 text-white ml-auto'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}>
            <SolidMarkdown class="chat-body">{props.message.content}</SolidMarkdown>
          </div>
          
          <div class={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
            props.message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}>
            <span>{formatTime(props.message.timestamp)}</span>
            
            <div class="flex gap-1">
              <Show when={props.message.role === 'user'}>
                <button
                  onClick={startEditing}
                  class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="編集"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </Show>
              
              <Show when={props.message.role === 'assistant'}>
                <button
                  onClick={() => props.onRegenerateMessage(props.message.id)}
                  class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="再生成"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </Show>
              
              <button
                onClick={() => props.onDeleteMessage(props.message.id)}
                class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-red-500"
                title="削除"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    }>
      {/* 編集モード */}
      <div class="w-full">
        <div class="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">
            メッセージを編集中...
          </div>
          <AutoResizeTextarea
            value={editingContent()}
            onInput={(e: any) => setEditingContent(e.currentTarget.value)}
            class="w-full"
            placeholder="メッセージを編集してください..."
            minRows={2}
            maxRows={10}
          />
          <div class="flex gap-2 mt-3">
            <button
              onClick={saveEdit}
              class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              保存
            </button>
            <button
              onClick={cancelEdit}
              class="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default MessageItem;
