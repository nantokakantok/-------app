import { useState, useCallback } from 'react';
import { CreateCalendarEventDto, UpdateCalendarEventDto, FormValidationErrors, LoadingState } from '../types';
import { CalendarEventService } from '../services';
import { validateEventForm, hasValidationErrors } from '../utils/validation';

/**
 * イベントフォーム管理のカスタムフック
 */
export const useEventForm = (onSuccess?: () => void) => {
  const [formData, setFormData] = useState<CreateCalendarEventDto>({
    title: '',
    description: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    location: '',
    category: '',
    color: '#2196F3'
  });

  const [validationErrors, setValidationErrors] = useState<FormValidationErrors>({});
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null
  });

  /**
   * フォームデータを更新
   */
  const updateFormData = useCallback((field: keyof CreateCalendarEventDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 該当フィールドのバリデーションエラーをクリア
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [validationErrors]);

  /**
   * フォーム全体のデータを設定（編集時）
   */
  const setFormDataForEdit = useCallback((eventData: UpdateCalendarEventDto) => {
    setFormData(prev => ({
      title: eventData.title || prev.title,
      description: eventData.description || prev.description,
      startDateTime: eventData.startDateTime || prev.startDateTime,
      endDateTime: eventData.endDateTime || prev.endDateTime,
      location: eventData.location || prev.location,
      category: eventData.category || prev.category,
      color: eventData.color || prev.color
    }));
  }, []);

  /**
   * フォームをリセット
   */
  const resetForm = useCallback(() => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);

    setFormData({
      title: '',
      description: '',
      startDateTime: now,
      endDateTime: nextHour,
      location: '',
      category: '',
      color: '#2196F3'
    });
    setValidationErrors({});
    setLoading({ isLoading: false, error: null });
  }, []);

  /**
   * バリデーション実行
   */
  const validateForm = useCallback((): boolean => {
    const errors = validateEventForm(formData);
    setValidationErrors(errors);
    return !hasValidationErrors(errors);
  }, [formData]);

  /**
   * イベント作成
   */
  const createEvent = useCallback(async () => {
    if (!validateForm()) {
      return null;
    }

    setLoading({ isLoading: true, error: null });
    try {
      const createdEvent = await CalendarEventService.createEvent(formData);
      setLoading({ isLoading: false, error: null });
      if (onSuccess) onSuccess();
      resetForm();
      return createdEvent;
    } catch (error) {
      setLoading({
        isLoading: false,
        error: error instanceof Error ? error.message : 'イベントの作成に失敗しました'
      });
      return null;
    }
  }, [formData, validateForm, onSuccess, resetForm]);

  /**
   * イベント更新
   */
  const updateEvent = useCallback(async (eventId: number) => {
    if (!validateForm()) {
      return null;
    }

    setLoading({ isLoading: true, error: null });
    try {
      const updatedEvent = await CalendarEventService.updateEvent(eventId, formData);
      setLoading({ isLoading: false, error: null });
      if (onSuccess) onSuccess();
      return updatedEvent;
    } catch (error) {
      setLoading({
        isLoading: false,
        error: error instanceof Error ? error.message : 'イベントの更新に失敗しました'
      });
      return null;
    }
  }, [formData, validateForm, onSuccess]);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setLoading(prev => ({ ...prev, error: null }));
  }, []);

  return {
    formData,
    validationErrors,
    loading,
    updateFormData,
    setFormDataForEdit,
    resetForm,
    validateForm,
    createEvent,
    updateEvent,
    clearError
  };
};
