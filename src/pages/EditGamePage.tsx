import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Button as MuiButton } from '@mui/material';
import { useGame, useUpdateGame } from '../hooks/useGames';
import { CreateGameForm } from '../components/CreateGameForm';
import type { CreateGameRequest } from '../types/api';

function EditGamePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { game, loading: loadingGame, error: loadError } = useGame(id);
  const { updateGameAsync, loading: updating } = useUpdateGame();

  const handleUpdate = async (data: CreateGameRequest) => {
    if (!id) return;

    try {
      // Convert CreateGameRequest to UpdateGameRequest
      await updateGameAsync(id, {
        description: data.description,
        thumbnail: data.thumbnail,
        coverImage: data.coverImage,
        rules: data.rules,
        shortDescription: data.shortDescription,
        tags: data.tags,
        version: data.version,
        backendFiles: data.backendFiles,
        frontendFiles: data.frontendFiles,
      });
      alert(`Game "${data.name}" updated successfully`);
      navigate('/developer/games');
    } catch (err) {
      console.error('Failed to update game:', err);
    }
  };

  if (loadingGame) {
    return (
      <div className="developer-main-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (loadError || !game) {
    return (
      <div className="developer-main-container">
        <Alert severity="error" sx={{ mb: 3 }}>
          {loadError?.apiMessage || 'Game not found'}
        </Alert>
        <MuiButton variant="outlined" onClick={() => navigate('/developer/games')}>
          Back to Games
        </MuiButton>
      </div>
    );
  }

  return (
    <div className="developer-main-container">
      <div className="page-header">
        <h1 className="page-title">Edit Game</h1>
        <p className="page-subtitle">
          Update your game's information
        </p>
      </div>

      {/* Note: The CreateGameForm would need to be modified to accept default values
          For now, this is a placeholder showing the structure */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Editing: {game.name} (ID: {game.id})
      </Alert>

      {/* Placeholder form - you'll need to modify CreateGameForm to accept defaultValues */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <MuiButton
          variant="outlined"
          onClick={() => navigate('/developer/games')}
          disabled={updating}
          sx={{
            borderColor: 'var(--accent)',
            color: 'var(--accent)',
            '&:hover': {
              borderColor: 'var(--hover-accent)',
              backgroundColor: 'rgba(224, 92, 26, 0.1)',
            },
          }}
        >
          Cancel
        </MuiButton>
        <MuiButton
          variant="contained"
          onClick={() => navigate(`/developer/games/${id}`)}
          sx={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'var(--hover-accent)',
            },
          }}
        >
          View Game Details
        </MuiButton>
      </Box>
    </div>
  );
}

export default EditGamePage;
