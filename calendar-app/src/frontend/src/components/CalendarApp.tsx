import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Fab,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CalendarHeader from './CalendarHeader';
import CalendarView from './CalendarView';
import EventDialog from './EventDialog';
import { useEvents, useCalendarView } from '../hooks';
import { CalendarEvent } from '../types';

/**
 * カレンダーアプリケーションのメインコンポーネント
 * 
 * 機能:
 * - カレンダー表示の制御
 * - イベントの表示・作成・編集・削除
 * - エラーハンドリングとユーザー通知
 */
const CalendarApp: React.FC = () => {
  // カスタムフックの使用
  const {
    events,
    loading,
    fetchEventsByDateRange,
    addEvent,
    updateEvent,
    removeEvent,
    clearError
  } = useEvents();

  const {
    currentDate,
    viewMode,
    goToDate,
    goToToday,
    goToPrevious,
    goToNext,
    changeViewMode,
    getPeriodStart,
    getPeriodEnd,
    getPeriodTitle
  } = useCalendarView();

  // ローカルステート
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * 新規イベント作成ダイアログを開く
   */
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };

  /**
   * イベント編集ダイアログを開く
   */
  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  /**
   * イベントダイアログを閉じる
   */
  const handleCloseEventDialog = () => {
    setEventDialogOpen(false);
    setSelectedEvent(null);
  };

  /**
   * イベント作成成功時の処理
   */
  const handleEventCreated = (event: CalendarEvent) => {
    addEvent(event);
    setSuccessMessage('イベントが作成されました');
    handleCloseEventDialog();
  };

  /**
   * イベント更新成功時の処理
   */
  const handleEventUpdated = (event: CalendarEvent) => {
    updateEvent(event);
    setSuccessMessage('イベントが更新されました');
    handleCloseEventDialog();
  };

  /**
   * イベント削除成功時の処理
   */
  const handleEventDeleted = (eventId: number) => {
    removeEvent(eventId);
    setSuccessMessage('イベントが削除されました');
    handleCloseEventDialog();
  };

  /**
   * 日付をクリックした時の処理
   */
  const handleDateClick = (date: Date) => {
    goToDate(date);
  };

  /**
   * 成功メッセージを閉じる
   */
  const handleCloseSuccessMessage = () => {
    setSuccessMessage('');
  };

  /**
   * エラーメッセージを閉じる
   */
  const handleCloseError = () => {
    clearError();
  };

  // 現在の表示期間に基づいてイベントを取得
  React.useEffect(() => {
    const startDate = getPeriodStart();
    const endDate = getPeriodEnd();
    fetchEventsByDateRange(startDate, endDate);
  }, [fetchEventsByDateRange, getPeriodStart, getPeriodEnd]);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* アプリケーションタイトル */}
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          textAlign: 'center',
          mb: 3,
          color: 'primary.main',
          fontWeight: 'bold'
        }}
      >
        📅 共有カレンダー
      </Typography>

      {/* カレンダーメイン部分 */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        {/* カレンダーヘッダー */}
        <CalendarHeader
          title={getPeriodTitle()}
          viewMode={viewMode}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onToday={goToToday}
          onViewModeChange={changeViewMode}
          loading={loading.isLoading}
        />

        {/* カレンダービュー */}
        <CalendarView
          currentDate={currentDate}
          viewMode={viewMode}
          events={events}
          loading={loading.isLoading}
          onDateClick={handleDateClick}
          onEventClick={handleEditEvent}
        />
      </Paper>

      {/* 新規イベント作成ボタン */}
      <Fab
        color="primary"
        aria-label="イベントを追加"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
        onClick={handleCreateEvent}
      >
        <AddIcon />
      </Fab>

      {/* イベント作成・編集ダイアログ */}
      <EventDialog
        open={eventDialogOpen}
        event={selectedEvent}
        onClose={handleCloseEventDialog}
        onEventCreated={handleEventCreated}
        onEventUpdated={handleEventUpdated}
        onEventDeleted={handleEventDeleted}
      />

      {/* 成功メッセージ */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSuccessMessage} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* エラーメッセージ */}
      <Snackbar
        open={!!loading.error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {loading.error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CalendarApp;
