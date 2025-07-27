import { Component, For, createSignal, Show } from 'solid-js';
import { Room, Message } from '../types';

interface ChatAreaProps {
  room: Room | null;
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onRegenerateMessage: (messageId: string) => void;
  onToggleMobileSidebar: () => void;
  isMobile: boolean;
}

const ChatArea: Component<ChatAreaProps> = (props) => {
  const [messageInput, setMessageInput] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [editingMessageId, setEditingMessageId] = createSignal<string | null>(null);
  const [editingContent, setEditingContent] = createSignal('');

  const handleSendMessage = () => {
    const content = messageInput().trim();
    if (!content || isLoading()) return;

    props.onSendMessage(content);
    setMessageInput('');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  const saveEdit = () => {
    const messageId = editingMessageId();
    if (messageId) {
      props.onEditMessage(messageId, editingContent());
      setEditingMessageId(null);
      setEditingContent('');
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div class="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div class="flex-shrink-0 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          {props.isMobile && (
            <button
              onClick={props.onToggleMobileSidebar}
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          <Show when={props.room} fallback={
            <div class="text-gray-500 dark:text-gray-400">ルームを選択してください</div>
          }>
            {(room) => (
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {room().name}
                </h2>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {room().model_config.model}
                  </span>
                </div>
              </div>
            )}
          </Show>

          <button
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="検索"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
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
                <Show when={editingMessageId() === message.id} fallback={
                  <div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div class={`max-w-[70%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div class={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <div class="whitespace-pre-wrap">{message.content}</div>
                      </div>
                      
                      <div class={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        
                        <div class="flex gap-1">
                          <button
                            onClick={() => startEditing(message)}
                            class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                            title="編集"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <Show when={message.role === 'assistant'}>
                            <button
                              onClick={() => props.onRegenerateMessage(message.id)}
                              class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                              title="再生成"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          </Show>
                          
                          <button
                            onClick={() => props.onDeleteMessage(message.id)}
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
                  {/* 編集モード - 全幅使用 */}
                  <div class="w-full">
                    <div class="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        メッセージを編集中...
                      </div>
                      <textarea
                        value={editingContent()}
                        onInput={(e) => setEditingContent(e.currentTarget.value)}
                        class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-3 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        placeholder="メッセージを編集してください..."
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
              )}
            </For>
          )}
        </Show>

        {/* Loading indicator */}
        <Show when={isLoading()}>
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

      {/* Input Area */}
      <Show when={props.room}>
        <div class="flex-shrink-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div class="flex gap-3">
            <div class="flex-1">
              <textarea
                value={messageInput()}
                onInput={(e) => setMessageInput(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力... (Shift+Enterで改行、Enterで送信)"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows="1"
                style="min-height: 48px; max-height: 120px;"
              />
            </div>
            <div class="flex items-end">
              <button
                onClick={handleSendMessage}
                disabled={!messageInput().trim() || isLoading()}
                class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                style="height: 48px; width: 48px;"
              >
                <Show when={isLoading()} fallback={
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
      </Show>
    </div>
  );
};

export default ChatArea;
