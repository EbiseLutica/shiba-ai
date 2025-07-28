import OpenAI from 'openai';
import { Room, Message } from '../types';

/**
 * OpenAI APIクライアントを作成
 */
export const createOpenAIClient = (apiKey: string): OpenAI => {
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // ブラウザでの使用を許可
  });
};

/**
 * ルーム設定からシステムプロンプトを生成
 */
export const generateSystemPrompt = (room: Room): string => {
  if (room.mode === 'pro' && room.pro_config?.system_prompt) {
    return room.pro_config.system_prompt;
  }

  // かんたんモードの場合、設定からシステムプロンプトを構築
  const config = room.simple_config;
  if (!config) return '';

  let prompt = '';
  
  if (config.name) {
    prompt += `あなたは${config.name}です。`;
  }
  
  if (config.background) {
    prompt += `\n\n背景情報：\n${config.background}`;
  }
  
  if (config.personality) {
    prompt += `\n\n性格：\n${config.personality}`;
  }
  
  if (config.tone) {
    prompt += `\n\n口調：\n${config.tone}`;
  }
  
  if (config.example_speech) {
    prompt += `\n\n話し方の例：\n${config.example_speech}`;
  }

  return prompt.trim();
};

/**
 * OpenAI APIでチャット応答を生成
 */
export const generateChatResponse = async (
  client: OpenAI,
  room: Room,
  messages: Message[]
): Promise<string> => {
  try {
    const systemPrompt = generateSystemPrompt(room);
    
    // メッセージを OpenAI API 形式に変換
    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    
    // システムプロンプトを追加
    if (systemPrompt) {
      openaiMessages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    // 会話履歴を追加
    messages.forEach(msg => {
      openaiMessages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // API呼び出し
    const completion = await client.chat.completions.create({
      model: room.model_config?.model || 'gpt-3.5-turbo',
      messages: openaiMessages,
      temperature: room.model_config?.temperature || 1.0,
      max_tokens: room.model_config?.max_tokens || 1000,
      top_p: room.model_config?.top_p || 1.0,
      frequency_penalty: room.model_config?.frequency_penalty || 0,
      presence_penalty: room.model_config?.presence_penalty || 0,
    });

    return completion.choices[0]?.message?.content || 'すみません、応答を生成できませんでした。';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error instanceof Error) {
      // エラーメッセージを分析して適切な日本語メッセージを返す
      if (error.message.includes('api_key')) {
        return 'APIキーが無効です。設定画面で正しいAPIキーを入力してください。';
      } else if (error.message.includes('rate_limit')) {
        return 'APIの利用制限に達しました。しばらく待ってから再試行してください。';
      } else if (error.message.includes('insufficient_quota')) {
        return 'APIの利用枠を超過しました。OpenAIのアカウントで利用状況を確認してください。';
      } else if (error.message.includes('network')) {
        return 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
      }
    }
    
    return 'エラーが発生しました。しばらく待ってから再試行してください。';
  }
};

/**
 * 利用可能なモデル一覧を取得
 */
export const getAvailableModels = async (client: OpenAI): Promise<string[]> => {
  try {
    const models = await client.models.list();
    return models.data
      .sort((a, b) => b.created - a.created)
      .map(model => model.id)
  } catch (error) {
    console.error('Failed to fetch models:', error);
    // APIでモデル取得に失敗した場合のフォールバック
    return [
      'gpt-4.1',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo'
    ];
  }
};
