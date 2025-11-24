import { Card as MuiCard, CardContent, Box, Typography } from '@mui/material'

interface CardProps {
  icon?: string
  title: string
  description: string
  children?: React.ReactNode
  className?: string
}

function Card({ icon, title, description, children, className = '' }: CardProps) {
  return (
    <MuiCard
      className={className}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s ease',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, transparent 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.15), transparent 55%)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
          clipPath: 'polygon(7% 0%, 93% 0%, 100% 18%, 100% 82%, 93% 100%, 7% 100%, 0% 82%, 0% 18%)',
        },
        '&:hover': {
          transform: 'translateY(-10px) scale(1.02)',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.3)',
          '&::before': {
            opacity: 0.3,
          },
          '&::after': {
            opacity: 0.5,
          },
          '& .card-icon': {
            transform: 'scale(1.1) rotate(5deg)',
            filter: 'drop-shadow(0 6px 12px rgba(16, 185, 129, 0.5))',
          },
        },
      }}
    >
      <CardContent sx={{ p: 5, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, position: 'relative', zIndex: 1 }}>
        {icon && (
          <Box
            className="card-icon"
            sx={{
              fontSize: '3rem',
              filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
          >
            {icon}
          </Box>
        )}
        <Typography
          variant="h4"
          sx={{
            fontSize: '1.5rem',
            fontWeight: 200,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-color)',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'var(--muted-text)',
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {description}
        </Typography>
        {children}
      </CardContent>
    </MuiCard>
  )
}

export default Card
