import { TextField, FormHelperText, FormControlLabel, Checkbox, InputAdornment } from '@mui/material';
import type { UseFormRegister, FieldErrors, FieldValues, Path } from 'react-hook-form';

interface GameBasicInfoFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  isFree: boolean;
}

function GameBasicInfoFields<T extends FieldValues>({ register, errors, isFree }: GameBasicInfoFieldsProps<T>) {
  return (
    <>
      <TextField
        fullWidth
        label="Game Name *"
        error={!!errors.name}
        {...register('name' as Path<T>, { required: 'Game name is required' })}
      />
      {errors.name && (
        <FormHelperText error sx={{ mt: -1 }}>
          {errors.name.message?.toString()}
        </FormHelperText>
      )}

      <TextField
        fullWidth
        label="Version *"
        error={!!errors.version}
        {...register('version' as Path<T>, { required: 'Version is required' })}
      />
      {errors.version && (
        <FormHelperText error sx={{ mt: -1 }}>
          {errors.version.message?.toString()}
        </FormHelperText>
      )}

      <FormControlLabel
        control={(
          <Checkbox
            {...register('isFree' as Path<T>)}
            checked={isFree}
          />
        )}
        label="This game is free"
        sx={{ mb: 1 }}
      />

      <TextField
        fullWidth
        label="Price (USD)"
        type="number"
        inputProps={{ step: '0.01', min: 0 }}
        disabled={isFree}
        error={!!errors.priceUnits}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        {...register('priceUnits' as Path<T>, { valueAsNumber: true })}
      />
      {errors.priceUnits && (
        <FormHelperText error sx={{ mt: -1 }}>
          {errors.priceUnits.message?.toString()}
        </FormHelperText>
      )}
    </>
  );
}

export default GameBasicInfoFields;
