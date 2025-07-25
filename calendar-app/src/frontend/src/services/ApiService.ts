import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  CalendarEvent, 
  CreateCalendarEventDto, 
  UpdateCalendarEventDto, 
  ApiResponse,
  PagedResponse 
} from '../types';

/**
 * API基底クラス
 * 共通のHTTP設定とエラーハンドリングを提供します
 */
class ApiService {
  private baseURL: string;
  private axiosInstance;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5103/api';
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // リクエストインターセプター
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // レスポンスインターセプター
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error('Response Error:', error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: AxiosError): Error {
    if (error.response) {
      // サーバーからのエラーレスポンス
      const status = error.response.status;
      const message = error.response.data || 'サーバーエラーが発生しました';
      return new Error(`HTTP ${status}: ${message}`);
    } else if (error.request) {
      // ネットワークエラー
      return new Error('ネットワークエラー: サーバーに接続できません');
    } else {
      // その他のエラー
      return new Error(`リクエストエラー: ${error.message}`);
    }
  }

  /**
   * GET リクエスト
   */
  protected async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, { params });
    return response.data;
  }

  /**
   * POST リクエスト
   */
  protected async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data);
    return response.data;
  }

  /**
   * PUT リクエスト
   */
  protected async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data);
    return response.data;
  }

  /**
   * DELETE リクエスト
   */
  protected async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url);
    return response.data;
  }
}

export default ApiService;
