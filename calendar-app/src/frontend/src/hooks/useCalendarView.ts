import { useState, useCallback } from 'react';
import { CalendarViewMode } from '../types';
import { 
  getMonthStart, 
  getMonthEnd, 
  getWeekStart, 
  getWeekEnd, 
  getToday 
} from '../utils/dateUtils';

/**
 * カレンダー表示管理のカスタムフック
 */
export const useCalendarView = (initialDate?: Date) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || getToday());
  const [viewMode, setViewMode] = useState<CalendarViewMode>(CalendarViewMode.Month);

  /**
   * 表示日付を設定
   */
  const goToDate = useCallback((date: Date) => {
    setCurrentDate(new Date(date));
  }, []);

  /**
   * 今日に移動
   */
  const goToToday = useCallback(() => {
    setCurrentDate(getToday());
  }, []);

  /**
   * 前の期間に移動
   */
  const goToPrevious = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      switch (viewMode) {
        case CalendarViewMode.Month:
          newDate.setMonth(prev.getMonth() - 1);
          break;
        case CalendarViewMode.Week:
          newDate.setDate(prev.getDate() - 7);
          break;
        case CalendarViewMode.Day:
          newDate.setDate(prev.getDate() - 1);
          break;
      }
      return newDate;
    });
  }, [viewMode]);

  /**
   * 次の期間に移動
   */
  const goToNext = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      switch (viewMode) {
        case CalendarViewMode.Month:
          newDate.setMonth(prev.getMonth() + 1);
          break;
        case CalendarViewMode.Week:
          newDate.setDate(prev.getDate() + 7);
          break;
        case CalendarViewMode.Day:
          newDate.setDate(prev.getDate() + 1);
          break;
      }
      return newDate;
    });
  }, [viewMode]);

  /**
   * 表示モードを変更
   */
  const changeViewMode = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode);
  }, []);

  /**
   * 現在の表示期間の開始日を取得
   */
  const getPeriodStart = useCallback((): Date => {
    switch (viewMode) {
      case CalendarViewMode.Month:
        return getMonthStart(currentDate);
      case CalendarViewMode.Week:
        return getWeekStart(currentDate);
      case CalendarViewMode.Day:
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        return dayStart;
      default:
        return currentDate;
    }
  }, [currentDate, viewMode]);

  /**
   * 現在の表示期間の終了日を取得
   */
  const getPeriodEnd = useCallback((): Date => {
    switch (viewMode) {
      case CalendarViewMode.Month:
        return getMonthEnd(currentDate);
      case CalendarViewMode.Week:
        return getWeekEnd(currentDate);
      case CalendarViewMode.Day:
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);
        return dayEnd;
      default:
        return currentDate;
    }
  }, [currentDate, viewMode]);

  /**
   * 表示期間のタイトルを取得
   */
  const getPeriodTitle = useCallback((): string => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    switch (viewMode) {
      case CalendarViewMode.Month:
        return `${year}年${month}月`;
      case CalendarViewMode.Week:
        const weekStart = getWeekStart(currentDate);
        const weekEnd = getWeekEnd(currentDate);
        const startMonth = weekStart.getMonth() + 1;
        const startDay = weekStart.getDate();
        const endMonth = weekEnd.getMonth() + 1;
        const endDay = weekEnd.getDate();
        
        if (startMonth === endMonth) {
          return `${year}年${startMonth}月${startDay}日 - ${endDay}日`;
        } else {
          return `${year}年${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
        }
      case CalendarViewMode.Day:
        const day = currentDate.getDate();
        return `${year}年${month}月${day}日`;
      default:
        return '';
    }
  }, [currentDate, viewMode]);

  /**
   * 指定した日付が現在の表示期間に含まれるかチェック
   */
  const isDateInPeriod = useCallback((date: Date): boolean => {
    const periodStart = getPeriodStart();
    const periodEnd = getPeriodEnd();
    return date >= periodStart && date <= periodEnd;
  }, [getPeriodStart, getPeriodEnd]);

  return {
    currentDate,
    viewMode,
    goToDate,
    goToToday,
    goToPrevious,
    goToNext,
    changeViewMode,
    getPeriodStart,
    getPeriodEnd,
    getPeriodTitle,
    isDateInPeriod
  };
};
