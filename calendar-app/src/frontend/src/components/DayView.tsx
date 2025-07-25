import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton
} from '@mui/material';
import { CalendarEvent } from '../types';
import { 
  isSameDay, 
  formatTime,
  formatDate
} from '../utils/dateUtils';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  loading: boolean;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * 日表示ビューコンポーネント
 * 
 * 機能:
 * - 選択した日のイベントを詳細表示
 * - 時系列でのイベント表示
 * - イベントの詳細情報表示
 */
const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  loading,
  onDateClick,
  onEventClick
}) => {
  /**
   * 当日のイベントを取得
   */
  const dayEvents = events
    .filter(event => isSameDay(event.startDateTime, currentDate))
    .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());

  /**
   * 時間帯を生成（0時〜23時）
   */
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  /**
   * 指定時間のイベントを取得
   */
  const getEventsForHour = (hour: number): CalendarEvent[] => {
    return dayEvents.filter(event => {
      const eventHour = event.startDateTime.getHours();
      const eventEndHour = event.endDateTime.getHours();
      return eventHour <= hour && hour <= eventEndHour;
    });
  };

  /**
   * イベントリストアイテムをレンダリング
   */
  const renderEventListItem = (event: CalendarEvent) => (
    <ListItem
      key={event.id}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        cursor: 'pointer',
        backgroundColor: 'background.paper',
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
      onClick={() => onEventClick(event)}
    >
      <Box
        sx={{
          width: 4,
          height: '100%',
          backgroundColor: event.color || '#2196F3',
          borderRadius: 1,
          mr: 2
        }}
      />
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {event.title}
            </Typography>
            {event.category && (
              <Typography 
                variant="caption" 
                sx={{ 
                  backgroundColor: 'grey.200',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1
                }}
              >
                {event.category}
              </Typography>
            )}
          </Box>
        }
        secondary={
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              ⏰ {formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}
            </Typography>
            {event.location && (
              <Typography variant="body2" color="text.secondary">
                📍 {event.location}
              </Typography>
            )}
            {event.description && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mt: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {event.description}
              </Typography>
            )}
          </Box>
        }
      />
    </ListItem>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* 日付ヘッダー */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'primary.50',
          border: '1px solid',
          borderColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.100'
          }
        }}
        onClick={() => onDateClick(currentDate)}
      >
        <Typography variant="h5" color="primary.main" fontWeight="bold">
          {formatDate(currentDate)}
        </Typography>
      </Paper>

      <Divider sx={{ mb: 2 }} />

      {/* イベント一覧 */}
      {loading ? (
        // ローディング中のスケルトン
        <Box>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2 }} />
          ))}
        </Box>
      ) : dayEvents.length > 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            📅 本日の予定 ({dayEvents.length}件)
          </Typography>
          <List sx={{ width: '100%' }}>
            {dayEvents.map(renderEventListItem)}
          </List>
        </>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'grey.50'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📭 予定はありません
          </Typography>
          <Typography variant="body2" color="text.secondary">
            新しい予定を追加するには右下の「+」ボタンをクリックしてください
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DayView;
