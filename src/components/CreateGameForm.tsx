import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import type { CreateGameRequest, DeploymentMode } from '../types/api';
import { useCreateGame } from '../hooks/useGames';
import FormCard from './FormCard';
import Button from './Button';
import GameBasicInfoFields from './common/GameBasicInfoFields';
import GameMediaFields from './common/GameMediaFields';
import GameDescriptionFields from './common/GameDescriptionFields';
import GameFilesFields from './common/GameFilesFields';
import GameTagsSelector from './common/GameTagsSelector';

interface CreateGameFormData {
  name: string;
  description: string;
  thumbnail: FileList;
  coverImage: FileList;
  rules: string;
  shortDescription: string;
  tags: string[];
  version: string;
  deploymentMode: DeploymentMode;
  url?: string;
  backendFiles?: FileList;
}

export function CreateGameForm() {
  const navigate = useNavigate();
  const { createGameAsync, loading, error } = useCreateGame();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<CreateGameFormData>({
    defaultValues: {
      name: '',
      description: '',
      rules: '',
      shortDescription: '',
      tags: [],
      version: '1.0.0',
      deploymentMode: 'url',
      url: '',
    },
  });

  const selectedTags = watch('tags');
  const deploymentMode = watch('deploymentMode');

  const onSubmit = async (data: CreateGameFormData) => {
    // Validate required files
    if (!data.thumbnail || data.thumbnail.length === 0) {
      alert('Please select a thumbnail image');
      return;
    }
    if (!data.coverImage || data.coverImage.length === 0) {
      alert('Please select a cover image');
      return;
    }

    // Validate deployment-mode-specific requirements
    if (data.deploymentMode === 'url') {
      if (!data.url) {
        alert('Please enter a game URL for URL deployment mode');
        return;
      }
    } else if (data.deploymentMode === 'backend-zip') {
      if (!data.backendFiles || data.backendFiles.length === 0) {
        alert('Please select backend files for backend-zip deployment mode');
        return;
      }
    }

    const request: CreateGameRequest = {
      deploymentMode: data.deploymentMode,
      metadata: {
        name: data.name,
        description: data.description,
        rules: data.rules,
        shortDescription: data.shortDescription,
        tags: data.tags,
        version: data.version,
        url: data.url || '',
      },
      thumbnail: data.thumbnail[0],
      coverImage: data.coverImage[0],
      backendFiles: data.backendFiles?.[0],
    };

    try {
      const response = await createGameAsync(request);
      alert(`Game "${data.name}" created successfully with key: ${response.key}`);
      navigate('/developer/dashboard');
    } catch (err) {
      console.error('Failed to create game:', err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 1100,
        mx: 'auto',
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Row 1: Basic info + Media */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
          gap: 3,
        }}
      >
        <FormCard title="Basic Information" description="Enter your game's core details">
          <GameBasicInfoFields register={register} errors={errors} />
        </FormCard>

        <FormCard title="Media & Assets" description="Upload images for your game">
          <GameMediaFields register={register} errors={errors} />
        </FormCard>
      </Box>

      {/* Row 2: Description (full width) */}
      <FormCard title="Description" description="Describe your game for players">
        <GameDescriptionFields register={register} errors={errors} />
      </FormCard>

      {/* Row 3: Game files + Tags */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
          gap: 3,
        }}
      >
        <FormCard title="Game Files" description="Upload your game's source code">
          <GameFilesFields register={register} errors={errors} deploymentMode={deploymentMode} />
        </FormCard>

        <FormCard title="Tags" description="Categorize your game with relevant tags">
          <GameTagsSelector control={control} errors={errors} selectedTags={selectedTags} />
        </FormCard>
      </Box>

      {error && (
        <Alert severity="error">
          <strong>Error ({error.status}):</strong> {error.apiMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
        <Button
          variant="secondary"
          onClick={() => navigate('/developer/dashboard')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating Game...' : 'Create Game'}
        </Button>
      </Box>
    </Box>
  );
}
