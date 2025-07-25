import React from 'react';
import { Box } from '@mui/material';
import { CalendarEvent, CalendarViewMode } from '../types';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

interface CalendarViewProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
  events: CalendarEvent[];
  loading: boolean;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * カレンダービューコンポーネント
 * 
 * 機能:
 * - 表示モードに応じた適切なビューコンポーネントの表示
 * - 月表示、週表示、日表示の切り替え
 */
const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  viewMode,
  events,
  loading,
  onDateClick,
  onEventClick
}) => {
  /**
   * 表示モードに応じたビューコンポーネントをレンダリング
   */
  const renderView = () => {
    const commonProps = {
      currentDate,
      events,
      loading,
      onDateClick,
      onEventClick
    };

    switch (viewMode) {
      case CalendarViewMode.Month:
        return <MonthView {...commonProps} />;
      case CalendarViewMode.Week:
        return <WeekView {...commonProps} />;
      case CalendarViewMode.Day:
        return <DayView {...commonProps} />;
      default:
        return <MonthView {...commonProps} />;
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: 500,
        position: 'relative',
        backgroundColor: 'background.default'
      }}
    >
      {renderView()}
    </Box>
  );
};

export default CalendarView;
