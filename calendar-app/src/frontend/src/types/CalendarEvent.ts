/**
 * カレンダーイベントの型定義
 * バックエンドのCalendarEventモデルと対応しています
 */
export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  category?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

/**
 * イベント作成時に使用するDTO
 */
export interface CreateCalendarEventDto {
  title: string;
  description?: string;
  startDateTime: Date | string;
  endDateTime: Date | string;
  location?: string;
  category?: string;
  color?: string;
}

/**
 * イベント更新時に使用するDTO
 */
export interface UpdateCalendarEventDto {
  title?: string;
  description?: string;
  startDateTime?: Date | string;
  endDateTime?: Date | string;
  location?: string;
  category?: string;
  color?: string;
}

/**
 * APIレスポンスの型
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

/**
 * ページング情報
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/**
 * ページング付きのレスポンス
 */
export interface PagedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

/**
 * カレンダーの表示モード
 */
export enum CalendarViewMode {
  Month = 'month',
  Week = 'week',
  Day = 'day'
}

/**
 * イベントのカテゴリー
 */
export enum EventCategory {
  Meeting = '会議',
  Task = 'タスク',
  Training = '研修',
  Event = 'イベント',
  Personal = '個人',
  Holiday = '休日'
}

/**
 * イベントの色設定
 */
export enum EventColor {
  Blue = '#2196F3',
  Red = '#F44336',
  Green = '#4CAF50',
  Orange = '#FF9800',
  Purple = '#9C27B0',
  Teal = '#009688',
  Pink = '#E91E63',
  Indigo = '#3F51B5'
}
