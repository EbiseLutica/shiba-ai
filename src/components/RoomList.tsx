import { Component, For } from 'solid-js';
import { Room } from '../types';
import RoomItem from './RoomItem';

interface RoomListProps {
  rooms: Room[];
  currentRoomId: string | null;
  collapsed: boolean;
  onRoomSelect: (roomId: string) => void;
}

const RoomList: Component<RoomListProps> = (props) => {
  return (
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
            <RoomItem
              room={room}
              isActive={props.currentRoomId === room.id}
              collapsed={props.collapsed}
              onSelect={() => props.onRoomSelect(room.id)}
            />
          )}
        </For>
      )}
    </div>
  );
};

export default RoomList;
