import { Component, createSignal, createMemo, Show, For } from 'solid-js';
import { Room, Message } from '../types';
import { Button, Input } from './ui';

interface SearchModalProps {
  rooms: Room[];
  onClose: () => void;
  onRoomSelect: (roomId: string) => void;
}

interface SearchResult {
  room: Room;
  message: Message;
  matchType: 'room_name' | 'message_content';
}

const SearchModal: Component<SearchModalProps> = (props) => {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [searchScope, setSearchScope] = createSignal<'all' | 'current'>('all');

  // 検索結果の計算
  const searchResults = createMemo(() => {
    const query = searchQuery().trim().toLowerCase();
    if (!query) return [];

    const results: SearchResult[] = [];

    props.rooms.forEach(room => {
      // ルーム名での検索
      if (room.name.toLowerCase().includes(query)) {
        // ルーム名にマッチした場合は、最新のメッセージを結果として表示
        const latestMessage = room.messages[room.messages.length - 1];
        if (latestMessage) {
          results.push({
            room,
            message: latestMessage,
            matchType: 'room_name'
          });
        }
      }

      // メッセージ内容での検索
      room.messages.forEach(message => {
        if (message.content.toLowerCase().includes(query)) {
          results.push({
            room,
            message,
            matchType: 'message_content'
          });
        }
      });
    });

    // 時間順にソート（新しい順）
    return results.sort((a, b) => b.message.timestamp - a.message.timestamp);
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    props.onRoomSelect(result.room.id);
    props.onClose();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) 
        ? <mark class="bg-yellow-200 dark:bg-yellow-800">{part}</mark>
        : part
    );
  };

  return (
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">検索</h2>
          <button
            onClick={props.onClose}
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="space-y-4">
            <Input
              type="text"
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              placeholder="ルーム名やメッセージ内容を検索..."
              class="w-full"
              autofocus
            />
            
            {/* Search Scope - 将来的な拡張用 */}
            {/* <div class="flex items-center gap-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  name="searchScope"
                  value="all"
                  checked={searchScope() === 'all'}
                  onChange={() => setSearchScope('all')}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">全ルーム</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="searchScope"
                  value="current"
                  checked={searchScope() === 'current'}
                  onChange={() => setSearchScope('current')}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">現在のルーム</span>
              </label>
            </div> */}
          </div>
        </div>

        {/* Search Results */}
        <div class="flex-1 overflow-y-auto p-6">
          <Show when={searchQuery().trim()} fallback={
            <div class="text-center text-gray-500 dark:text-gray-400 py-8">
              <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>検索キーワードを入力してください</p>
            </div>
          }>
            <Show when={searchResults().length > 0} fallback={
              <div class="text-center text-gray-500 dark:text-gray-400 py-8">
                <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 9.34V7a3 3 0 00-3-3H8a3 3 0 00-3 3v2.34m1 9.66h8a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p>検索結果が見つかりませんでした</p>
              </div>
            }>
              <div class="space-y-3">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {searchResults().length}件の結果が見つかりました
                </div>
                <For each={searchResults()}>
                  {(result) => (
                    <button
                      onClick={() => handleResultClick(result)}
                      class="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <h3 class="font-medium text-gray-900 dark:text-white">
                            {result.matchType === 'room_name' 
                              ? highlightMatch(result.room.name, searchQuery())
                              : result.room.name
                            }
                          </h3>
                          <Show when={result.matchType === 'room_name'}>
                            <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              ルーム名
                            </span>
                          </Show>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(result.message.timestamp)}
                        </span>
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-300">
                        <span class={`inline-block w-12 text-xs ${
                          result.message.role === 'user' 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {result.message.role === 'user' ? 'You' : 'AI'}:
                        </span>
                        <span class="ml-2">
                          {result.matchType === 'message_content'
                            ? highlightMatch(
                                result.message.content.length > 100 
                                  ? result.message.content.substring(0, 100) + '...'
                                  : result.message.content,
                                searchQuery()
                              )
                            : (result.message.content.length > 100 
                                ? result.message.content.substring(0, 100) + '...'
                                : result.message.content)
                          }
                        </span>
                      </div>
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </div>

        {/* Footer */}
        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={props.onClose}
            variant="outline"
            class="w-full"
          >
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
