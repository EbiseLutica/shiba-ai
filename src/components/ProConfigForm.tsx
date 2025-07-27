import { Component } from 'solid-js';

interface ProConfigFormProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
}

const ProConfigForm: Component<ProConfigFormProps> = (props) => {
  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        システムプロンプト *
      </label>
      <textarea
        value={props.systemPrompt}
        onInput={(e) => props.onSystemPromptChange(e.currentTarget.value)}
        placeholder="AIの動作を定義するプロンプトを入力してください..."
        rows="8"
        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
      />
    </div>
  );
};

export default ProConfigForm;
