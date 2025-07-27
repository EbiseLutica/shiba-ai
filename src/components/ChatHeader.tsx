import { Component, Show } from 'solid-js';
import { Room } from '../types';

interface ChatHeaderProps {
  room: Room | null;
  onToggleMobileSidebar: () => void;
  isMobile: boolean;
}

const ChatHeader: Component<ChatHeaderProps> = (props) => {
  return (
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
  );
};

export default ChatHeader;
