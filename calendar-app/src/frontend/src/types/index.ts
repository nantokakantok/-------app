// 型定義のインデックスファイル
export * from './CalendarEvent';

// 共通の型定義
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormValidationErrors {
  [key: string]: string | undefined;
}

export interface SelectOption {
  value: string;
  label: string;
}
