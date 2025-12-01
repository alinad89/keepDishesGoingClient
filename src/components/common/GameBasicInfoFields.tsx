import { TextField, FormHelperText } from '@mui/material';
import type { UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form';

interface GameBasicInfoFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

function GameBasicInfoFields<T extends FieldValues>({ register, errors }: GameBasicInfoFieldsProps<T>) {
  return (
    <>
      <TextField
        fullWidth
        label="Game Name *"
        error={!!errors.name}
        {...register('name', { required: 'Game name is required' })}
      />
      {errors.name && (
        <FormHelperText error sx={{ mt: -1 }}>
          {errors.name.message}
        </FormHelperText>
      )}

      <TextField
        fullWidth
        label="Version *"
        error={!!errors.version}
        {...register('version', { required: 'Version is required' })}
      />
      {errors.version && (
        <FormHelperText error sx={{ mt: -1 }}>
          {errors.version.message}
        </FormHelperText>
      )}
    </>
  );
}

export default GameBasicInfoFields;
