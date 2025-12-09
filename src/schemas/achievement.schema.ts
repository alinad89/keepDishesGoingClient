import { z } from 'zod';

// ========================================
// Achievement Form Schemas
// ========================================

// Create achievement form schema
export const createAchievementSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),

  instructions: z.string()
    .min(10, 'Instructions must be at least 10 characters')
    .max(500, 'Instructions must be less than 500 characters'),

  icon: z.instanceof(File, { message: 'Icon image is required' })
    .refine((file) => file.size <= 2 * 1024 * 1024, 'Icon must be less than 2MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type),
      'Icon must be JPG, PNG, WebP, or SVG'
    ),
});

// Update achievement form schema (all fields optional)
export const updateAchievementSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),

  instructions: z.string()
    .min(10, 'Instructions must be at least 10 characters')
    .max(500, 'Instructions must be less than 500 characters')
    .optional(),

  icon: z.instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, 'Icon must be less than 2MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type),
      'Icon must be JPG, PNG, WebP, or SVG'
    )
    .optional(),
});

// Infer TypeScript types from schemas
export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
