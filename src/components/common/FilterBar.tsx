import type { ReactNode } from 'react'
import { Box } from '@mui/material'

interface FilterBarProps {
  children: ReactNode
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  )
}
