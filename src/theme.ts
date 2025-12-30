import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      card: string;
      button: string;
      glow: string;
    };
    clipPaths: {
      button: string;
      card: string;
      navbar: string;
      input: string;
      badge: string;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      card?: string;
      button?: string;
      glow?: string;
    };
    clipPaths?: {
      button?: string;
      card?: string;
      navbar?: string;
      input?: string;
      badge?: string;
    };
  }
}

// Create MUI theme matching the existing Hexagon design system
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A855FF',
      light: '#E879F9',
      dark: '#7C3AED',
    },
    secondary: {
      main: '#A855FF',
      light: '#E879F9',
      dark: '#7C3AED',
    },
    background: {
      default: '#111318',
      paper: '#343A43',
    },
    text: {
      primary: '#FFF6EF',
      secondary: '#B8C0DD',
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#A855FF',
    },
    divider: '#4C5A86',
  },
  customShadows: {
    card: '0 8px 25px rgba(0, 0, 0, 0.7), 0 0 20px rgba(168, 85, 255, 0.18)',
    button: '0 4px 12px rgba(168, 85, 255, 0.45)',
    glow: '0 0 20px rgba(168, 85, 255, 0.45)',
  },
  clipPaths: {
    button: 'polygon(7% 0%, 92% 0%, 100% 50%, 92% 100%, 7% 100%, 0% 50%)',
    card: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)',
    navbar: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
    input: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
    badge: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
  },
  typography: {
    fontFamily: "'Gertika', sans-serif",
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
        root: ({ theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          boxShadow: theme.customShadows.card,
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            background: theme.palette.background.paper,
            borderRadius: '4px',
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
              boxShadow: theme.customShadows.glow,
            },
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.primary.main,
            fontWeight: 300,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.95rem',
          },
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
          },
          '& .MuiFormHelperText-root': {
            color: theme.palette.text.secondary,
          },
        }),
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.divider,
          '&.Mui-checked': {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.background.paper,
          padding: '0.875rem 1rem',
          marginLeft: 0,
          marginRight: 0,
          borderRadius: '4px',
          clipPath: theme.clipPaths.button,
          transition: 'all 0.3s ease',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            transform: 'translateY(-2px)',
            boxShadow: theme.customShadows.button,
          },
          '& .MuiCheckbox-root.Mui-checked ~ .MuiFormControlLabel-label': {
            color: theme.palette.primary.main,
            fontWeight: 300,
          },
        }),
        label: ({ theme }) => ({
          fontWeight: 200,
          fontSize: '0.9rem',
          textTransform: 'capitalize',
          letterSpacing: '0.03em',
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
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
