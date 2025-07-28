import { Component } from 'solid-js';
import { AutoResizeTextarea } from './ui';

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
      <AutoResizeTextarea
        value={props.systemPrompt}
        onInput={(e: any) => props.onSystemPromptChange(e.currentTarget.value)}
        placeholder="AIの動作を定義するプロンプトを入力してください..."
        minRows={4}
        maxRows={20}
      />
    </div>
  );
};

export default ProConfigForm;
