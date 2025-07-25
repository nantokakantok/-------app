/**
 * 日付関連のユーティリティ関数
 */

/**
 * 日付を日本語形式でフォーマット
 */
export const formatDate = (date: Date, includeTime: boolean = false): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '無効な日付';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('ja-JP', options);
};

/**
 * 時刻を日本語形式でフォーマット
 */
export const formatTime = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * 日付時刻を短縮形式でフォーマット
 */
export const formatDateTime = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '無効な日付時刻';
  }

  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * イベントの期間を人間が読みやすい形式でフォーマット
 */
export const formatEventDuration = (startDate: Date, endDate: Date): string => {
  if (!startDate || !endDate || 
      !(startDate instanceof Date) || !(endDate instanceof Date) ||
      isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return '期間不明';
  }

  const isSameDay = startDate.toDateString() === endDate.toDateString();
  
  if (isSameDay) {
    return `${formatDate(startDate)} ${formatTime(startDate)} - ${formatTime(endDate)}`;
  } else {
    return `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`;
  }
};

/**
 * 月の開始日を取得
 */
export const getMonthStart = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * 月の終了日を取得
 */
export const getMonthEnd = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * 週の開始日を取得（月曜日始まり）
 */
export const getWeekStart = (date: Date): Date => {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 日曜日の場合は-6、それ以外は1-day
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

/**
 * 週の終了日を取得（日曜日終わり）
 */
export const getWeekEnd = (date: Date): Date => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * 今日の日付を取得（時刻は00:00:00）
 */
export const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * 明日の日付を取得
 */
export const getTomorrow = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

/**
 * 2つの日付が同じ日かチェック
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  if (!date1 || !date2 || 
      !(date1 instanceof Date) || !(date2 instanceof Date)) {
    return false;
  }
  
  return date1.toDateString() === date2.toDateString();
};

/**
 * 日付が今日かチェック
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * 日付が過去かチェック
 */
export const isPastDate = (date: Date): boolean => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  
  const today = getToday();
  return date < today;
};

/**
 * 日付配列を生成（カレンダー表示用）
 */
export const generateCalendarDates = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = getWeekStart(firstDay);
  const endDate = getWeekEnd(lastDay);
  
  const dates: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

/**
 * HTML input[type="datetime-local"]用の文字列に変換
 */
export const toDateTimeLocalString = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * datetime-local文字列からDateオブジェクトに変換
 */
export const fromDateTimeLocalString = (dateTimeString: string): Date => {
  if (!dateTimeString) {
    return new Date();
  }
  
  return new Date(dateTimeString);
};
