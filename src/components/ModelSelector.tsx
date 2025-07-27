import { Component, createSignal, onMount } from 'solid-js';
import { Select } from './ui';
import { createOpenAIClient, getAvailableModels } from '../utils/openai';
import { settingsStorage } from '../utils/storage';

interface ModelSelectorProps {
  value: string;
  onInput: (value: string) => void;
  disabled?: boolean;
  showRefreshButton?: boolean;
  label?: string;
}

const ModelSelector: Component<ModelSelectorProps> = (props) => {
  const [availableModels, setAvailableModels] = createSignal([
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ]);
  const [isLoadingModels, setIsLoadingModels] = createSignal(false);

  // コンポーネントマウント時にモデル一覧を取得
  onMount(() => {
    loadAvailableModels();
  });

  const loadAvailableModels = async () => {
    try {
      const settings = settingsStorage.getSettings();
      if (!settings.api_key) return; // APIキーがない場合はスキップ

      setIsLoadingModels(true);
      const client = createOpenAIClient(settings.api_key);
      const models = await getAvailableModels(client);
      setAvailableModels(models);
    } catch (error) {
      console.error('Failed to load models:', error);
      // エラー時はデフォルトのモデル一覧を使用
    } finally {
      setIsLoadingModels(false);
    }
  };

  return (
    <div>
      {props.label && (
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {props.label}
          </label>
          {props.showRefreshButton && (
            <button
              type="button"
              onClick={loadAvailableModels}
              disabled={isLoadingModels()}
              class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
            >
              {isLoadingModels() ? '更新中...' : '更新'}
            </button>
          )}
        </div>
      )}
      <Select
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        disabled={props.disabled || isLoadingModels()}
      >
        {availableModels().map((model: string) => (
          <option value={model}>{model}</option>
        ))}
      </Select>
    </div>
  );
};

export default ModelSelector;
