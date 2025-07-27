import { createSignal, createMemo, Component } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { Room, AppSettings } from './types';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import RoomModal from './components/RoomModal';
import UIShowcase from './components/UIShowcase';

const App: Component = () => {
  // State management
  const [rooms, setRooms] = createSignal<Room[]>([]);
  const [currentRoomId, setCurrentRoomId] = createSignal<string | null>(null);
  const [settings, setSettings] = createSignal<AppSettings>({
    api_key: '',
    theme: 'auto',
    default_model: 'gpt-4o',
    ui_preferences: {
      sidebar_collapsed: false
    }
  });
  const [showSettings, setShowSettings] = createSignal(false);
  const [isMobile, setIsMobile] = createSignal(false);
  const [showMobileSidebar, setShowMobileSidebar] = createSignal(false);
  const [showRoomModal, setShowRoomModal] = createSignal(false);
  const [editingRoom, setEditingRoom] = createSignal<Room | null>(null);

  // Current room計算
  const currentRoom = createMemo(() => {
    const id = currentRoomId();
    return id ? rooms().find(room => room.id === id) : null;
  });

  // モバイル判定
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // 初期化時とリサイズ時にモバイル判定
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // 初期化（空の状態から開始）
  // ルームと現在のルームIDは空の状態で開始

  const handleRoomSelect = (roomId: string) => {
    setCurrentRoomId(roomId);
    if (isMobile()) {
      setShowMobileSidebar(false);
    }
  };

  const handleNewRoom = () => {
    setEditingRoom(null);
    setShowRoomModal(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  const handleRoomSave = (roomData: Partial<Room>) => {
    if (editingRoom()) {
      // Edit existing room
      setRooms(prev => prev.map(room => 
        room.id === editingRoom()!.id 
          ? { ...room, ...roomData, updated_at: Date.now() }
          : room
      ));
    } else {
      // Create new room
      const newRoom: Room = {
        id: uuidv4(),
        sort_order: rooms().length + 1,
        created_at: Date.now(),
        updated_at: Date.now(),
        messages: [],
        ...roomData
      } as Room;
      setRooms(prev => [...prev, newRoom]);
      setCurrentRoomId(newRoom.id);
    }
    setShowRoomModal(false);
    setEditingRoom(null);
  };

  return (
    <div class="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div class={`${isMobile() ? 'hidden' : 'flex'} ${settings().ui_preferences.sidebar_collapsed ? 'w-16' : 'w-96'} transition-all duration-300`}>
        <Sidebar
          rooms={rooms()}
          currentRoomId={currentRoomId()}
          onRoomSelect={handleRoomSelect}
          onNewRoom={handleNewRoom}
          onSettings={() => setShowSettings(true)}
          collapsed={settings().ui_preferences.sidebar_collapsed}
          onToggleCollapse={() => {
            setSettings(prev => ({
              ...prev,
              ui_preferences: {
                ...prev.ui_preferences,
                sidebar_collapsed: !prev.ui_preferences.sidebar_collapsed
              }
            }));
          }}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile() && showMobileSidebar() && (
        <div class="fixed inset-0 z-50 flex">
          <div 
            class="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div class="relative w-96 bg-white dark:bg-gray-900">
            <Sidebar
              rooms={rooms()}
              currentRoomId={currentRoomId()}
              onRoomSelect={handleRoomSelect}
              onNewRoom={handleNewRoom}
              onSettings={() => setShowSettings(true)}
              collapsed={false}
              onToggleCollapse={() => {}}
            />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div class="flex-1 flex flex-col min-w-0">
        <ChatArea
          room={currentRoom() || null}
          onSendMessage={(content) => console.log('メッセージ送信:', content)}
          onEditMessage={(messageId, content) => console.log('メッセージ編集:', messageId, content)}
          onDeleteMessage={(messageId) => console.log('メッセージ削除:', messageId)}
          onRegenerateMessage={(messageId) => console.log('メッセージ再生成:', messageId)}
          onToggleMobileSidebar={() => setShowMobileSidebar(!showMobileSidebar())}
          onEditRoom={handleEditRoom}
          isMobile={isMobile()}
        />
      </div>

      {/* Settings Modal */}
      {showSettings() && (
        <SettingsModal
          settings={settings()}
          onSave={(newSettings) => {
            setSettings(newSettings);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Room Modal */}
      {showRoomModal() && (
        <RoomModal
          room={editingRoom()}
          onSave={handleRoomSave}
          onClose={() => {
            setShowRoomModal(false);
            setEditingRoom(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
