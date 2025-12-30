import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
}: ConfirmDialogProps) {
  console.log('[ConfirmDialog] Rendering with open=', open);

  const getAccentColor = () => {
    switch (variant) {
      case 'danger':
        return '#ff6b6b';
      case 'warning':
        return '#ffd93d';
      case 'info':
        return 'var(--accent)';
      default:
        return 'var(--accent)';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          background: 'var(--card-bg)',
          color: 'var(--text)',
          border: `2px solid ${getAccentColor()}`,
          borderRadius: '12px',
          minWidth: '400px',
          maxWidth: '500px',
        },
      }}
    >
      <DialogTitle
        sx={{
          color: getAccentColor(),
          fontWeight: 'bold',
          fontSize: '1.5rem',
          paddingBottom: '0.5rem',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            color: 'var(--text)',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          padding: '1rem 1.5rem',
          gap: '0.75rem',
        }}
      >
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
