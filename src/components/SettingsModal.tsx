import { Component, createSignal, Show } from 'solid-js';
import { AppSettings } from '../types';
import { Select, Button } from './ui';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: Component<SettingsModalProps> = (props) => {
  const [apiKey, setApiKey] = createSignal(props.settings.api_key);
  const [theme, setTheme] = createSignal(props.settings.theme);
  const [defaultModel, setDefaultModel] = createSignal(props.settings.default_model);
  const [showApiKey, setShowApiKey] = createSignal(false);

  const availableModels = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ];

  const handleSave = () => {
    const newSettings: AppSettings = {
      ...props.settings,
      api_key: apiKey(),
      theme: theme(),
      default_model: defaultModel()
    };
    props.onSave(newSettings);
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
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">設定</h2>
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
          {/* API Key */}
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OpenAI API キー
            </label>
            <div class="relative">
              <input
                type={showApiKey() ? 'text' : 'password'}
                value={apiKey()}
                onInput={(e) => setApiKey(e.currentTarget.value)}
                placeholder="sk-..."
                class="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey())}
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <Show when={showApiKey()} fallback={
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </Show>
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              APIキーはローカルストレージに保存されます
            </p>
          </div>

          {/* Theme */}
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              テーマ
            </label>
            <Select
              value={theme()}
              onInput={(e) => setTheme(e.currentTarget.value as 'auto' | 'light' | 'dark')}
            >
              <option value="auto">自動（システム設定に従う）</option>
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
            </Select>
          </div>

          {/* Default Model */}
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              デフォルトモデル
            </label>
            <Select
              value={defaultModel()}
              onInput={(e) => setDefaultModel(e.currentTarget.value)}
            >
              {availableModels.map(model => (
                <option value={model}>{model}</option>
              ))}
            </Select>
          </div>

          {/* Storage Info */}
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ストレージ情報
            </h3>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div class="flex justify-between">
                <span>使用量:</span>
                <span>約 2.1 MB / 5 MB</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 42%"></div>
              </div>
            </div>
          </div>

          {/* Export/Import */}
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              データ管理
            </h3>
            <div class="flex gap-3">
              <button
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                onClick={() => console.log('エクスポート')}
              >
                エクスポート
              </button>
              <button
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onClick={() => console.log('インポート')}
              >
                インポート
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div class="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={props.onClose}
            variant="secondary"
            class="flex-1"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            class="flex-1"
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
