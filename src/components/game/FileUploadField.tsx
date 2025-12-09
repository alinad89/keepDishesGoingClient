import { Box, Typography, FormHelperText, styled } from '@mui/material';
import type { UseFormRegisterReturn, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

const FileInput = styled('input')({
  padding: '1rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
  background: 'var(--card-bg)',
  color: 'var(--text-color)',
  borderRadius: '4px',
  width: '100%',
  transition: 'all 0.3s ease',
  fontFamily: "'Gertika', sans-serif",
  '&:hover': {
    opacity: 0.9,
  },
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 20px var(--accent-glow)',
  },
  '&::file-selector-button': {
    padding: '0.75rem 1.5rem',
    marginRight: '1.25rem',
    background: 'linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 300,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: '0.85rem',
    transition: 'all 0.3s ease',
    borderRadius: '4px',
    clipPath: 'var(--clip-shape-button)',
    '&:hover': {
      background: 'linear-gradient(135deg, var(--hover-accent), var(--accent))',
      boxShadow: '0 0 20px var(--accent-glow)',
      transform: 'translateY(-2px)',
    },
  },
});

interface FileUploadFieldProps {
  label: string;
  helperText?: string;
  accept?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  registration: UseFormRegisterReturn;
}

function FileUploadField({ label, helperText, accept, error, registration }: FileUploadFieldProps) {
  const errorMessage = typeof error?.message === 'string' ? error.message : undefined;

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 300,
        }}
      >
        {label}
      </Typography>
      <FileInput type="file" accept={accept} {...registration} />
      {helperText && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: 'var(--muted-text)',
            fontStyle: 'italic',
          }}
        >
          {helperText}
        </Typography>
      )}
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </Box>
  );
}

export default FileUploadField;
