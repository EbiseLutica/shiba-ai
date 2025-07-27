import { Component, Show } from 'solid-js';

interface ModelConfigFormProps {
  selectedModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  showAdvanced: boolean;
  onSelectedModelChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
  onTopPChange: (value: number) => void;
  onFrequencyPenaltyChange: (value: number) => void;
  onPresencePenaltyChange: (value: number) => void;
}

const ModelConfigForm: Component<ModelConfigFormProps> = (props) => {
  const availableModels = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ];

  return (
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">モデル設定</h3>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          モデル
        </label>
        <select
          value={props.selectedModel}
          onInput={(e) => props.onSelectedModelChange(e.currentTarget.value)}
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {availableModels.map(model => (
            <option value={model}>{model}</option>
          ))}
        </select>
      </div>

      <Show when={props.showAdvanced}>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Temperature ({props.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={props.temperature}
              onInput={(e) => props.onTemperatureChange(parseFloat(e.currentTarget.value))}
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              value={props.maxTokens}
              onInput={(e) => props.onMaxTokensChange(parseInt(e.currentTarget.value))}
              min="1"
              max="4000"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Top P ({props.topP})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={props.topP}
              onInput={(e) => props.onTopPChange(parseFloat(e.currentTarget.value))}
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency Penalty ({props.frequencyPenalty})
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={props.frequencyPenalty}
              onInput={(e) => props.onFrequencyPenaltyChange(parseFloat(e.currentTarget.value))}
              class="w-full"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Presence Penalty ({props.presencePenalty})
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={props.presencePenalty}
              onInput={(e) => props.onPresencePenaltyChange(parseFloat(e.currentTarget.value))}
              class="w-full"
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ModelConfigForm;
