import type { UseFormRegister, FieldErrors, FieldValues, Path, FieldError } from 'react-hook-form';
import FileUploadField from './FileUploadField';

interface GameMediaFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

function GameMediaFields<T extends FieldValues>({ register, errors }: GameMediaFieldsProps<T>) {
  return (
    <>
      <FileUploadField
        label="Thumbnail Image"
        helperText="Small preview image (recommended: 300x200px)"
        accept="image/*"
        error={errors.thumbnail as FieldError | undefined}
        registration={register('thumbnail' as Path<T>)}
      />

      <FileUploadField
        label="Cover Image"
        helperText="Large cover image (recommended: 1920x1080px)"
        accept="image/*"
        error={errors.coverImage as FieldError | undefined}
        registration={register('coverImage' as Path<T>)}
      />
    </>
  );
}

export default GameMediaFields;
