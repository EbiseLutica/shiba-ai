import { createSignal, createMemo, Show, Component } from 'solid-js';
import Button from './ui/Button';
import Input from './ui/Input';
import RoomEditForm from './RoomEditForm';
import { Room } from '../types';

interface OnboardingModalProps {
  onComplete: (apiKey: string, room: Room) => void;
}

type OnboardingStep = 'welcome' | 'notices' | 'api-key' | 'room-creation' | 'complete';

const OnboardingModal: Component<OnboardingModalProps> = (props) => {
  const [currentStep, setCurrentStep] = createSignal<OnboardingStep>('welcome');
  const [agreedToNotices, setAgreedToNotices] = createSignal(false);
  const [apiKey, setApiKey] = createSignal('');
  const [roomFormData, setRoomFormData] = createSignal<Partial<Room> | null>(null);

  const stepNumber = createMemo(() => {
    const steps: OnboardingStep[] = ['welcome', 'notices', 'api-key', 'room-creation', 'complete'];
    return steps.indexOf(currentStep()) + 1;
  });

  const isApiKeyValid = createMemo(() => {
    const key = apiKey().trim();
    return key.startsWith('sk-') && key.length > 10;
  });

  const canProceedFromNotices = createMemo(() => agreedToNotices());
  const canProceedFromApiKey = createMemo(() => isApiKeyValid());
  const canProceedFromRoomCreation = createMemo(() => roomFormData() !== null);

  const handleNext = () => {
    const current = currentStep();
    if (current === 'welcome') {
      setCurrentStep('notices');
    } else if (current === 'notices' && canProceedFromNotices()) {
      setCurrentStep('api-key');
    } else if (current === 'api-key' && canProceedFromApiKey()) {
      setCurrentStep('room-creation');
    } else if (current === 'room-creation' && canProceedFromRoomCreation()) {
      setCurrentStep('complete');
    } else if (current === 'complete') {
      // ルームの作成
      const formData = roomFormData();
      if (!formData) return;
      
      const room: Room = {
        id: crypto.randomUUID(),
        name: formData.name || 'アシスタント',
        sort_order: 0,
        created_at: Date.now(),
        updated_at: Date.now(),
        mode: formData.mode || 'simple',
        simple_config: formData.simple_config,
        pro_config: formData.pro_config,
        model_config: formData.model_config || {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0
        },
        messages: []
      };
      props.onComplete(apiKey(), room);
    }
  };

  const handleBack = () => {
    const current = currentStep();
    if (current === 'notices') {
      setCurrentStep('welcome');
    } else if (current === 'api-key') {
      setCurrentStep('notices');
    } else if (current === 'room-creation') {
      setCurrentStep('api-key');
    } else if (current === 'complete') {
      setCurrentStep('room-creation');
    }
  };

  const openApiPlatform = () => {
    window.open('https://platform.openai.com/api-keys', '_blank');
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              初期設定
            </h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {stepNumber()}/5
            </span>
          </div>
          {/* Progress Bar */}
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stepNumber() / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div class="p-6">
          <Show when={currentStep() === 'welcome'}>
            <div class="text-center space-y-4">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Shiba AIへようこそ！
              </h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                このアプリでは、OpenAI APIを用いて、<br />
                あなただけのAIキャラクターとチャットを楽しむことができます。
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                まず、簡単な設定を行いましょう。
              </p>
            </div>
          </Show>

          <Show when={currentStep() === 'notices'}>
            <div class="space-y-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                ご利用前の重要な注意点
              </h3>
              
              <div class="space-y-4 text-gray-600 dark:text-gray-300">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold mb-2 flex items-center">
                    📱 データの保存について
                  </h4>
                  <ul class="space-y-1">
                    <li>・ブラウザのデータを削除すると、会話履歴や設定が失われます</li>
                    <li>・アプリのデータはエクスポートできるので、定期的にお手元に保存することをお勧めします</li>
                  </ul>
                </div>

                <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold mb-2 flex items-center">
                    🤖 AIの応答について
                  </h4>
                  <ul class="space-y-1">
                    <li>・AIの応答は必ずしも正確ではありません</li>
                    <li>・重要な情報は必ず自分で確認してください</li>
                    <li>・特に医学・法律等の専門分野では注意が必要です</li>
                    <li>・本アプリの使用による損害について、開発者は責任を負いません</li>
                    <li>・データはOpenAIのサーバーに送信されます。個人情報等を書き込まないよう注意し、自己責任でご利用ください</li>
                  </ul>
                </div>
              </div>

              <label class="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToNotices()}
                  onChange={(e) => setAgreedToNotices(e.currentTarget.checked)}
                  class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  上記の注意点を理解しました
                </span>
              </label>
            </div>
          </Show>

          <Show when={currentStep() === 'api-key'}>
            <div class="space-y-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                OpenAI APIキーの設定
              </h3>
              
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Shiba AIを使用するには、OpenAI APIキーが必要です。<br />
                ご自身で<b>OpenAI API Platform</b>に登録し、APIキーを入手してください。
              </p>

              <Button
                variant="outline"
                onClick={openApiPlatform}
                class="w-full"
              >
                OpenAI API Platformを開く
              </Button>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  APIキー
                </label>
                <Input
                  type="password"
                  value={apiKey()}
                  onInput={(e: any) => setApiKey(e.currentTarget.value)}
                  placeholder="sk-..."
                  class="w-full"
                />
                <Show when={apiKey().length > 0 && !isApiKeyValid()}>
                  <p class="text-red-500 text-xs">
                    APIキーは「sk-」で始まる文字列である必要があります
                  </p>
                </Show>
              </div>
            </div>
          </Show>

          <Show when={currentStep() === 'room-creation'}>
            <div class="space-y-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                最初のAIキャラクターを作成しましょう
              </h3>
              
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                ルームは、AIキャラクターとの会話空間です。<br />
                かんたんモードまたはプロモードを選んで、最初のキャラクターを作成してみましょう。
              </p>

              <RoomEditForm
                onSave={(roomData) => {
                  setRoomFormData(roomData);
                  handleNext();
                }}
                onCancel={handleBack}
                showCancelButton={true}
                saveButtonText="作成して開始"
                showAdvancedModelConfig={false}
              />
            </div>
          </Show>

          <Show when={currentStep() === 'complete'}>
            <div class="text-center space-y-4">
              <div class="text-6xl">🎉</div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                設定完了！
              </h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                お疲れ様でした！Shiba AIの準備が完了しました。<br />
                さっそくAIキャラクターとチャットを始めましょう。
              </p>
              
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left">
                <h4 class="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                  💡 ヒント:
                </h4>
                <ul class="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• サイドバーから新しいルームを作成できます</li>
                  <li>• 設定画面から詳細な設定を変更できます</li>
                  <li>• データのエクスポート機能をぜひご活用ください</li>
                </ul>
              </div>
            </div>
          </Show>
        </div>

        {/* Footer */}
        <Show when={currentStep() !== 'room-creation'}>
          <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <Show when={currentStep() !== 'welcome'}>
              <Button variant="outline" onClick={handleBack}>
                戻る
              </Button>
            </Show>
            <Show when={currentStep() === 'welcome'}>
              <div />
            </Show>
            
            <Button
              onClick={handleNext}
              disabled={
                (currentStep() === 'notices' && !canProceedFromNotices()) ||
                (currentStep() === 'api-key' && !canProceedFromApiKey())
              }
            >
              {currentStep() === 'complete' ? 'チャットを開始' : '次へ'}
            </Button>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default OnboardingModal;
