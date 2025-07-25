import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, LoadingState } from '../types';
import { CalendarEventService } from '../services';

/**
 * イベント一覧管理のカスタムフック
 */
export const useEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null
  });

  /**
   * 全イベントを取得
   */
  const fetchEvents = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    try {
      const fetchedEvents = await CalendarEventService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      setLoading({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'イベントの取得に失敗しました' 
      });
      return;
    }
    setLoading({ isLoading: false, error: null });
  }, []);

  /**
   * 日付範囲でイベントを取得
   */
  const fetchEventsByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    setLoading({ isLoading: true, error: null });
    try {
      const fetchedEvents = await CalendarEventService.getEventsByDateRange(startDate, endDate);
      setEvents(fetchedEvents);
    } catch (error) {
      setLoading({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'イベントの取得に失敗しました' 
      });
      return;
    }
    setLoading({ isLoading: false, error: null });
  }, []);

  /**
   * イベントを検索
   */
  const searchEvents = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchEvents();
      return;
    }

    setLoading({ isLoading: true, error: null });
    try {
      const searchResults = await CalendarEventService.searchEvents(query);
      setEvents(searchResults);
    } catch (error) {
      setLoading({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'イベントの検索に失敗しました' 
      });
      return;
    }
    setLoading({ isLoading: false, error: null });
  }, [fetchEvents]);

  /**
   * カテゴリでイベントをフィルタ
   */
  const filterByCategory = useCallback(async (category: string) => {
    setLoading({ isLoading: true, error: null });
    try {
      const filteredEvents = await CalendarEventService.getEventsByCategory(category);
      setEvents(filteredEvents);
    } catch (error) {
      setLoading({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'イベントのフィルタに失敗しました' 
      });
      return;
    }
    setLoading({ isLoading: false, error: null });
  }, []);

  /**
   * イベントを追加
   */
  const addEvent = useCallback(async (event: CalendarEvent) => {
    setEvents(prevEvents => [...prevEvents, event]);
  }, []);

  /**
   * イベントを更新
   */
  const updateEvent = useCallback(async (updatedEvent: CalendarEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  }, []);

  /**
   * イベントを削除
   */
  const removeEvent = useCallback(async (eventId: number) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  }, []);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setLoading(prev => ({ ...prev, error: null }));
  }, []);

  // 初回マウント時にイベントを取得
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    fetchEvents,
    fetchEventsByDateRange,
    searchEvents,
    filterByCategory,
    addEvent,
    updateEvent,
    removeEvent,
    clearError
  };
};
