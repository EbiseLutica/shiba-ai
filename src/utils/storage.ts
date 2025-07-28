import { Room, AppSettings } from '../types';

// LocalStorageのキー定数
export const STORAGE_KEYS = {
  ROOMS: 'chappy_rooms',
  SETTINGS: 'chappy_settings',
  CURRENT_ROOM_ID: 'chappy_current_room_id'
} as const;

// デフォルト設定
export const DEFAULT_SETTINGS: AppSettings = {
  api_key: '',
  theme: 'auto',
  default_model: 'gpt-4o',
  ui_preferences: {
    sidebar_collapsed: false
  }
};

// LocalStorageの使用量を計算（バイト単位）
export const getStorageUsage = (): { used: number; total: number } => {
  let totalSize = 0;
  
  // すべてのLocalStorageアイテムのサイズを計算
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key) || '';
      // キー名 + 値のサイズ（UTF-16エンコーディングを考慮）
      totalSize += (key.length + value.length) * 2;
    }
  }
  
  // 一般的なLocalStorageの上限は5MB
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return {
    used: totalSize,
    total: maxSize
  };
};

// バイトを人間が読みやすい形式に変換
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 使用率を計算（パーセンテージ）
export const getStorageUsagePercentage = (): number => {
  const { used, total } = getStorageUsage();
  return Math.round((used / total) * 100);
};

// LocalStorageが利用可能かチェック
export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// 安全にJSONをパース
const safeJsonParse = <T>(value: string | null, defaultValue: T): T => {
  if (!value) return defaultValue;
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error);
    return defaultValue;
  }
};

// 安全にLocalStorageに保存
const safeSetItem = (key: string, value: any): boolean => {
  try {
    const jsonString = JSON.stringify(value);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    
    // 容量超過エラーの場合の処理
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded');
      
      // 容量超過時のエラーログを記録
      const jsonString = JSON.stringify(value);
      logStorageError('quota_exceeded', {
        key,
        dataSize: new Blob([jsonString]).size,
        currentUsage: getStorageUsage(),
        timestamp: new Date().toISOString()
      });
      
      // 可能であれば古いデータをクリアして再試行
      return handleQuotaExceeded(key, value);
    }
    
    // その他のエラーもログに記録
    logStorageError('storage_error', {
      key,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
    
    return false;
  }
};

// 容量超過時の処理
const handleQuotaExceeded = (key: string, value: any): boolean => {
  try {
    // デバッグ情報などの不要なデータを削除
    const keysToClean = Object.keys(localStorage).filter(k => 
      k.startsWith('debug_') || 
      k.startsWith('temp_') ||
      k.startsWith('cache_')
    );
    
    for (const keyToClean of keysToClean) {
      localStorage.removeItem(keyToClean);
    }
    
    // 再試行
    const jsonString = JSON.stringify(value);
    localStorage.setItem(key, jsonString);
    console.info('Successfully saved after cleaning temporary data');
    return true;
  } catch (error) {
    console.error('Failed to save even after cleanup:', error);
    return false;
  }
};

// エラーログ機能（メモリ内に保持、永続化しない）
let errorLogs: Array<{ type: string; data: any; timestamp: string }> = [];
const MAX_ERROR_LOGS = 50;

const logStorageError = (type: string, data: any) => {
  errorLogs.unshift({ type, data, timestamp: new Date().toISOString() });
  
  // ログの上限を維持
  if (errorLogs.length > MAX_ERROR_LOGS) {
    errorLogs = errorLogs.slice(0, MAX_ERROR_LOGS);
  }
};

// エラーログを取得（デバッグ用）
export const getStorageErrorLogs = () => errorLogs;

// ルームデータの読み書き
export const roomStorage = {
  getRooms: (): Room[] => {
    const roomsJson = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return safeJsonParse(roomsJson, []);
  },
  
  saveRooms: (rooms: Room[]): boolean => {
    return safeSetItem(STORAGE_KEYS.ROOMS, rooms);
  },
  
  getCurrentRoomId: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_ROOM_ID);
  },
  
  saveCurrentRoomId: (roomId: string | null): boolean => {
    try {
      if (roomId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_ROOM_ID, roomId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_ROOM_ID);
      }
      return true;
    } catch (error) {
      console.error('Failed to save current room ID to localStorage:', error);
      return false;
    }
  }
};

// 設定データの読み書き
export const settingsStorage = {
  getSettings: (): AppSettings => {
    const settingsJson = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return safeJsonParse(settingsJson, DEFAULT_SETTINGS);
  },
  
  saveSettings: (settings: AppSettings): boolean => {
    return safeSetItem(STORAGE_KEYS.SETTINGS, settings);
  }
};

// データのエクスポート（APIキーを除く）
export const exportData = () => {
  const rooms = roomStorage.getRooms();
  const settings = settingsStorage.getSettings();
  
  // APIキーを除外した設定
  const exportSettings = {
    ...settings,
    api_key: '' // APIキーは除外
  };
  
  const exportData = {
    rooms,
    settings: exportSettings,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  
  return exportData;
};

// データのインポート
export const importData = (data: any): boolean => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid import data format');
    }
    
    // バージョンチェック（将来的な互換性のため）
    if (data.version && data.version !== '1.0') {
      console.warn('Import data version mismatch, attempting to import anyway');
    }
    
    // ルームデータのインポート
    if (data.rooms && Array.isArray(data.rooms)) {
      roomStorage.saveRooms(data.rooms);
    }
    
    // 設定データのインポート（APIキーは現在の設定を保持）
    if (data.settings && typeof data.settings === 'object') {
      const currentSettings = settingsStorage.getSettings();
      const newSettings = {
        ...data.settings,
        api_key: currentSettings.api_key // 現在のAPIキーを保持
      };
      settingsStorage.saveSettings(newSettings);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

// LocalStorageの容量チェック
export const checkStorageQuota = (): { isNearLimit: boolean; isOverLimit: boolean } => {
  const usagePercentage = getStorageUsagePercentage();
  
  return {
    isNearLimit: usagePercentage >= 80, // 80%以上で警告
    isOverLimit: usagePercentage >= 95   // 95%以上で制限
  };
};
