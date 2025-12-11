import type { UseFormRegister, FieldErrors, FieldValues, Path, FieldError } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, TextField, FormHelperText } from '@mui/material';
import FileUploadField from './FileUploadField';
import type { DeploymentMode } from '../../types/game.types';

interface GameFilesFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  deploymentMode: DeploymentMode;
}

function GameFilesFields<T extends FieldValues>({ register, errors, deploymentMode }: GameFilesFieldsProps<T>) {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="deployment-mode-label">Deployment Mode *</InputLabel>
        <Select
          labelId="deployment-mode-label"
          label="Deployment Mode *"
          defaultValue="url"
          {...register('deploymentMode' as Path<T>, { required: 'Deployment mode is required' })}
        >
          <MenuItem value="url">URL (Externally Hosted)</MenuItem>
          <MenuItem value="backend-zip">Backend ZIP (Self-Hosted)</MenuItem>
        </Select>
        <FormHelperText>
          Choose how your game backend will be deployed
        </FormHelperText>
      </FormControl>

      {deploymentMode === 'url' ? (
        <TextField
          fullWidth
          label="Game URL *"
          placeholder="https://example.com/your-game"
          error={!!errors.url}
          helperText={errors.url?.message?.toString() || 'The URL where your game is hosted'}
          {...register('url' as Path<T>, {
            required: 'Game URL is required for URL deployment mode',
            pattern: {
              value: /^https?:\/\/.+/,
              message: 'Please enter a valid URL',
            },
          })}
        />
      ) : (
        <FileUploadField
          label="Backend Files *"
          helperText="Backend game logic (ZIP, TAR, JAR, or similar archive)"
          accept=".zip,.tar,.tar.gz,.jar"
          error={errors.backendFiles as FieldError | undefined}
          registration={register('backendFiles' as Path<T>, {
            required: deploymentMode === 'backend-zip' ? 'Backend files are required for backend-zip mode' : false,
          })}
        />
      )}
    </>
  );
}

export default GameFilesFields;
