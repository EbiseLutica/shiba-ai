import { Component, createSignal, onMount, Show, For, createEffect } from 'solid-js';
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
  // 初期のデフォルトモデル一覧
  const defaultModels = [
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ];

  // props.valueがデフォルトリストに含まれていない場合は最初に追加
  const getInitialModels = () => {
    if (props.value && !defaultModels.includes(props.value)) {
      return [props.value, ...defaultModels];
    }
    return defaultModels;
  };

  const [availableModels, setAvailableModels] = createSignal<string[]>(getInitialModels());
  const [isLoadingModels, setIsLoadingModels] = createSignal(false);
  
  let selectRef: HTMLSelectElement | undefined;

  // モデル一覧が変更されたときに現在の選択値を保持する
  createEffect(() => {
    const models = availableModels();
    const currentValue = props.value;
    
    // 現在の値がモデル一覧に含まれていない場合、リストに追加
    if (currentValue && !models.includes(currentValue)) {
      const updatedModels = [currentValue, ...models.filter(m => m !== currentValue)];
      setAvailableModels(updatedModels);
    }
    
    // DOM更新後にselect要素の値を強制的に設定
    setTimeout(() => {
      if (selectRef && currentValue) {
        selectRef.value = currentValue;
      }
    }, 0);
  });

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
      
      // モデル一覧を更新（成功時のみ）
      if (models && models.length > 0) {
        // 現在選択されているモデルがAPIから取得したリストに含まれていない場合は追加
        const updatedModels = props.value && !models.includes(props.value) 
          ? [props.value, ...models] 
          : models;
        
        // 現在の値を記録
        const currentValue = props.value;
        
        // モデル一覧を更新
        setAvailableModels(updatedModels);
        
        // DOM更新後にselect要素の値を強制的に復元
        setTimeout(() => {
          if (selectRef && currentValue) {
            selectRef.value = currentValue;
            // 変更イベントを発火させない（値が変わっていないため）
          }
        }, 10); // 少し長めのタイムアウトを設定
      }
      
    } catch (error) {
      console.error('Failed to load models:', error);
      // エラー時はデフォルトのモデル一覧をそのまま使用（何もしない）
    } finally {
      setIsLoadingModels(false);
    }
  };

  return (
    <div>
      <Show when={props.label}>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {props.label}
          </label>
          <Show when={props.showRefreshButton}>
            <button
              type="button"
              onClick={loadAvailableModels}
              disabled={isLoadingModels()}
              class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
            >
              {isLoadingModels() ? '更新中...' : '更新'}
            </button>
          </Show>
        </div>
      </Show>
      <Select
        ref={selectRef}
        value={props.value}
        onInput={(e) => {
          const newValue = e.currentTarget.value;
          // 値が実際に変更された場合のみコールバックを呼ぶ
          if (newValue !== props.value) {
            props.onInput(newValue);
          }
        }}
        disabled={props.disabled || isLoadingModels()}
      >
        <For each={availableModels()}>
          {(model) => (
            <option value={model}>{model}</option>
          )}
        </For>
      </Select>
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-2">
        <p class="text-sm text-blue-700 dark:text-blue-300">
          モデルの選択は、AIの応答の質や速度に影響します。<br />
          <b>選択したモデルによって、従量課金の金額が変動します！！</b><br/>
          必ず、
          <a href="https://platform.openai.com/docs/models" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">
            OpenAIのドキュメント
          </a>
          をご確認ください。
        </p>
      </div>
    </div>
  );
};

export default ModelSelector;
