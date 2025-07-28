import { Component, createSignal, Show } from 'solid-js';
import { Room } from '../types';
import SimpleConfigForm from './SimpleConfigForm';
import ProConfigForm from './ProConfigForm';
import ModelConfigForm from './ModelConfigForm';

interface RoomEditFormProps {
  room?: Room | null;
  onSave: (roomData: Partial<Room>) => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  saveButtonText?: string;
  showAdvancedModelConfig?: boolean;
}

const RoomEditForm: Component<RoomEditFormProps> = (props) => {
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

  // Reset function for advanced model config
  const resetAdvancedModelConfig = () => {
    setTemperature(0.7);
    setMaxTokens(2000);
    setTopP(1.0);
    setFrequencyPenalty(0.0);
    setPresencePenalty(0.0);
  };

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

  const isFormValid = () => {
    return roomName() && 
           ((mode() === 'simple' && characterName()) || 
            (mode() === 'pro' && systemPrompt()));
  };

  return (
    <div class="space-y-6">
      {/* Room Name */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ルーム名 *
        </label>
        <input
          type="text"
          value={roomName()}
          onInput={(e: any) => setRoomName(e.currentTarget.value)}
          placeholder="例：アシスタント"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Mode Selection */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          設定モード
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="flex items-start p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="mode"
              value="simple"
              checked={mode() === 'simple'}
              onChange={() => setMode('simple')}
              class="mt-1 mr-3"
            />
            <div>
              <div class="font-medium text-gray-900 dark:text-white">簡単モード</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                いくつかの項目を入力するだけで、あなたの思い描くキャラクターを設定できます
              </div>
            </div>
          </label>
          <label class="flex items-start p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="mode"
              value="pro"
              checked={mode() === 'pro'}
              onChange={() => setMode('pro')}
              class="mt-1 mr-3"
            />
            <div>
              <div class="font-medium text-gray-900 dark:text-white">プロモード</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                AIに入力するシステムプロンプトを直接入力し、指示を完全にコントロールできる高度なモードです
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Simple Mode Fields */}
      <Show when={mode() === 'simple'}>
        <SimpleConfigForm
          characterName={characterName()}
          background={background()}
          personality={personality()}
          tone={tone()}
          exampleSpeech={exampleSpeech()}
          onCharacterNameChange={setCharacterName}
          onBackgroundChange={setBackground}
          onPersonalityChange={setPersonality}
          onToneChange={setTone}
          onExampleSpeechChange={setExampleSpeech}
        />
      </Show>

      {/* Pro Mode Fields */}
      <Show when={mode() === 'pro'}>
        <ProConfigForm
          systemPrompt={systemPrompt()}
          onSystemPromptChange={setSystemPrompt}
        />
      </Show>

      {/* Model Configuration */}
      <ModelConfigForm
        selectedModel={selectedModel()}
        temperature={temperature()}
        maxTokens={maxTokens()}
        topP={topP()}
        frequencyPenalty={frequencyPenalty()}
        presencePenalty={presencePenalty()}
        showAdvanced={props.showAdvancedModelConfig ?? (mode() === 'pro')}
        onSelectedModelChange={setSelectedModel}
        onTemperatureChange={setTemperature}
        onMaxTokensChange={setMaxTokens}
        onTopPChange={setTopP}
        onFrequencyPenaltyChange={setFrequencyPenalty}
        onPresencePenaltyChange={setPresencePenalty}
        onResetAdvanced={resetAdvancedModelConfig}
      />

      {/* Action Buttons */}
      <div class="flex gap-3 pt-4">
        <Show when={props.showCancelButton !== false && props.onCancel}>
          <button
            onClick={props.onCancel}
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            キャンセル
          </button>
        </Show>
        <button
          onClick={handleSave}
          disabled={!isFormValid()}
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {props.saveButtonText || (isEditing() ? '更新' : '作成')}
        </button>
      </div>
    </div>
  );
};

export default RoomEditForm;
