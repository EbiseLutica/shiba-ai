import { Component, For } from 'solid-js';
import { Room } from '../types';

interface SidebarProps {
  rooms: Room[];
  currentRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  onNewRoom: () => void;
  onSettings: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: Component<SidebarProps> = (props) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return `${days}日前`;
  };

  return (
    <div class="w-full h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        {!props.collapsed ? (
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Chappy</h1>
              <div class="flex gap-2">
                <button
                  onClick={props.onToggleCollapse}
                  class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="サイドバーを折りたたみ"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={props.onSettings}
                  class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="設定"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              onClick={props.onNewRoom}
              class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              新しいルーム
            </button>
          </div>
        ) : (
          <div class="flex justify-center">
            <button
              onClick={props.onToggleCollapse}
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="サイドバーを展開"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Room List */}
      <div class="flex-1 overflow-y-auto">
        {props.rooms.length === 0 ? (
          <div class="p-6 text-center text-gray-500 dark:text-gray-400">
            {!props.collapsed && (
              <div>
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p class="text-sm">ルームがありません</p>
                <p class="text-xs mt-1">「新しいルーム」ボタンでチャットを開始しましょう</p>
              </div>
            )}
          </div>
        ) : (
          <For each={props.rooms}>
            {(room) => (
              <button
                onClick={() => props.onRoomSelect(room.id)}
                class={`w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                  props.currentRoomId === room.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' 
                    : ''
                }`}
              >
                {props.collapsed ? (
                  <div class="flex justify-center">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {room.name.charAt(0)}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div class="flex items-start justify-between">
                      <h3 class="font-medium text-gray-900 dark:text-white truncate pr-2">
                        {room.name}
                      </h3>
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatTime(room.updated_at)}
                      </span>
                    </div>
                    {room.messages.length > 0 && (
                      <p class="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                        {room.messages[room.messages.length - 1].content}
                      </p>
                    )}
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {room.model_config.model}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            )}
          </For>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
