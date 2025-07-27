import { Component } from 'solid-js';
import { Room } from '../types';
import SidebarHeader from './SidebarHeader';
import RoomList from './RoomList';

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
  return (
    <div class="w-full h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <SidebarHeader
        collapsed={props.collapsed}
        onToggleCollapse={props.onToggleCollapse}
        onSettings={props.onSettings}
        onNewRoom={props.onNewRoom}
      />

      <RoomList
        rooms={props.rooms}
        currentRoomId={props.currentRoomId}
        collapsed={props.collapsed}
        onRoomSelect={props.onRoomSelect}
      />
    </div>
  );
};

export default Sidebar;
