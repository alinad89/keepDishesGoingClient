import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Chip } from '@mui/material';
import Button from '../ui/Button';
import type { GameSessionDetail } from '../../types/game-session.types';

interface GameSessionDetailModalProps {
  open: boolean;
  onClose: () => void;
  session: GameSessionDetail | null;
  loading: boolean;
}

const resultLabelMap: Record<string, string> = {
  win: 'Victory',
  lose: 'Defeat',
  draw: 'Draw',
};

const resultColorMap: Record<string, 'success' | 'error' | 'default'> = {
  win: 'success',
  lose: 'error',
  draw: 'default',
};

function GameSessionDetailModal({ open, onClose, session, loading }: GameSessionDetailModalProps) {
  const normalizeResult = (result?: string) => result?.toLowerCase?.() || '';
  const normalizedResult = normalizeResult(session?.result);
  const resultLabel = resultLabelMap[normalizedResult] || session?.result;
  const resultColor = resultColorMap[normalizedResult] || 'default';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
        }
      }}
    >
      {loading ? (
        <DialogContent>
          <Typography sx={{ color: 'var(--text-color)' }}>Loading session details...</Typography>
        </DialogContent>
      ) : session ? (
        <>
          <DialogTitle sx={{
            color: 'var(--text-color)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            pb: 2
          }}>
            Game Session Details
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {session.id && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Session ID
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-color)', fontFamily: 'monospace', mt: 0.5 }}>
                    {session.id}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Result
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={resultLabel}
                    color={resultColor}
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Finished At
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-color)', mt: 0.5 }}>
                  {new Date(session.date).toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'medium'
                  })}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </DialogActions>
        </>
      ) : (
        <DialogContent>
          <Typography sx={{ color: 'var(--text-color)' }}>Session not found</Typography>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default GameSessionDetailModal;
