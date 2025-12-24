import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Chip } from '@mui/material';
import Button from '../ui/Button';
import type { PlatformGameDetails } from '../../types/game.types';

interface GameDetailsModalProps {
  open: boolean;
  onClose: () => void;
  game: PlatformGameDetails | null;
  loading: boolean;
}

function GameDetailsModal({ open, onClose, game, loading }: GameDetailsModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      {loading ? (
        <DialogContent>
          <Typography>Loading game details...</Typography>
        </DialogContent>
      ) : game ? (
        <>
          <DialogTitle>{game.name}</DialogTitle>
          <DialogContent>
            {game.coverImageUrl && (
              <Box
                component="img"
                src={game.coverImageUrl}
                alt={game.name}
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  mb: 2
                }}
              />
            )}

            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {game.description}
              </Typography>
            </Box>

            {game.tags && game.tags.length > 0 && (
              <Box mb={2}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {game.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {game.rules && (
              <Box mb={2}>
                <Typography variant="h6" gutterBottom>
                  Rules
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {game.rules}
                </Typography>
              </Box>
            )}

            {game.achievements && game.achievements.length > 0 && (
              <Box mb={2}>
                <Typography variant="h6" gutterBottom>
                  Achievements ({game.achievements.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {game.achievements.map((achievement) => (
                    <Box
                      key={achievement.id}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        p: 1.5,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider'
                      }}
                    >
                      {achievement.iconUrl && (
                        <Box
                          component="img"
                          src={achievement.iconUrl}
                          alt={achievement.name}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 0.5
                          }}
                        />
                      )}
                      <Box flex={1}>
                        <Typography variant="subtitle1" gutterBottom>
                          {achievement.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.instructions}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
            <Button variant="primary">
              Play Now
            </Button>
          </DialogActions>
        </>
      ) : (
        <DialogContent>
          <Typography>Game not found</Typography>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default GameDetailsModal;
