import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Skeleton
} from '@mui/material';
import { CalendarEvent } from '../types';
import { 
  getWeekStart, 
  isSameDay, 
  isToday, 
  formatTime,
  formatDate
} from '../utils/dateUtils';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  loading: boolean;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * 週表示ビューコンポーネント
 * 
 * 機能:
 * - 週のカレンダーグリッドを表示
 * - 各日付のイベントを時系列で表示
 * - スクロール可能な時間軸表示
 */
const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  loading,
  onDateClick,
  onEventClick
}) => {
  // 週の開始日から7日分の日付を生成
  const weekStart = getWeekStart(currentDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];

  /**
   * 指定日のイベントを取得
   */
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => isSameDay(event.startDateTime, date))
      .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());
  };

  /**
   * 日付列をレンダリング
   */
  const renderDateColumn = (date: Date, index: number) => {
    const dayEvents = getEventsForDate(date);
    const isCurrentDay = isToday(date);

    return (
      <Grid item xs={12 / 7} key={index}>
        <Box sx={{ height: '100%' }}>
          {/* 日付ヘッダー */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              mb: 1,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isCurrentDay ? 'primary.50' : 'background.paper',
              border: '1px solid',
              borderColor: isCurrentDay ? 'primary.main' : 'divider',
              '&:hover': {
                backgroundColor: isCurrentDay ? 'primary.100' : 'action.hover'
              }
            }}
            onClick={() => onDateClick(date)}
          >
            <Typography 
              variant="caption" 
              color="text.secondary"
              display="block"
            >
              {weekdays[index]}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: isCurrentDay ? 'bold' : 'normal',
                color: isCurrentDay ? 'primary.main' : 'text.primary'
              }}
            >
              {date.getDate()}
            </Typography>
          </Paper>

          {/* イベントリスト */}
          <Box sx={{ minHeight: 400 }}>
            {loading ? (
              // ローディング中のスケルトン
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={60} />
                ))}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {dayEvents.map((event) => (
                  <Paper
                    key={event.id}
                    elevation={1}
                    sx={{
                      p: 1,
                      cursor: 'pointer',
                      backgroundColor: event.color || '#2196F3',
                      color: 'white',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                    onClick={() => onEventClick(event)}
                  >
                    <Typography variant="caption" display="block">
                      {formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      noWrap
                      title={event.title}
                    >
                      {event.title}
                    </Typography>
                    {event.location && (
                      <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
                        📍 {event.location}
                      </Typography>
                    )}
                  </Paper>
                ))}
                
                {dayEvents.length === 0 && !loading && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ textAlign: 'center', mt: 2 }}
                  >
                    イベントはありません
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* 週の期間表示 */}
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {formatDate(weekDates[0])} ～ {formatDate(weekDates[6])}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* 週のグリッド */}
      <Grid container spacing={1}>
        {weekDates.map((date, index) => renderDateColumn(date, index))}
      </Grid>
    </Box>
  );
};

export default WeekView;
