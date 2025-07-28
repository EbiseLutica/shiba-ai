import { Component, createSignal, Show, createMemo } from 'solid-js';
import { AppSettings } from '../types';
import { Select, Button, Modal } from './ui';
import { getStorageUsage, formatBytes, getStorageUsagePercentage, checkStorageQuota, exportData, importData } from '../utils/storage';
import ModelSelector from './ModelSelector';
import OpenAIApiKeyGuideCard from './OpenAIApiKeyGuideCard';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
  isOpen: boolean;
}

const SettingsModal: Component<SettingsModalProps> = (props) => {
  const [apiKey, setApiKey] = createSignal(props.settings.api_key);
  const [theme, setTheme] = createSignal(props.settings.theme);
  const [defaultModel, setDefaultModel] = createSignal(props.settings.default_model);
  const [showApiKey, setShowApiKey] = createSignal(false);
  const [showApiKeyGuide, setShowApiKeyGuide] = createSignal(false);

  // ストレージ使用量の計算
  const storageInfo = createMemo(() => {
    const { used, total } = getStorageUsage();
    const percentage = getStorageUsagePercentage();
    const quota = checkStorageQuota();
    
    return {
      used,
      total,
      percentage,
      formattedUsed: formatBytes(used),
      formattedTotal: formatBytes(total),
      isNearLimit: quota.isNearLimit,
      isOverLimit: quota.isOverLimit
    };
  });

  const handleSave = () => {
    props.onSave({
      ...props.settings,
      api_key: apiKey(),
      theme: theme(),
      default_model: defaultModel(),
      ui_preferences: props.settings.ui_preferences,
    });
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shiba-ai-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            const success = importData(data);
            if (success) {
              alert('データのインポートが完了しました。ページを再読み込みしてください。');
              window.location.reload();
            } else {
              alert('データのインポートに失敗しました。');
            }
          } catch (error) {
            alert('無効なファイル形式です。');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const settingsContent = (
    <div class="space-y-6">
      {/* API Key */}
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            OpenAI API キー
          </label>
          <button
            type="button"
            onClick={() => setShowApiKeyGuide(!showApiKeyGuide())}
            class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <svg 
              class={`w-3 h-3 transition-transform duration-200 ${showApiKeyGuide() ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            キーについて
          </button>
        </div>
        
        <Show when={showApiKeyGuide()}>
          <div class="mb-3">
            <OpenAIApiKeyGuideCard />
          </div>
        </Show>
        
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
      <ModelSelector
        value={defaultModel()}
        onInput={setDefaultModel}
        label="デフォルトモデル"
        showRefreshButton={true}
      />

      {/* Storage Info */}
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ストレージ情報
        </h3>
        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <div class="flex justify-between">
            <span>使用量:</span>
            <span>{storageInfo().formattedUsed} / {storageInfo().formattedTotal}</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              class={`h-2 rounded-full transition-all duration-300 ${
                storageInfo().isOverLimit 
                  ? 'bg-red-600' 
                  : storageInfo().isNearLimit 
                    ? 'bg-yellow-600' 
                    : 'bg-blue-600'
              }`}
              style={`width: ${storageInfo().percentage}%`}
            />
          </div>
          <div class="flex justify-between text-xs">
            <span>{storageInfo().percentage}% 使用中</span>
            <Show when={storageInfo().isNearLimit}>
              <span class={storageInfo().isOverLimit ? 'text-red-500' : 'text-yellow-500'}>
                {storageInfo().isOverLimit ? '容量制限に達しています' : '容量制限に近づいています'}
              </span>
            </Show>
          </div>
        </div>
      </div>

      {/* Export/Import */}
      <div>
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          データの管理
        </h3>
        <div class="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            class="flex-1"
          >
            エクスポート
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            class="flex-1"
          >
            インポート
          </Button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          エクスポートにはAPIキーは含まれません
        </p>
      </div>

      {/* 開発者情報など */}
      <div class="text-xs mt-4 text-gray-500 dark:text-gray-400">
        <p>Shiba AIはオープンソースのプロジェクトです。</p>
        <p>GitHubでコードを確認できます。</p>
        <a 
          href="https://github.com/EbiseLutica/shiba-ai"
          class="text-blue-500 hover:underline"
        >
          リポジトリ
        </a>
      </div>
    </div>
  );

  const footerContent = (
    <div class="flex gap-3">
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
  );

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="設定"
      maxWidth="max-w-md"
      closeOnBackdropClick={true}
      showCloseButton={true}
      footerContent={footerContent}
    >
      {settingsContent}
    </Modal>
  );
};

export default SettingsModal;
