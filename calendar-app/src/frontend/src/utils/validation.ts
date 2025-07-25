import { FormValidationErrors } from '../types';

/**
 * バリデーション関連のユーティリティ関数
 */

/**
 * 必須チェック
 */
export const required = (value: any, fieldName: string): string | undefined => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName}は必須です`;
  }
  return undefined;
};

/**
 * 最大文字数チェック
 */
export const maxLength = (value: string, max: number, fieldName: string): string | undefined => {
  if (value && value.length > max) {
    return `${fieldName}は${max}文字以内で入力してください`;
  }
  return undefined;
};

/**
 * 最小文字数チェック
 */
export const minLength = (value: string, min: number, fieldName: string): string | undefined => {
  if (value && value.length < min) {
    return `${fieldName}は${min}文字以上で入力してください`;
  }
  return undefined;
};

/**
 * 日付の妥当性チェック
 */
export const isValidDate = (date: Date | string, fieldName: string): string | undefined => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!dateObj || isNaN(dateObj.getTime())) {
    return `${fieldName}には有効な日付を入力してください`;
  }
  return undefined;
};

/**
 * 開始日時と終了日時の整合性チェック
 */
export const validateDateRange = (
  startDate: Date | string, 
  endDate: Date | string
): string | undefined => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '開始日時と終了日時には有効な日付を入力してください';
  }
  
  if (start >= end) {
    return '終了日時は開始日時より後に設定してください';
  }
  
  return undefined;
};

/**
 * イベントタイトルのバリデーション
 */
export const validateEventTitle = (title: string): string | undefined => {
  const requiredError = required(title, 'タイトル');
  if (requiredError) return requiredError;
  
  const maxLengthError = maxLength(title, 200, 'タイトル');
  if (maxLengthError) return maxLengthError;
  
  return undefined;
};

/**
 * イベント説明のバリデーション
 */
export const validateEventDescription = (description?: string): string | undefined => {
  if (!description) return undefined;
  
  const maxLengthError = maxLength(description, 1000, '説明');
  if (maxLengthError) return maxLengthError;
  
  return undefined;
};

/**
 * イベント場所のバリデーション
 */
export const validateEventLocation = (location?: string): string | undefined => {
  if (!location) return undefined;
  
  const maxLengthError = maxLength(location, 200, '場所');
  if (maxLengthError) return maxLengthError;
  
  return undefined;
};

/**
 * イベントカテゴリのバリデーション
 */
export const validateEventCategory = (category?: string): string | undefined => {
  if (!category) return undefined;
  
  const validCategories = ['会議', 'タスク', '研修', 'イベント', '個人', '休日'];
  if (!validCategories.includes(category)) {
    return '有効なカテゴリを選択してください';
  }
  
  return undefined;
};

/**
 * カラーコードのバリデーション
 */
export const validateColor = (color?: string): string | undefined => {
  if (!color) return undefined;
  
  const colorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!colorPattern.test(color)) {
    return '有効なカラーコード（#RRGGBB形式）を入力してください';
  }
  
  return undefined;
};

/**
 * イベントフォーム全体のバリデーション
 */
export const validateEventForm = (data: {
  title: string;
  description?: string;
  startDateTime: Date | string;
  endDateTime: Date | string;
  location?: string;
  category?: string;
  color?: string;
}): FormValidationErrors => {
  const errors: FormValidationErrors = {};
  
  // タイトル
  const titleError = validateEventTitle(data.title);
  if (titleError) errors.title = titleError;
  
  // 説明
  const descriptionError = validateEventDescription(data.description);
  if (descriptionError) errors.description = descriptionError;
  
  // 開始日時
  const startDateError = isValidDate(data.startDateTime, '開始日時');
  if (startDateError) errors.startDateTime = startDateError;
  
  // 終了日時
  const endDateError = isValidDate(data.endDateTime, '終了日時');
  if (endDateError) {
    errors.endDateTime = endDateError;
  } else {
    // 日付範囲チェック
    const dateRangeError = validateDateRange(data.startDateTime, data.endDateTime);
    if (dateRangeError) errors.endDateTime = dateRangeError;
  }
  
  // 場所
  const locationError = validateEventLocation(data.location);
  if (locationError) errors.location = locationError;
  
  // カテゴリ
  const categoryError = validateEventCategory(data.category);
  if (categoryError) errors.category = categoryError;
  
  // 色
  const colorError = validateColor(data.color);
  if (colorError) errors.color = colorError;
  
  return errors;
};

/**
 * エラーオブジェクトが空かどうかチェック
 */
export const hasValidationErrors = (errors: FormValidationErrors): boolean => {
  return Object.keys(errors).some(key => errors[key] !== undefined);
};
