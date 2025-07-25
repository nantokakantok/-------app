import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  ButtonGroup,
  Toolbar,
  LinearProgress
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { CalendarViewMode } from '../types';

interface CalendarHeaderProps {
  title: string;
  viewMode: CalendarViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  loading?: boolean;
}

/**
 * カレンダーヘッダーコンポーネント
 * 
 * 機能:
 * - 現在の表示期間のタイトル表示
 * - 前/次の期間への移動
 * - 今日への移動
 * - 表示モード（月/週/日）の切り替え
 * - ローディングインジケーター
 */
const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
  loading = false
}) => {
  return (
    <>
      <Toolbar 
        sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          px: { xs: 1, sm: 2 }
        }}
      >
        {/* 左側: ナビゲーションボタン */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={onPrevious}
            disabled={loading}
            aria-label="前の期間"
            size="small"
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <IconButton 
            onClick={onNext}
            disabled={loading}
            aria-label="次の期間"
            size="small"
          >
            <ChevronRightIcon />
          </IconButton>
          
          <Button
            onClick={onToday}
            disabled={loading}
            startIcon={<TodayIcon />}
            variant="outlined"
            size="small"
            sx={{ ml: 1 }}
          >
            今日
          </Button>
        </Box>

        {/* 中央: タイトル */}
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            flexGrow: 1,
            textAlign: 'center',
            fontWeight: 'medium',
            color: 'text.primary',
            mx: 2
          }}
        >
          {title}
        </Typography>

        {/* 右側: 表示モード切り替え */}
        <ButtonGroup 
          variant="outlined" 
          size="small"
          aria-label="表示モード選択"
        >
          <Button
            onClick={() => onViewModeChange(CalendarViewMode.Month)}
            variant={viewMode === CalendarViewMode.Month ? 'contained' : 'outlined'}
            disabled={loading}
          >
            月
          </Button>
          <Button
            onClick={() => onViewModeChange(CalendarViewMode.Week)}
            variant={viewMode === CalendarViewMode.Week ? 'contained' : 'outlined'}
            disabled={loading}
          >
            週
          </Button>
          <Button
            onClick={() => onViewModeChange(CalendarViewMode.Day)}
            variant={viewMode === CalendarViewMode.Day ? 'contained' : 'outlined'}
            disabled={loading}
          >
            日
          </Button>
        </ButtonGroup>
      </Toolbar>

      {/* ローディングインジケーター */}
      {loading && (
        <LinearProgress 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }} 
        />
      )}
    </>
  );
};

export default CalendarHeader;
