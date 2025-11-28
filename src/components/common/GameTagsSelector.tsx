import { Box, Typography, Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';

const GAME_TAGS = [
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
];

interface GameTagsSelectorProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  selectedTags: string[];
}

function GameTagsSelector({ control, errors, selectedTags }: GameTagsSelectorProps) {
  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 300,
        }}
      >
        Select Tags
      </Typography>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              },
              gap: 1,
            }}
          >
            {GAME_TAGS.map((tag) => (
              <FormControlLabel
                key={tag}
                control={
                  <Checkbox
                    checked={field.value?.includes(tag) || false}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(field.value || []), tag]
                        : (field.value || []).filter((t: string) => t !== tag);
                      field.onChange(newValue);
                    }}
                  />
                }
                label={tag.replace(/_/g, ' ')}
              />
            ))}
          </Box>
        )}
      />
      {errors.tags && (
        <FormHelperText error sx={{ mt: 1 }}>
          {errors.tags.message}
        </FormHelperText>
      )}
      {selectedTags && selectedTags.length > 0 && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: 'var(--card-bg)',
            borderRadius: 1,
            boxShadow: '0 0 15px var(--accent-glow)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'var(--accent)',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <strong>Selected:</strong> {selectedTags.join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default GameTagsSelector;
