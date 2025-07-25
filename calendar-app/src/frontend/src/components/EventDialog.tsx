import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { CalendarEvent, EventCategory, EventColor } from '../types';
import { useEventForm } from '../hooks';
import { CalendarEventService } from '../services';
import { toDateTimeLocalString } from '../utils/dateUtils';

interface EventDialogProps {
  open: boolean;
  event?: CalendarEvent | null;
  onClose: () => void;
  onEventCreated: (event: CalendarEvent) => void;
  onEventUpdated: (event: CalendarEvent) => void;
  onEventDeleted: (eventId: number) => void;
}

/**
 * イベント作成・編集ダイアログコンポーネント
 * 
 * 機能:
 * - 新規イベントの作成
 * - 既存イベントの編集
 * - イベントの削除
 * - フォームバリデーション
 */
const EventDialog: React.FC<EventDialogProps> = ({
  open,
  event,
  onClose,
  onEventCreated,
  onEventUpdated,
  onEventDeleted
}) => {
  const {
    formData,
    validationErrors,
    loading,
    updateFormData,
    setFormDataForEdit,
    resetForm,
    createEvent,
    updateEvent,
    clearError
  } = useEventForm();

  const isEditing = !!event;
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  /**
   * ダイアログが開いた時の初期化処理
   */
  useEffect(() => {
    if (open) {
      if (event) {
        // 編集モード: 既存のイベントデータを設定
        setFormDataForEdit({
          title: event.title,
          description: event.description,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          location: event.location,
          category: event.category,
          color: event.color
        });
      } else {
        // 新規作成モード: フォームをリセット
        resetForm();
      }
    }
  }, [open, event, setFormDataForEdit, resetForm]);

  /**
   * フォーム送信処理
   */
  const handleSubmit = async () => {
    try {
      if (isEditing && event) {
        // 更新
        const updatedEvent = await updateEvent(event.id);
        if (updatedEvent) {
          onEventUpdated(updatedEvent);
        }
      } else {
        // 新規作成
        const createdEvent = await createEvent();
        if (createdEvent) {
          onEventCreated(createdEvent);
        }
      }
    } catch (error) {
      console.error('イベント保存エラー:', error);
    }
  };

  /**
   * イベント削除処理
   */
  const handleDelete = async () => {
    if (!event) return;

    if (!window.confirm('このイベントを削除しますか？')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await CalendarEventService.deleteEvent(event.id);
      onEventDeleted(event.id);
    } catch (error) {
      console.error('イベント削除エラー:', error);
      alert('イベントの削除に失敗しました');
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * ダイアログを閉じる
   */
  const handleClose = () => {
    clearError();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: 600 }
      }}
    >
      {/* ダイアログヘッダー */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isEditing ? <SaveIcon /> : <AddIcon />}
        <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
          {isEditing ? 'イベントを編集' : '新しいイベントを作成'}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ダイアログ本文 */}
      <DialogContent dividers>
        {loading.error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {loading.error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* タイトル */}
          <Grid item xs={12}>
            <TextField
              label="タイトル *"
              fullWidth
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              error={!!validationErrors.title}
              helperText={validationErrors.title}
              disabled={loading.isLoading}
            />
          </Grid>

          {/* 説明 */}
          <Grid item xs={12}>
            <TextField
              label="説明"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
              disabled={loading.isLoading}
            />
          </Grid>

          {/* 開始日時 */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="開始日時 *"
              type="datetime-local"
              fullWidth
              value={toDateTimeLocalString(
                typeof formData.startDateTime === 'string' 
                  ? new Date(formData.startDateTime)
                  : formData.startDateTime
              )}
              onChange={(e) => updateFormData('startDateTime', new Date(e.target.value))}
              error={!!validationErrors.startDateTime}
              helperText={validationErrors.startDateTime}
              disabled={loading.isLoading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* 終了日時 */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="終了日時 *"
              type="datetime-local"
              fullWidth
              value={toDateTimeLocalString(
                typeof formData.endDateTime === 'string' 
                  ? new Date(formData.endDateTime)
                  : formData.endDateTime
              )}
              onChange={(e) => updateFormData('endDateTime', new Date(e.target.value))}
              error={!!validationErrors.endDateTime}
              helperText={validationErrors.endDateTime}
              disabled={loading.isLoading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* 場所 */}
          <Grid item xs={12}>
            <TextField
              label="場所"
              fullWidth
              value={formData.location}
              onChange={(e) => updateFormData('location', e.target.value)}
              error={!!validationErrors.location}
              helperText={validationErrors.location}
              disabled={loading.isLoading}
            />
          </Grid>

          {/* カテゴリ */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                value={formData.category || ''}
                label="カテゴリ"
                onChange={(e) => updateFormData('category', e.target.value)}
                error={!!validationErrors.category}
                disabled={loading.isLoading}
              >
                {Object.values(EventCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* 色 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>色</InputLabel>
              <Select
                value={formData.color || EventColor.Blue}
                label="色"
                onChange={(e) => updateFormData('color', e.target.value)}
                error={!!validationErrors.color}
                disabled={loading.isLoading}
              >
                {Object.entries(EventColor).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: value,
                          borderRadius: 1
                        }}
                      />
                      {key}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      {/* ダイアログアクション */}
      <DialogActions sx={{ p: 2, gap: 1 }}>
        {/* 削除ボタン（編集時のみ） */}
        {isEditing && (
          <Button
            onClick={handleDelete}
            color="error"
            startIcon={deleteLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
            disabled={loading.isLoading || deleteLoading}
            sx={{ mr: 'auto' }}
          >
            削除
          </Button>
        )}

        {/* キャンセルボタン */}
        <Button 
          onClick={handleClose}
          disabled={loading.isLoading || deleteLoading}
        >
          キャンセル
        </Button>

        {/* 保存ボタン */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading.isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
          disabled={loading.isLoading || deleteLoading}
        >
          {isEditing ? '更新' : '作成'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
