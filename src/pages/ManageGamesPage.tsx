import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  useGames,
  useDeleteGame,
  useChangeGameStatus,
  type Game,
  type GameStatusAction,
} from '../hooks/useGames';
import Button from '../components/ui/Button';
import FormCard from '../components/ui/FormCard';
import { useAuth } from '../hooks/useAuth';

function ManageGamesPage() {
  const navigate = useNavigate();
  const { games, loading, error, refetch } = useGames();
  const { deleteGameAsync, loading: deleting } = useDeleteGame();
  const { changeStatusAsync, loading: changingStatus } = useChangeGameStatus();
  const { hasRealmRole } = useAuth();

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<GameStatusAction>('MARK_READY_FOR_PUBLISHING');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleDeleteClick = (game: Game) => {
    setSelectedGame(game);
    setDeleteDialogOpen(true);
    setActionError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGame) return;

    try {
      await deleteGameAsync(selectedGame.id);
      setActionSuccess(`Game "${selectedGame.name}" deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedGame(null);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete game');
    }
  };

  const handleStatusClick = (game: Game) => {
    setSelectedGame(game);
    setStatusDialogOpen(true);
    setActionError(null);

    // Set default status based on user role
    const isAdmin = hasRealmRole('admin');
    if (isAdmin) {
      setSelectedStatus('MARK_ONLINE');
    } else {
      setSelectedStatus('MARK_READY_FOR_PUBLISHING');
    }
  };

  const handleStatusChange = async () => {
    if (!selectedGame) return;

    try {
      await changeStatusAsync({
        id: selectedGame.id,
        action: selectedStatus,
      });
      setActionSuccess(`Game status changed successfully`);
      setStatusDialogOpen(false);
      setSelectedGame(null);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to change status');
    }
  };

  const handleEditClick = (game: Game) => {
    navigate(`/developer/games/${game.id}/edit`);
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: '95%', width: '100%', mx: 'auto', py: 6, px: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: '95%', width: '100%', mx: 'auto', py: 6, px: 4 }}>
        {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h1"
          sx={(theme) => ({
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 200,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '100px',
              height: '2px',
              background: theme.palette.primary.main,
              mx: 'auto',
              mt: 2,
              boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            },
          })}
        >
          Manage Games
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            fontSize: { xs: '0.9rem', md: '1rem' },
            fontWeight: 100,
            color: theme.palette.text.secondary,
            maxWidth: '600px',
            mx: 'auto',
            mb: 4,
          })}
        >
          View, edit, and manage all your games
        </Typography>
        <Box component={Link} to="/developer/games/new" sx={{ textDecoration: 'none' }}>
          <Button variant="primary">
            Add New Game
          </Button>
        </Box>
      </Box>

      {/* Success/Error Messages */}
      {actionSuccess && (
        <Alert severity="success" onClose={() => setActionSuccess(null)} sx={{ mb: 3 }}>
          {actionSuccess}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading games: {error.apiMessage}
        </Alert>
      )}

      {/* Games List */}
      {games.length === 0 ? (
        <FormCard title="No Games Yet" description="Start by adding your first game to get started">
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box component={Link} to="/developer/games/new" sx={{ textDecoration: 'none' }}>
              <Button variant="primary">
                Add Your First Game
              </Button>
            </Box>
          </Box>
        </FormCard>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {games.map((game) => (
            <FormCard
              key={game.id}
              title={game.name}
              description={`Key: ${game.key} | Version: ${game.version}`}
            >
              <Typography variant="body2" sx={(theme) => ({ mb: 2, color: theme.palette.text.primary })}>
                {game.shortDescription}
              </Typography>

              {/* Status Badge */}
              {game.status && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={game.status.replace(/_/g, ' ')}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: 'bold',
                      backgroundColor:
                        game.status === 'ONLINE'
                          ? '#4caf50'
                          : game.status === 'READY_FOR_PUBLISHING'
                          ? '#ff9800'
                          : game.status === 'REJECTED'
                          ? '#f44336'
                          : game.status === 'IN_DEVELOPMENT'
                          ? '#2196f3'
                          : '#9e9e9e',
                      color: 'white',
                      '& .MuiChip-label': {
                        color: 'white',
                      },
                    }}
                  />
                </Box>
              )}

              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {game.tags.map((tag: string) => (
                  <Chip
                    key={tag}
                    label={tag.replace(/_/g, ' ')}
                    size="small"
                    sx={(theme) => ({
                      textTransform: 'capitalize',
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '& .MuiChip-label': {
                        color: 'white',
                      },
                    })}
                  />
                ))}
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="small"
                  onClick={() => navigate(`/developer/games/${game.id}`)}
                >
                  View Details
                </Button>
                <Button
                  variant="small"
                  onClick={() => handleEditClick(game)}
                >
                  Edit
                </Button>
                <Button
                  variant="small"
                  onClick={() => handleStatusClick(game)}
                >
                  Change Status
                </Button>
                <Button
                  variant="small"
                  onClick={() => handleDeleteClick(game)}
                >
                  Delete
                </Button>
              </Box>
            </FormCard>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedGame?.name}"? This action cannot be undone.
          </Typography>
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} disabled={deleting} variant="secondary">
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Change Game Status</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <Typography sx={{ mb: 2 }}>
            Change status for "{selectedGame?.name}"
          </Typography>
          {selectedGame?.status && (
            <Typography sx={{ mb: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
              Current status: <strong>{selectedGame.status}</strong>
            </Typography>
          )}
          <FormControl fullWidth>
            <InputLabel>Status Action</InputLabel>
            <Select
              value={selectedStatus}
              label="Status Action"
              onChange={(e) => setSelectedStatus(e.target.value as GameStatusAction)}
            >
              {hasRealmRole('developer') && (
                <MenuItem value="MARK_READY_FOR_PUBLISHING">Mark Ready for Publishing</MenuItem>
              )}
              {hasRealmRole('admin') && (
                <MenuItem value="MARK_ONLINE">Mark Online</MenuItem>
              )}
              {hasRealmRole('admin') && (
                <MenuItem value="MARK_REJECTED">Reject Game</MenuItem>
              )}
            </Select>
          </FormControl>
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} disabled={changingStatus} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleStatusChange} disabled={changingStatus} variant="primary">
            {changingStatus ? 'Changing...' : 'Change Status'}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </>
  );
}

export default ManageGamesPage;
