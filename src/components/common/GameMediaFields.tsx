import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import FileUploadField from './FileUploadField';

interface GameMediaFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

function GameMediaFields({ register, errors }: GameMediaFieldsProps) {
  return (
    <>
      <FileUploadField
        label="Thumbnail Image"
        helperText="Small preview image (recommended: 300x200px)"
        accept="image/*"
        error={errors.thumbnail}
        registration={register('thumbnail')}
      />

      <FileUploadField
        label="Cover Image"
        helperText="Large cover image (recommended: 1920x1080px)"
        accept="image/*"
        error={errors.coverImage}
        registration={register('coverImage')}
      />
    </>
  );
}

export default GameMediaFields;
