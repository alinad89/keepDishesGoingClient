import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: string
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 3,
      }}
    >
      {icon && (
        <Typography
          sx={{
            fontSize: '4rem',
            mb: 2,
            opacity: 0.5,
          }}
        >
          {icon}
        </Typography>
      )}
      <Typography
        variant="h5"
        sx={{
          color: 'text.secondary',
          fontWeight: 300,
          mb: description || action ? 1.5 : 0,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            opacity: 0.8,
            mb: action ? 3 : 0,
          }}
        >
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Box>
  )
}
