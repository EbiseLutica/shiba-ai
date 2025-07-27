import { Component } from 'solid-js';
import { Room } from '../types';

interface RoomItemProps {
  room: Room;
  isActive: boolean;
  collapsed: boolean;
  onSelect: () => void;
}

const RoomItem: Component<RoomItemProps> = (props) => {
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
    <button
      onClick={props.onSelect}
      class={`w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
        props.isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' 
          : ''
      }`}
    >
      {props.collapsed ? (
        <div class="flex justify-center">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {props.room.name.charAt(0)}
          </div>
        </div>
      ) : (
        <div>
          <div class="flex items-start justify-between">
            <h3 class="font-medium text-gray-900 dark:text-white truncate pr-2">
              {props.room.name}
            </h3>
            <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {formatTime(props.room.updated_at)}
            </span>
          </div>
          {props.room.messages.length > 0 && (
            <p class="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
              {props.room.messages[props.room.messages.length - 1].content}
            </p>
          )}
          <div class="flex items-center gap-2 mt-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {props.room.model_config.model}
            </span>
          </div>
        </div>
      )}
    </button>
  );
};

export default RoomItem;
