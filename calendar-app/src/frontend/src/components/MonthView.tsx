import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Skeleton
} from '@mui/material';
import { CalendarEvent } from '../types';
import { 
  generateCalendarDates, 
  isSameDay, 
  isToday, 
  formatTime 
} from '../utils/dateUtils';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  loading: boolean;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * 月表示ビューコンポーネント
 * 
 * 機能:
 * - 月のカレンダーグリッドを表示
 * - 各日付のイベントを表示
 * - 日付クリックとイベントクリックのハンドリング
 */
const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  loading,
  onDateClick,
  onEventClick
}) => {
  // 月のカレンダー日付を生成
  const calendarDates = generateCalendarDates(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // 曜日ヘッダー
  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];

  /**
   * 指定日のイベントを取得
   */
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => isSameDay(event.startDateTime, date));
  };

  /**
   * 日付セルをレンダリング
   */
  const renderDateCell = (date: Date, index: number) => {
    const dayEvents = getEventsForDate(date);
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isCurrentDay = isToday(date);

    return (
      <Grid item xs={12 / 7} key={index}>
        <Paper
          elevation={0}
          sx={{
            minHeight: 120,
            p: 1,
            cursor: 'pointer',
            backgroundColor: isCurrentDay 
              ? 'primary.50' 
              : isCurrentMonth 
                ? 'background.paper' 
                : 'grey.50',
            border: '1px solid',
            borderColor: isCurrentDay ? 'primary.main' : 'divider',
            '&:hover': {
              backgroundColor: isCurrentDay 
                ? 'primary.100' 
                : 'action.hover'
            },
            transition: 'background-color 0.2s'
          }}
          onClick={() => onDateClick(date)}
        >
          {/* 日付表示 */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: isCurrentDay ? 'bold' : 'normal',
              color: isCurrentMonth 
                ? isCurrentDay 
                  ? 'primary.main' 
                  : 'text.primary'
                : 'text.secondary',
              mb: 1
            }}
          >
            {date.getDate()}
          </Typography>

          {/* イベント表示 */}
          {loading ? (
            // ローディング中のスケルトン
            <Box>
              <Skeleton variant="rectangular" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="rectangular" height={20} width="60%" />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {dayEvents.slice(0, 3).map((event) => (
                <Chip
                  key={event.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" noWrap>
                        {formatTime(event.startDateTime)}
                      </Typography>
                      <Typography variant="caption" noWrap>
                        {event.title}
                      </Typography>
                    </Box>
                  }
                  size="small"
                  sx={{
                    height: 'auto',
                    minHeight: 20,
                    backgroundColor: event.color || '#2196F3',
                    color: 'white',
                    '& .MuiChip-label': {
                      px: 1,
                      py: 0.25,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%'
                    },
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                />
              ))}
              
              {/* 追加のイベント数表示 */}
              {dayEvents.length > 3 && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ pl: 1 }}
                >
                  +{dayEvents.length - 3}件
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* 曜日ヘッダー */}
      <Grid container spacing={0} sx={{ mb: 1 }}>
        {weekdays.map((weekday) => (
          <Grid item xs={12 / 7} key={weekday}>
            <Box
              sx={{
                textAlign: 'center',
                py: 1,
                backgroundColor: 'grey.100',
                borderRight: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderRight: 'none'
                }
              }}
            >
              <Typography variant="subtitle2" fontWeight="medium">
                {weekday}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* カレンダーグリッド */}
      <Grid container spacing={0}>
        {calendarDates.map((date, index) => renderDateCell(date, index))}
      </Grid>
    </Box>
  );
};

export default MonthView;
