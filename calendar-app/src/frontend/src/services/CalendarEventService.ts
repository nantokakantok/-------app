import ApiService from './ApiService';
import { CalendarEvent, CreateCalendarEventDto, UpdateCalendarEventDto } from '../types';

/**
 * カレンダーイベント関連のAPIサービス
 * バックエンドのEventsControllerと通信します
 */
class CalendarEventService extends ApiService {
  private readonly endpoint = '/events';

  /**
   * 全てのイベントを取得
   */
  async getAllEvents(): Promise<CalendarEvent[]> {
    try {
      const events = await this.get<CalendarEvent[]>(this.endpoint);
      return events.map(event => ({
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      }));
    } catch (error) {
      console.error('イベント取得エラー:', error);
      throw error;
    }
  }

  /**
   * 特定のイベントを取得
   */
  async getEventById(id: number): Promise<CalendarEvent> {
    try {
      const event = await this.get<CalendarEvent>(`${this.endpoint}/${id}`);
      return {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      };
    } catch (error) {
      console.error(`イベント取得エラー (ID: ${id}):`, error);
      throw error;
    }
  }

  /**
   * 日付範囲でイベントを取得
   */
  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
      const events = await this.get<CalendarEvent[]>(`${this.endpoint}/range`, params);
      return events.map(event => ({
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      }));
    } catch (error) {
      console.error('日付範囲イベント取得エラー:', error);
      throw error;
    }
  }

  /**
   * カテゴリでイベントを検索
   */
  async getEventsByCategory(category: string): Promise<CalendarEvent[]> {
    try {
      const params = { category };
      const events = await this.get<CalendarEvent[]>(`${this.endpoint}/category`, params);
      return events.map(event => ({
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      }));
    } catch (error) {
      console.error(`カテゴリ検索エラー (${category}):`, error);
      throw error;
    }
  }

  /**
   * イベントを検索
   */
  async searchEvents(query: string): Promise<CalendarEvent[]> {
    try {
      const params = { q: query };
      const events = await this.get<CalendarEvent[]>(`${this.endpoint}/search`, params);
      return events.map(event => ({
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      }));
    } catch (error) {
      console.error(`イベント検索エラー (${query}):`, error);
      throw error;
    }
  }

  /**
   * 新規イベントを作成
   */
  async createEvent(eventData: CreateCalendarEventDto): Promise<CalendarEvent> {
    try {
      const payload = {
        ...eventData,
        startDateTime: typeof eventData.startDateTime === 'string' 
          ? eventData.startDateTime 
          : eventData.startDateTime.toISOString(),
        endDateTime: typeof eventData.endDateTime === 'string' 
          ? eventData.endDateTime 
          : eventData.endDateTime.toISOString()
      };
      
      const event = await this.post<CalendarEvent>(this.endpoint, payload);
      return {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      };
    } catch (error) {
      console.error('イベント作成エラー:', error);
      throw error;
    }
  }

  /**
   * イベントを更新
   */
  async updateEvent(id: number, eventData: UpdateCalendarEventDto): Promise<CalendarEvent> {
    try {
      const payload = {
        ...eventData,
        startDateTime: eventData.startDateTime 
          ? (typeof eventData.startDateTime === 'string' 
              ? eventData.startDateTime 
              : eventData.startDateTime.toISOString())
          : undefined,
        endDateTime: eventData.endDateTime 
          ? (typeof eventData.endDateTime === 'string' 
              ? eventData.endDateTime 
              : eventData.endDateTime.toISOString())
          : undefined
      };
      
      const event = await this.put<CalendarEvent>(`${this.endpoint}/${id}`, payload);
      return {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      };
    } catch (error) {
      console.error(`イベント更新エラー (ID: ${id}):`, error);
      throw error;
    }
  }

  /**
   * イベントを削除
   */
  async deleteEvent(id: number): Promise<void> {
    try {
      await this.delete<void>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`イベント削除エラー (ID: ${id}):`, error);
      throw error;
    }
  }

  /**
   * 統計情報を取得
   */
  async getStatistics(): Promise<{
    totalEvents: number;
    eventsThisMonth: number;
    eventsByCategory: { [category: string]: number };
  }> {
    try {
      return await this.get<{
        totalEvents: number;
        eventsThisMonth: number;
        eventsByCategory: { [category: string]: number };
      }>(`${this.endpoint}/statistics`);
    } catch (error) {
      console.error('統計情報取得エラー:', error);
      throw error;
    }
  }
}

// シングルトンインスタンスをエクスポート
export default new CalendarEventService();
