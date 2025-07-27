import { Component } from 'solid-js';

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
        <input
          type="text"
          value={props.characterName}
          onInput={(e) => props.onCharacterNameChange(e.currentTarget.value)}
          placeholder="例：アシスタント"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          背景情報
        </label>
        <textarea
          value={props.background}
          onInput={(e) => props.onBackgroundChange(e.currentTarget.value)}
          placeholder="例：親切で知識豊富なAIアシスタント"
          rows="3"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          性格
        </label>
        <textarea
          value={props.personality}
          onInput={(e) => props.onPersonalityChange(e.currentTarget.value)}
          placeholder="例：丁寧で分かりやすく説明する"
          rows="2"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          口調
        </label>
        <input
          type="text"
          value={props.tone}
          onInput={(e) => props.onToneChange(e.currentTarget.value)}
          placeholder="例：敬語"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          話し方の例
        </label>
        <textarea
          value={props.exampleSpeech}
          onInput={(e) => props.onExampleSpeechChange(e.currentTarget.value)}
          placeholder="例：お手伝いできることがございましたら、お気軽にお声かけください。"
          rows="2"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
        />
      </div>
    </div>
  );
};

export default SimpleConfigForm;
