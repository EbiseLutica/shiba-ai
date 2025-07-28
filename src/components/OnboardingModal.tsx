import { createSignal, createMemo, Show, Component } from 'solid-js';
import { Button, Input, OnboardingModal as OnboardingModalBase } from './ui';
import RoomEditForm from './RoomEditForm';
import { Room } from '../types';
import OpenAIApiKeyGuideCard from './OpenAIApiKeyGuideCard';
import { DEFAULT_SETTINGS, settingsStorage } from '../utils/storage';

interface OnboardingModalProps {
  onComplete: (apiKey: string, room: Room) => void;
  isOpen: boolean;
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
      settingsStorage.saveSettings({
        ...DEFAULT_SETTINGS,
        api_key: apiKey(),
      });
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

  const getStepTitle = () => {
    switch (currentStep()) {
      case 'welcome':
        return 'Shiba AIへようこそ！';
      case 'notices':
        return 'ご利用前の重要な注意点';
      case 'api-key':
        return 'API キーの設定';
      case 'room-creation':
        return 'キャラクターの設定';
      case 'complete':
        return '設定完了';
      default:
        return '初期設定';
    }
  };

  const onboardingContent = (
    <>
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
                <li>・センシティブな情報の共有は避けてください</li>
              </ul>
            </div>

            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 class="font-semibold mb-2 flex items-center">
                💰 料金について
              </h4>
              <ul class="space-y-1">
                <li>・OpenAI APIの利用料金は、OpenAIから直接課金されます</li>
                <li>・料金を抑えたい場合は、より安価なモデルを選択してください</li>
                <li>・必要に応じてAPI使用量の制限を設定することをお勧めします</li>
              </ul>
            </div>

            <label class="flex items-start gap-3 mt-6 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToNotices()}
                onChange={(e) => setAgreedToNotices(e.currentTarget.checked)}
                class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">
                上記の注意点を理解し、同意します
              </span>
            </label>
          </div>
        </div>
      </Show>

      <Show when={currentStep() === 'api-key'}>
        <div class="space-y-4">
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              OpenAI API キーを設定してください
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Shiba AIはOpenAI APIを使用してAIと会話します。<br />
              あなたのAPIキーを設定してください。
            </p>
          </div>

          <OpenAIApiKeyGuideCard />

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API キー
            </label>
            <Input
              type="password"
              value={apiKey()}
              onInput={(e) => setApiKey(e.currentTarget.value)}
              placeholder="sk-..."
              class="w-full"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              APIキーはローカルに保存され、外部に送信されることはありません
            </p>
          </div>

          <Show when={!isApiKeyValid() && apiKey().length > 0}>
            <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <p class="text-sm text-red-700 dark:text-red-300">
                APIキーの形式が正しくありません。「sk-」で始まる文字列を入力してください。
              </p>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={currentStep() === 'room-creation'}>
        <div class="space-y-4">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              最初のキャラクターを作成しましょう
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              AIキャラクターの設定を行います。後から変更することも可能です。
            </p>
          </div>

          <RoomEditForm
            room={null}
            onSave={(roomData) => {
                setRoomFormData(roomData);
                handleNext();
            }}
            onCancel={handleBack}
          />
        </div>
      </Show>

      <Show when={currentStep() === 'complete'}>
        <div class="text-center space-y-6">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              設定が完了しました！
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              これでShiba AIを使い始めることができます。
            </p>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left">
            <h4 class="font-semibold mb-2 text-blue-800 dark:text-blue-200">
              💡 ヒント
            </h4>
            <ul class="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• サイドバーから新しいルームを作成できます</li>
              <li>• 設定画面から詳細な設定を変更できます</li>
              <li>• データのエクスポート機能をぜひご活用ください</li>
            </ul>
          </div>
        </div>
      </Show>
    </>
  );

  const footerContent = (
    <Show when={currentStep() !== 'room-creation'}>
      <div class="flex justify-between">
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
  );

  return (
    <OnboardingModalBase
      isOpen={props.isOpen}
      onClose={() => {}} // オンボーディングは閉じることができない
      currentStep={stepNumber()}
      totalSteps={5}
      stepTitle={getStepTitle()}
      maxWidth="max-w-xl"
      footerContent={footerContent}
    >
      {onboardingContent}
    </OnboardingModalBase>
  );
};

export default OnboardingModal;
