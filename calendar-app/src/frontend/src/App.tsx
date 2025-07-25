import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import CalendarApp from './components/CalendarApp';

/**
 * Material-UIテーマの設定
 * 日本語に適したフォントと色設定
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: [
      '"Noto Sans JP"',
      '"Hiragino Sans"',
      '"Hiragino Kaku Gothic ProN"',
      '"Arial"',
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // ボタンテキストの大文字変換を無効化
        },
      },
    },
  },
});

/**
 * アプリケーションのメインコンポーネント
 * 
 * 機能:
 * - Material-UIテーマの適用
 * - グローバルスタイリングの設定
 * - カレンダーアプリケーションのレンダリング
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box sx={{ minHeight: '100vh' }}>
          <CalendarApp />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
