import { createSignal, createMemo, Component, onMount, createEffect, Show } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { Room, AppSettings, Message } from './types';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import RoomModal from './components/RoomModal';
import SearchModal from './components/SearchModal';
import { roomStorage, settingsStorage } from './utils/storage';
import { createOpenAIClient, generateChatResponse } from './utils/openai';

const App: Component = () => {
  // State management - LocalStorageから初期データを読み込み
  const [rooms, setRooms] = createSignal<Room[]>(roomStorage.getRooms());
  const [currentRoomId, setCurrentRoomId] = createSignal<string | null>(roomStorage.getCurrentRoomId());
  const [settings, setSettings] = createSignal<AppSettings>(settingsStorage.getSettings());
  const [showSettings, setShowSettings] = createSignal(false);
  const [showSearch, setShowSearch] = createSignal(false);
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

  // データの自動保存エフェクト（エラーハンドリング付き）
  createEffect(() => {
    // ルームデータが変更されたらLocalStorageに保存
    const success = roomStorage.saveRooms(rooms());
    if (!success) {
      console.error('Failed to save rooms to localStorage');
      // TODO: ユーザーに保存失敗を通知
    }
  });

  createEffect(() => {
    // 現在のルームIDが変更されたらLocalStorageに保存
    const success = roomStorage.saveCurrentRoomId(currentRoomId());
    if (!success) {
      console.error('Failed to save current room ID to localStorage');
    }
  });

  createEffect(() => {
    // 設定が変更されたらLocalStorageに保存
    const success = settingsStorage.saveSettings(settings());
    if (!success) {
      console.error('Failed to save settings to localStorage');
    }
  });

  // レスポンシブブレークポイント判定
  const checkMobile = () => {
    const width = window.innerWidth;
    setIsMobile(width < 768); // md breakpoint
  };

  // テーマ適用
  const applyTheme = (theme: 'auto' | 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // auto - システム設定に従う
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // システムカラースキーム変更の監視
  const handleSystemThemeChange = () => {
    if (settings().theme === 'auto') {
      applyTheme('auto');
    }
  };

  // 初期化
  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // テーマを初期化
    applyTheme(settings().theme);
    
    // システムカラースキーム変更を監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  });

  // テーマ設定変更時に適用
  createEffect(() => {
    applyTheme(settings().theme);
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

  // メッセージ編集処理
  const handleEditMessage = (messageId: string, newContent: string) => {
    const room = currentRoom();
    if (!room) return;

    setRooms(prev => prev.map(r => 
      r.id === room.id 
        ? {
            ...r,
            messages: r.messages.map(msg => 
              msg.id === messageId 
                ? { ...msg, content: newContent, timestamp: Date.now() }
                : msg
            ),
            updated_at: Date.now()
          }
        : r
    ));
  };

  // メッセージ削除処理
  const handleDeleteMessage = (messageId: string) => {
    const room = currentRoom();
    if (!room) return;

    // 削除確認
    if (!confirm('このメッセージを削除しますか？')) return;

    setRooms(prev => prev.map(r => 
      r.id === room.id 
        ? {
            ...r,
            messages: r.messages.filter(msg => msg.id !== messageId),
            updated_at: Date.now()
          }
        : r
    ));
  };

  // メッセージ再生成処理
  const handleRegenerateMessage = async (messageId: string) => {
    const room = currentRoom();
    const currentSettings = settings();
    
    if (!room || isWaitingForResponse()) return;

    // APIキーのチェック
    if (!currentSettings.api_key) {
      setShowSettings(true);
      return;
    }

    // 再生成確認
    if (!confirm('AIの応答を再生成しますか？')) return;

    // 指定されたメッセージのインデックスを取得
    const messageIndex = room.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // 指定されたメッセージ以降を削除して、再生成の準備
    const messagesBeforeRegenerate = room.messages.slice(0, messageIndex);
    
    setRooms(prev => prev.map(r => 
      r.id === room.id 
        ? {
            ...r,
            messages: messagesBeforeRegenerate,
            updated_at: Date.now()
          }
        : r
    ));

    // 待機状態を開始
    setIsWaitingForResponse(true);

    try {
      // OpenAI APIクライアントを作成
      const client = createOpenAIClient(currentSettings.api_key);
      
      // OpenAI APIでAIの返答を再生成
      const aiResponse = await generateChatResponse(client, room, messagesBeforeRegenerate);
      
      // 新しいAIメッセージを追加
      const newAiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      };

      setRooms(prev => prev.map(r => 
        r.id === room.id 
          ? { 
              ...r, 
              messages: [...messagesBeforeRegenerate, newAiMessage],
              updated_at: Date.now()
            }
          : r
      ));
      
    } catch (error) {
      console.error('Failed to regenerate AI response:', error);
      
      // エラー時はエラーメッセージを追加
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'エラーが発生しました。再生成に失敗しました。',
        timestamp: Date.now()
      };

      setRooms(prev => prev.map(r => 
        r.id === room.id 
          ? { 
              ...r, 
              messages: [...messagesBeforeRegenerate, errorMessage],
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
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onRegenerateMessage={handleRegenerateMessage}
          onToggleMobileSidebar={() => setShowMobileSidebar(!showMobileSidebar())}
          onEditRoom={handleEditCurrentRoom}
          onSearch={() => setShowSearch(true)}
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

      {/* Search Modal */}
      {showSearch() && (
        <SearchModal
          rooms={rooms()}
          onRoomSelect={(roomId) => {
            handleRoomSelect(roomId);
            if (isMobile()) {
              setShowMobileSidebar(false);
            }
          }}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
};

export default App;
