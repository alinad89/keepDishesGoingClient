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
import Button from '../components/Button';
import FormCard from '../components/FormCard';

function ManageGamesPage() {
  const navigate = useNavigate();
  const { games, loading, error, refetch } = useGames();
  const { deleteGameAsync, loading: deleting } = useDeleteGame();
  const { changeStatusAsync, loading: changingStatus } = useChangeGameStatus();

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<GameStatusAction>('MARK-READY-FOR-PUBLISHING');
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
      <div className="developer-main-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="developer-main-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Manage Games</h1>
        <p className="page-subtitle">
          View, edit, and manage all your games
        </p>
        <Link to="/developer/games/new" style={{ textDecoration: 'none', marginTop: '2rem', display: 'inline-block' }}>
          <Button variant="primary">
            Add New Game
          </Button>
        </Link>
      </div>

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
            <Link to="/developer/games/new" style={{ textDecoration: 'none' }}>
              <Button variant="primary">
                Add Your First Game
              </Button>
            </Link>
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
              <Typography variant="body2" sx={{ mb: 2, color: 'var(--text-color)' }}>
                {game.shortDescription}
              </Typography>

              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {game.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag.replace(/_/g, ' ')}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      backgroundColor: 'var(--accent)',
                      color: 'white',
                      '& .MuiChip-label': {
                        color: 'white',
                      },
                    }}
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
          <FormControl fullWidth>
            <InputLabel>Status Action</InputLabel>
            <Select
              value={selectedStatus}
              label="Status Action"
              onChange={(e) => setSelectedStatus(e.target.value as GameStatusAction)}
            >
              <MenuItem value="MARK-READY-FOR-PUBLISHING">Mark Ready for Publishing</MenuItem>
              <MenuItem value="MARK-ONLINE">Mark Online (Admin)</MenuItem>
              <MenuItem value="MARK-REJECTED">Mark Rejected (Admin)</MenuItem>
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
    </div>
  );
}

export default ManageGamesPage;
