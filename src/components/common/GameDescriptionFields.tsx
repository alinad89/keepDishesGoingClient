import { TextField, FormHelperText } from '@mui/material';
import type { UseFormRegister, FieldErrors, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface GameDescriptionFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const getErrorMessage = (error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>) =>
  typeof error?.message === 'string' ? error.message : undefined;

function GameDescriptionFields({ register, errors }: GameDescriptionFieldsProps) {
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
          {getErrorMessage(errors.shortDescription)}
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
          {getErrorMessage(errors.description)}
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
          {getErrorMessage(errors.rules)}
        </FormHelperText>
      )}
    </>
  );
}

export default GameDescriptionFields;
