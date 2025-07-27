import { Component, createSignal, Show } from 'solid-js';
import { Room } from '../types';

interface RoomModalProps {
  room?: Room | null;
  onSave: (roomData: Partial<Room>) => void;
  onClose: () => void;
}

const RoomModal: Component<RoomModalProps> = (props) => {
  const isEditing = () => !!props.room;
  
  // Form state
  const [mode, setMode] = createSignal<'simple' | 'pro'>(props.room?.mode || 'simple');
  const [roomName, setRoomName] = createSignal(props.room?.name || '');
  
  // Simple mode fields
  const [characterName, setCharacterName] = createSignal(props.room?.simple_config?.name || '');
  const [background, setBackground] = createSignal(props.room?.simple_config?.background || '');
  const [personality, setPersonality] = createSignal(props.room?.simple_config?.personality || '');
  const [tone, setTone] = createSignal(props.room?.simple_config?.tone || '');
  const [exampleSpeech, setExampleSpeech] = createSignal(props.room?.simple_config?.example_speech || '');
  
  // Pro mode fields
  const [systemPrompt, setSystemPrompt] = createSignal(props.room?.pro_config?.system_prompt || '');
  
  // Model config
  const [selectedModel, setSelectedModel] = createSignal(props.room?.model_config?.model || 'gpt-4o');
  const [temperature, setTemperature] = createSignal(props.room?.model_config?.temperature || 0.7);
  const [maxTokens, setMaxTokens] = createSignal(props.room?.model_config?.max_tokens || 2000);
  const [topP, setTopP] = createSignal(props.room?.model_config?.top_p || 1.0);
  const [frequencyPenalty, setFrequencyPenalty] = createSignal(props.room?.model_config?.frequency_penalty || 0.0);
  const [presencePenalty, setPresencePenalty] = createSignal(props.room?.model_config?.presence_penalty || 0.0);

  const availableModels = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ];

  const handleSave = () => {
    const roomData: Partial<Room> = {
      name: roomName(),
      mode: mode(),
      model_config: {
        model: selectedModel(),
        temperature: temperature(),
        max_tokens: maxTokens(),
        top_p: topP(),
        frequency_penalty: frequencyPenalty(),
        presence_penalty: presencePenalty()
      }
    };

    if (mode() === 'simple') {
      roomData.simple_config = {
        name: characterName(),
        background: background(),
        personality: personality(),
        tone: tone(),
        example_speech: exampleSpeech()
      };
    } else {
      roomData.pro_config = {
        system_prompt: systemPrompt()
      };
    }

    props.onSave(roomData);
  };

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing() ? 'ルームを編集' : '新しいルームを作成'}
          </h2>
          <button
            onClick={props.onClose}
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div class="p-6 space-y-6">
          {/* Room Name */}
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ルーム名 *
            </label>
            <input
              type="text"
              value={roomName()}
              onInput={(e) => setRoomName(e.currentTarget.value)}
              placeholder="例：アシスタント"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Mode Selection */}
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              設定モード
            </label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="simple"
                  checked={mode() === 'simple'}
                  onChange={() => setMode('simple')}
                  class="mr-2"
                />
                <span class="text-gray-900 dark:text-white">簡単モード</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="pro"
                  checked={mode() === 'pro'}
                  onChange={() => setMode('pro')}
                  class="mr-2"
                />
                <span class="text-gray-900 dark:text-white">プロモード</span>
              </label>
            </div>
          </div>

          {/* Simple Mode Fields */}
          <Show when={mode() === 'simple'}>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  キャラクター名 *
                </label>
                <input
                  type="text"
                  value={characterName()}
                  onInput={(e) => setCharacterName(e.currentTarget.value)}
                  placeholder="例：アシスタント"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  背景情報
                </label>
                <textarea
                  value={background()}
                  onInput={(e) => setBackground(e.currentTarget.value)}
                  placeholder="例：親切で知識豊富なAIアシスタント"
                  rows="3"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  性格
                </label>
                <textarea
                  value={personality()}
                  onInput={(e) => setPersonality(e.currentTarget.value)}
                  placeholder="例：丁寧で分かりやすく説明する"
                  rows="2"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  口調
                </label>
                <input
                  type="text"
                  value={tone()}
                  onInput={(e) => setTone(e.currentTarget.value)}
                  placeholder="例：敬語"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  話し方の例
                </label>
                <textarea
                  value={exampleSpeech()}
                  onInput={(e) => setExampleSpeech(e.currentTarget.value)}
                  placeholder="例：お手伝いできることがございましたら、お気軽にお声かけください。"
                  rows="2"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </Show>

          {/* Pro Mode Fields */}
          <Show when={mode() === 'pro'}>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                システムプロンプト *
              </label>
              <textarea
                value={systemPrompt()}
                onInput={(e) => setSystemPrompt(e.currentTarget.value)}
                placeholder="AIの動作を定義するプロンプトを入力してください..."
                rows="8"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              />
            </div>
          </Show>

          {/* Model Configuration */}
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">モデル設定</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                モデル
              </label>
              <select
                value={selectedModel()}
                onInput={(e) => setSelectedModel(e.currentTarget.value)}
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {availableModels.map(model => (
                  <option value={model}>{model}</option>
                ))}
              </select>
            </div>

            <Show when={mode() === 'pro'}>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Temperature ({temperature()})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature()}
                    onInput={(e) => setTemperature(parseFloat(e.currentTarget.value))}
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={maxTokens()}
                    onInput={(e) => setMaxTokens(parseInt(e.currentTarget.value))}
                    min="1"
                    max="4000"
                    class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Top P ({topP()})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={topP()}
                    onInput={(e) => setTopP(parseFloat(e.currentTarget.value))}
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequency Penalty ({frequencyPenalty()})
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={frequencyPenalty()}
                    onInput={(e) => setFrequencyPenalty(parseFloat(e.currentTarget.value))}
                    class="w-full"
                  />
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Presence Penalty ({presencePenalty()})
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={presencePenalty()}
                    onInput={(e) => setPresencePenalty(parseFloat(e.currentTarget.value))}
                    class="w-full"
                  />
                </div>
              </div>
            </Show>
          </div>
        </div>

        {/* Footer */}
        <div class="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={props.onClose}
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!roomName() || (mode() === 'simple' && !characterName()) || (mode() === 'pro' && !systemPrompt())}
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isEditing() ? '更新' : '作成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
