import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * React アプリケーションのエントリーポイント
 * 
 * 機能:
 * - Reactアプリケーションのルート要素にマウント
 * - StrictModeでの開発時チェック有効化
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
