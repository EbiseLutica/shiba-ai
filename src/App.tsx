import { createSignal, createMemo, Component, onMount, createEffect } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { Room, AppSettings, Message } from './types';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import RoomModal from './components/RoomModal';
import UIShowcase from './components/UIShowcase';
import { roomStorage, settingsStorage } from './utils/storage';
import { createOpenAIClient, generateChatResponse } from './utils/openai';

const App: Component = () => {
  // State management - LocalStorageから初期データを読み込み
  const [rooms, setRooms] = createSignal<Room[]>(roomStorage.getRooms());
  const [currentRoomId, setCurrentRoomId] = createSignal<string | null>(roomStorage.getCurrentRoomId());
  const [settings, setSettings] = createSignal<AppSettings>(settingsStorage.getSettings());
  const [showSettings, setShowSettings] = createSignal(false);
  const [isMobile, setIsMobile] = createSignal(false);
  const [showMobileSidebar, setShowMobileSidebar] = createSignal(false);
  const [showRoomModal, setShowRoomModal] = createSignal(false);
  const [editingRoom, setEditingRoom] = createSignal<Room | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = createSignal(false);

  // Current room計算
  const currentRoom = createMemo(() => {
    const id = currentRoomId();
    return id ? rooms().find(room => room.id === id) : null;
  });

  // データの自動保存エフェクト
  createEffect(() => {
    // ルームデータが変更されたらLocalStorageに保存
    roomStorage.saveRooms(rooms());
  });

  createEffect(() => {
    // 現在のルームIDが変更されたらLocalStorageに保存
    roomStorage.saveCurrentRoomId(currentRoomId());
  });

  createEffect(() => {
    // 設定が変更されたらLocalStorageに保存
    settingsStorage.saveSettings(settings());
  });

  // モバイル判定
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // 初期化
  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });

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

  const handleEditCurrentRoom = () => {
    const room = currentRoom();
    if (room) {
      handleEditRoom(room);
    }
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

  // メッセージ送信処理
  const handleSendMessage = async (content: string) => {
    const room = currentRoom();
    const currentSettings = settings();
    
    if (!room || !content.trim() || isWaitingForResponse()) return;

    // APIキーのチェック
    if (!currentSettings.api_key) {
      // APIキーが設定されていない場合は設定モーダルを開く
      setShowSettings(true);
      return;
    }

    // 待機状態を開始
    setIsWaitingForResponse(true);

    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    // ルームにユーザーメッセージを追加
    setRooms(prev => prev.map(r => 
      r.id === room.id 
        ? { 
            ...r, 
            messages: [...r.messages, userMessage],
            updated_at: Date.now()
          }
        : r
    ));

    try {
      // OpenAI APIクライアントを作成
      const client = createOpenAIClient(currentSettings.api_key);
      
      // 現在のメッセージ履歴を取得（新しく追加したユーザーメッセージを含む）
      const updatedRoom = rooms().find(r => r.id === room.id);
      const allMessages = updatedRoom?.messages || [];
      
      // OpenAI APIでAIの返答を生成
      const aiResponse = await generateChatResponse(client, room, allMessages);
      
      // AIメッセージを追加
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      };

      setRooms(prev => prev.map(r => 
        r.id === room.id 
          ? { 
              ...r, 
              messages: [...r.messages, aiMessage],
              updated_at: Date.now()
            }
          : r
      ));
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      
      // エラー時はエラーメッセージをAIの応答として表示
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'エラーが発生しました。APIキーや設定を確認してください。',
        timestamp: Date.now()
      };

      setRooms(prev => prev.map(r => 
        r.id === room.id 
          ? { 
              ...r, 
              messages: [...r.messages, errorMessage],
              updated_at: Date.now()
            }
          : r
      ));
    } finally {
      // 待機状態を終了
      setIsWaitingForResponse(false);
    }
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
          onSendMessage={handleSendMessage}
          onEditMessage={(messageId, content) => console.log('メッセージ編集:', messageId, content)}
          onDeleteMessage={(messageId) => console.log('メッセージ削除:', messageId)}
          onRegenerateMessage={(messageId) => console.log('メッセージ再生成:', messageId)}
          onToggleMobileSidebar={() => setShowMobileSidebar(!showMobileSidebar())}
          onEditRoom={handleEditCurrentRoom}
          isMobile={isMobile()}
          isWaitingForResponse={isWaitingForResponse()}
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
