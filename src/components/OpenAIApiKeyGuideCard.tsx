import { Component } from "solid-js";
import { Button } from "./ui";

const OpenAIApiKeyGuideCard: Component = () => {
    const openApiPlatform = () => {
        window.open('https://platform.openai.com/api-keys', '_blank');
    };

    return (
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 class="font-semibold mb-2 text-blue-800 dark:text-blue-200">
              APIキーの取得方法
            </h4>
            <ol class="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>下のボタンからOpenAIプラットフォームにアクセス</li>
              <li>アカウントを作成またはログイン</li>
              <li>「Create new secret key」をクリック</li>
              <li>ウィザードに従い、キーを作成</li>
              <li>キーをコピーして下のフィールドに貼り付け</li>
            </ol>
            <Button
              variant="outline"
              size="sm"
              onClick={openApiPlatform}
              class="mt-3"
            >
              OpenAI Platform を開く
            </Button>
          </div>
    );
}

export default OpenAIApiKeyGuideCard;
