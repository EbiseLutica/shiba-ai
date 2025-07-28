// データ型定義
export interface Room {
  id: string;
  name: string;
  sort_order: number;
  created_at: number;
  updated_at: number;
  mode: 'simple' | 'pro';
  simple_config?: {
    name: string;
    background: string;
    personality: string;
    tone: string;
    example_speech: string;
  };
  pro_config?: {
    system_prompt: string;
  };
  model_config: {
    model: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
  };
  messages: Message[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AppSettings {
  api_key: string;
  theme: 'auto' | 'light' | 'dark';
  default_model: string;
  ui_preferences: {
    sidebar_collapsed: boolean;
  };
  onboarding: {
    completed: boolean;
    version: string;
    completed_at: number;
    skipped_steps: string[];
  };
}

export interface ExportData {
  rooms: Room[];
  settings: Omit<AppSettings, 'api_key'>;
  exported_at: number;
}
