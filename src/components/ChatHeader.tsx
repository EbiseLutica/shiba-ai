import { Component, Show } from 'solid-js';
import { Room } from '../types';
import { Button } from './ui';

interface ChatHeaderProps {
  room: Room | null;
  onToggleMobileSidebar: () => void;
  onEditRoom?: () => void;
  onSearch: () => void;
  isMobile: boolean;
}

const ChatHeader: Component<ChatHeaderProps> = (props) => {
  return (
    <div class="flex-shrink-0 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        {props.isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={props.onToggleMobileSidebar}
            title="メニューを開く"
            class="min-w-[44px] min-h-[44px]" // モバイル向けタッチターゲットサイズ
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
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

        <div class="flex items-center gap-2">
          <Show when={props.room && props.onEditRoom}>
            <Button
              variant="ghost"
              size="icon"
              onClick={props.onEditRoom}
              title="ルームを編集"
              class={props.isMobile ? "min-w-[44px] min-h-[44px]" : ""}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          </Show>

          <Button
            variant="ghost"
            size="icon"
            onClick={props.onSearch}
            title="検索"
            class={props.isMobile ? "min-w-[44px] min-h-[44px]" : ""}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
