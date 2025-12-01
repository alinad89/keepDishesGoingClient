import { TextField, FormHelperText } from '@mui/material';
import type { UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form';

interface GameDescriptionFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

function GameDescriptionFields<T extends FieldValues>({ register, errors }: GameDescriptionFieldsProps<T>) {
  return (
    <>
      <TextField
        fullWidth
        multiline
        rows={2}
        label="Short Description *"
        helperText="Maximum 150 characters"
        error={!!errors.shortDescription}
        {...register('shortDescription', {
          required: 'Short description is required',
          maxLength: {
            value: 150,
            message: 'Short description must be 150 characters or less',
          },
        })}
      />
      {errors.shortDescription && (
        <FormHelperText error sx={{ mt: -1 }}>
          {errors.shortDescription.message}
        </FormHelperText>
      )}

      <TextField
        fullWidth
        multiline
        rows={5}
        label="Full Description *"
        error={!!errors.description}
        {...register('description', { required: 'Full description is required' })}
      />
      {errors.description && (
        <FormHelperText error sx={{ mt: -1 }}>
          {errors.description.message}
        </FormHelperText>
      )}

      <TextField
        fullWidth
        multiline
        rows={5}
        label="Rules & Instructions *"
        error={!!errors.rules}
        {...register('rules', { required: 'Rules are required' })}
      />
      {errors.rules && (
        <FormHelperText error sx={{ mt: -1 }}>
          {errors.rules.message}
        </FormHelperText>
      )}
    </>
  );
}

export default GameDescriptionFields;
