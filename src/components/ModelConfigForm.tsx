import { Component, Show } from 'solid-js';
import { Input } from './ui';
import ModelSelector from './ModelSelector';

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
  return (
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">モデル設定</h3>
      
      <ModelSelector
        value={props.selectedModel}
        onInput={props.onSelectedModelChange}
        label="モデル"
        showRefreshButton={true}
      />

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
            <Input
              type="number"
              value={props.maxTokens}
              onInput={(e) => props.onMaxTokensChange(parseInt(e.currentTarget.value))}
              min="1"
              max="4000"
              size="sm"
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
