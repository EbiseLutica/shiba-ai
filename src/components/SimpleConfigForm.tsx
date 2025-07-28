import { Component } from 'solid-js';
import { Input, AutoResizeTextarea } from './ui';

interface SimpleConfigFormProps {
  characterName: string;
  background: string;
  personality: string;
  tone: string;
  exampleSpeech: string;
  onCharacterNameChange: (value: string) => void;
  onBackgroundChange: (value: string) => void;
  onPersonalityChange: (value: string) => void;
  onToneChange: (value: string) => void;
  onExampleSpeechChange: (value: string) => void;
}

const SimpleConfigForm: Component<SimpleConfigFormProps> = (props) => {
  return (
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          キャラクター名 *
        </label>
        <Input
          type="text"
          value={props.characterName}
          onInput={(e) => props.onCharacterNameChange(e.currentTarget.value)}
          placeholder="例：アシスタント"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          背景情報
        </label>
        <AutoResizeTextarea
          value={props.background}
          onInput={(e: any) => props.onBackgroundChange(e.currentTarget.value)}
          placeholder="例：親切で知識豊富なAIアシスタント"
          minRows={2}
          maxRows={6}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          性格
        </label>
        <AutoResizeTextarea
          value={props.personality}
          onInput={(e: any) => props.onPersonalityChange(e.currentTarget.value)}
          placeholder="例：丁寧で分かりやすく説明する"
          minRows={2}
          maxRows={5}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          口調
        </label>
        <Input
          type="text"
          value={props.tone}
          onInput={(e) => props.onToneChange(e.currentTarget.value)}
          placeholder="例：敬語"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          話し方の例
        </label>
        <AutoResizeTextarea
          value={props.exampleSpeech}
          onInput={(e: any) => props.onExampleSpeechChange(e.currentTarget.value)}
          placeholder="例：お手伝いできることがございましたら、お気軽にお声かけください。"
          minRows={2}
          maxRows={5}
        />
      </div>
    </div>
  );
};

export default SimpleConfigForm;
