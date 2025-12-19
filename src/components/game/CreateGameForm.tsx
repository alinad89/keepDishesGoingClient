import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import type { CreateGameRequest, DeploymentMode } from '../../types/game.types';
import { useCreateGame } from '../../hooks/useGames';
import { GAME_TAGS } from '../../schemas/game.schema';
import { z } from 'zod';
import FormCard from '../ui/FormCard';
import Button from '../ui/Button';
import GameBasicInfoFields from './GameBasicInfoFields';
import GameMediaFields from './GameMediaFields';
import GameDescriptionFields from './GameDescriptionFields';
import GameFilesFields from './GameFilesFields';
import GameTagsSelector from './GameTagsSelector';

// Form data interface for react-hook-form (uses FileList instead of File)
interface CreateGameFormData {
  name: string;
  description: string;
  thumbnail: FileList;
  coverImage: FileList;
  rules: string;
  shortDescription: string;
  tags: (typeof GAME_TAGS)[number][];
  version: string;
  deploymentMode: DeploymentMode;
  url?: string;
  backendFiles?: FileList;
  priceUnits: number;
  isFree: boolean;
}

// Custom schema for form validation (adapts to FileList)
const createGameFormSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  shortDescription: z.string()
    .min(10, 'Short description must be at least 10 characters')
    .max(200, 'Short description must be less than 200 characters'),
  rules: z.string()
    .min(10, 'Rules must be at least 10 characters')
    .max(5000, 'Rules must be less than 5000 characters'),
  tags: z.array(z.enum(GAME_TAGS))
    .min(1, 'Select at least one tag')
    .max(5, 'Select at most 5 tags'),
  version: z.string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z (e.g., 1.0.0)'),
  deploymentMode: z.enum(['url', 'backend-zip']),
  url: z.string().optional(),
  priceUnits: z.coerce.number()
    .min(0, 'Price must be 0 or greater')
    .refine((value) => Number.isFinite(value), 'Price must be a number'),
  isFree: z.boolean(),
  thumbnail: z.custom<FileList>()
    .refine((files) => files?.length > 0, 'Thumbnail image is required')
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, 'Thumbnail must be less than 5MB')
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Thumbnail must be JPG, PNG, or WebP'
    ),
  coverImage: z.custom<FileList>()
    .refine((files) => files?.length > 0, 'Cover image is required')
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, 'Cover image must be less than 10MB')
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Cover image must be JPG, PNG, or WebP'
    ),
  backendFiles: z.custom<FileList>()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 50 * 1024 * 1024,
      'Backend files must be less than 50MB'
    )
    .refine(
      (files) => !files || files.length === 0 || files[0].type === 'application/zip' || files[0].type === 'application/x-zip-compressed',
      'Backend files must be a ZIP file'
    )
    .optional(),
}).refine(
  (data) => {
    // If deployment mode is backend-zip, backendFiles must be provided
    if (data.deploymentMode === 'backend-zip') {
      return data.backendFiles && data.backendFiles.length > 0;
    }
    return true;
  },
  {
    message: 'Backend files are required for backend-zip deployment mode',
    path: ['backendFiles'],
  }
).refine(
  (data) => {
    // If deployment mode is url, url must be provided and valid
    if (data.deploymentMode === 'url') {
      if (!data.url || data.url === '') {
        return false;
      }
      try {
        new URL(data.url);
        return true;
      } catch {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Valid URL is required for URL deployment mode',
    path: ['url'],
  }
).refine(
  (data) => {
    if (!data.isFree) {
      return data.priceUnits > 0;
    }
    return true;
  },
  {
    message: 'Price must be greater than 0 unless the game is free',
    path: ['priceUnits'],
  }
);

export function CreateGameForm() {
  const navigate = useNavigate();
  const { createGameAsync, loading, error } = useCreateGame();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm<CreateGameFormData>({
    resolver: zodResolver(createGameFormSchema),
    defaultValues: {
      name: '',
      description: '',
      rules: '',
      shortDescription: '',
      tags: [],
      version: '1.0.0',
      deploymentMode: 'url',
      url: '',
      priceUnits: 0,
      isFree: true,
    },
  });

  const selectedTags = watch('tags');
  const deploymentMode = watch('deploymentMode');
  const isFree = watch('isFree');

  useEffect(() => {
    if (isFree) {
      // Ensure backend receives zero when marked free
      setValue('priceUnits', 0);
    }
  }, [isFree, setValue]);

  const onSubmit = async (data: CreateGameFormData) => {
    // Zod validation already ensures all required fields are present and valid
    const priceUnits = data.isFree ? 0 : data.priceUnits;
    const url = data.deploymentMode === 'url' ? data.url || '' : '';

    const request: CreateGameRequest = {
      deploymentMode: data.deploymentMode,
      metadata: {
        name: data.name,
        description: data.description,
        rules: data.rules,
        shortDescription: data.shortDescription,
        tags: data.tags,
        version: data.version,
        url,
        priceUnits,
      },
      thumbnail: data.thumbnail?.[0],
      coverImage: data.coverImage?.[0],
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
          <GameBasicInfoFields register={register} errors={errors} isFree={isFree} />
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
