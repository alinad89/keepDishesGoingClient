import { Box, CircularProgress } from '@mui/material'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  centered?: boolean
}

const sizeMap = {
  small: 30,
  medium: 50,
  large: 70,
}

export function LoadingSpinner({ size = 'medium', centered = true }: LoadingSpinnerProps) {
  const content = (
    <CircularProgress
      size={sizeMap[size]}
      sx={{
        color: 'primary.main',
      }}
    />
  )

  if (centered) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        {content}
      </Box>
    )
  }

  return content
}
