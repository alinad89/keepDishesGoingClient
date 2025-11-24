import { createTheme } from '@mui/material/styles';

// Create MUI theme matching the existing Hexagon design system
// Using light theme colors from App.css
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#194FCC', // --accent for light mode
      light: '#2E5FDD', // --accent-gradient-end
      dark: '#123A96', // --hover-accent
    },
    secondary: {
      main: '#194FCC',
      light: '#2E5FDD',
      dark: '#123A96',
    },
    background: {
      default: '#C1D4FF', // --bg-color
      paper: '#D6E3FF', // --card-bg
    },
    text: {
      primary: '#05132E', // --text-color
      secondary: '#304067', // --muted-text
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#194FCC',
    },
    divider: '#96B0F0', // --card-border
  },
  typography: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontWeightLight: 100,
    fontWeightRegular: 200,
    fontWeightMedium: 300,
    fontWeightBold: 400,
    h1: {
      fontWeight: 100,
      fontSize: '3rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 200,
      fontSize: '2.5rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    h3: {
      fontWeight: 200,
      fontSize: '2rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    h4: {
      fontWeight: 200,
      fontSize: '1.5rem',
      letterSpacing: '0.05em',
    },
    h5: {
      fontWeight: 200,
      fontSize: '1.25rem',
      letterSpacing: '0.03em',
    },
    h6: {
      fontWeight: 200,
      fontSize: '1rem',
      letterSpacing: '0.02em',
    },
    body1: {
      fontWeight: 200,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 200,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 300,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--bg-color) 100%)',
          boxShadow: '0 8px 25px var(--shadow-color), 0 0 20px var(--card-glow)',
          clipPath: 'var(--clip-shape-card)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'var(--card-bg)',
            borderRadius: '4px',
            clipPath: 'var(--clip-shape-input)',
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
              boxShadow: '0 0 20px var(--accent-glow)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'var(--accent)',
            fontWeight: 300,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.95rem',
          },
          '& .MuiInputBase-input': {
            color: 'var(--text-color)',
          },
          '& .MuiFormHelperText-root': {
            color: 'var(--muted-text)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'var(--card-border)',
          '&.Mui-checked': {
            color: 'var(--accent)',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          background: 'var(--card-bg)',
          padding: '0.875rem 1rem',
          marginLeft: 0,
          marginRight: 0,
          borderRadius: '4px',
          clipPath: 'var(--clip-shape-button)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, var(--card-bg), var(--bg-color))',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px var(--accent-glow)',
          },
          '& .MuiCheckbox-root.Mui-checked ~ .MuiFormControlLabel-label': {
            color: 'var(--accent)',
            fontWeight: 300,
          },
        },
        label: {
          fontWeight: 200,
          fontSize: '0.9rem',
          textTransform: 'capitalize',
          letterSpacing: '0.03em',
          color: 'var(--text-color)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          clipPath: 'var(--clip-shape-input)',
        },
        standardError: {
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
