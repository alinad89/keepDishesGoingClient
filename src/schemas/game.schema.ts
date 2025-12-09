import { z } from 'zod';

// ========================================
// Game Form Schemas
// ========================================

// Available game tags
export const GAME_TAGS = [
  'STRATEGY',
  'MULTIPLAYER',
  'SCI_FI',
  'COMPETITIVE',
  'PUZZLE',
  'SINGLEPLAYER',
  'CASUAL',
  'BRAIN_TEASER',
  'RACING',
  'ACTION',
  'RPG',
  'ADVENTURE',
  'FANTASY',
  'STORY_RICH',
  'CARD_GAME',
  'ROGUELIKE',
  'DUNGEON_CRAWLER',
  'PROCEDURAL',
  'COOP',
  'BOARD',
] as const;

// Deployment mode enum
export const deploymentModeSchema = z.enum(['url', 'backend-zip']);

// Game metadata schema (used in create/update forms)
export const gameMetadataSchema = z.object({
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

  url: z.string()
    .url('Must be a valid URL')
    .or(z.literal('')), // Allow empty string for backend-zip mode
});

// Create game form schema
export const createGameSchema = z.object({
  deploymentMode: deploymentModeSchema,
  metadata: gameMetadataSchema,
  thumbnail: z.instanceof(File, { message: 'Thumbnail image is required' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Thumbnail must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Thumbnail must be JPG, PNG, or WebP'
    ),
  coverImage: z.instanceof(File, { message: 'Cover image is required' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Cover image must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Cover image must be JPG, PNG, or WebP'
    ),
  backendFiles: z.instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, 'Backend files must be less than 50MB')
    .refine(
      (file) => file.type === 'application/zip' || file.type === 'application/x-zip-compressed',
      'Backend files must be a ZIP file'
    )
    .optional(),
}).refine(
  (data) => {
    // If deployment mode is backend-zip, backendFiles must be provided
    if (data.deploymentMode === 'backend-zip') {
      return !!data.backendFiles;
    }
    return true;
  },
  {
    message: 'Backend files are required for backend-zip deployment mode',
    path: ['backendFiles'],
  }
).refine(
  (data) => {
    // If deployment mode is url, url must be provided
    if (data.deploymentMode === 'url') {
      return data.metadata.url !== '';
    }
    return true;
  },
  {
    message: 'URL is required for URL deployment mode',
    path: ['metadata', 'url'],
  }
);

// Update game form schema (all fields optional)
export const updateGameSchema = z.object({
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),

  shortDescription: z.string()
    .min(10, 'Short description must be at least 10 characters')
    .max(200, 'Short description must be less than 200 characters')
    .optional(),

  rules: z.string()
    .min(10, 'Rules must be at least 10 characters')
    .max(5000, 'Rules must be less than 5000 characters')
    .optional(),

  tags: z.array(z.enum(GAME_TAGS))
    .min(1, 'Select at least one tag')
    .max(5, 'Select at most 5 tags')
    .optional(),

  version: z.string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z (e.g., 1.0.0)')
    .optional(),

  thumbnail: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Thumbnail must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Thumbnail must be JPG, PNG, or WebP'
    )
    .optional(),

  coverImage: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Cover image must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Cover image must be JPG, PNG, or WebP'
    )
    .optional(),

  backendFiles: z.instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, 'Backend files must be less than 50MB')
    .refine(
      (file) => file.type === 'application/zip' || file.type === 'application/x-zip-compressed',
      'Backend files must be a ZIP file'
    )
    .optional(),

  frontendFiles: z.instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, 'Frontend files must be less than 50MB')
    .refine(
      (file) => file.type === 'application/zip' || file.type === 'application/x-zip-compressed',
      'Frontend files must be a ZIP file'
    )
    .optional(),
});

// Change game status schema
export const changeGameStatusSchema = z.object({
  id: z.string().uuid('Invalid game ID'),
  action: z.enum(['MARK-READY-FOR-PUBLISHING', 'MARK-ONLINE', 'MARK-REJECTED']),
});

// Infer TypeScript types from schemas
export type GameMetadataInput = z.infer<typeof gameMetadataSchema>;
export type CreateGameInput = z.infer<typeof createGameSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
export type ChangeGameStatusInput = z.infer<typeof changeGameStatusSchema>;
