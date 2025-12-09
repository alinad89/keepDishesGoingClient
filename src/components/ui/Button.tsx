import type {ButtonHTMLAttributes} from 'react'
import { Box } from '@mui/material'
import { keyframes } from '@mui/system'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'small'
  children: React.ReactNode
}

const shimmer = keyframes`
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
`

const buttonBaseStyles = (theme: any) => ({
  border: 'none',
  cursor: 'pointer',
  fontWeight: 200,
  fontSize: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit',
  position: 'relative',
  overflow: 'hidden',
  clipPath: theme.clipPaths.button,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
    transform: 'rotate(45deg)',
    transition: 'all 0.6s ease',
    opacity: 0,
  },
  '&:hover::before': {
    opacity: 1,
    animation: `${shimmer} 1.5s infinite`,
  },
})

const variantStyles = {
  primary: (theme: any) => ({
    ...buttonBaseStyles(theme),
    padding: '1rem 2rem',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    color: 'white',
    boxShadow: theme.customShadows.button,
    '&:hover': {
      transform: 'translateY(-3px) scale(1.02)',
      boxShadow: `0 10px 30px rgba(168, 85, 255, 0.45)`,
    },
    '&:active': {
      transform: 'translateY(-1px) scale(1)',
    },
  }),
  secondary: (theme: any) => ({
    ...buttonBaseStyles(theme),
    padding: '1rem 2rem',
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: `0 4px 15px rgba(168, 85, 255, 0.18)`,
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
      transform: 'translateY(-3px) scale(1.02)',
      boxShadow: `0 8px 25px rgba(168, 85, 255, 0.18)`,
    },
    '&:active': {
      transform: 'translateY(-1px) scale(1)',
    },
  }),
  small: (theme: any) => ({
    ...buttonBaseStyles(theme),
    padding: '0.5rem 1.25rem',
    fontSize: '0.85rem',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    color: 'white',
    boxShadow: theme.customShadows.button,
    '&:hover': {
      transform: 'translateY(-2px) scale(1.05)',
      boxShadow: `0 6px 20px rgba(168, 85, 255, 0.45)`,
    },
    '&:active': {
      transform: 'translateY(-1px) scale(1)',
    },
  }),
  outline: (theme: any) => ({
    ...buttonBaseStyles(theme),
    padding: '1rem 2rem',
    background: 'transparent',
    color: theme.palette.text.primary,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7)',
    '&:hover': {
      background: theme.palette.text.primary,
      color: theme.palette.background.default,
      transform: 'translateY(-3px) scale(1.02)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7)',
    },
    '&:active': {
      transform: 'translateY(-1px) scale(1)',
    },
  }),
}

function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  return (
    <Box
      component="button"
      sx={(theme) => ({
        ...variantStyles[variant](theme),
        ...(className && { className }),
      })}
      {...props}
    >
      {children}
    </Box>
  )
}

export default Button
