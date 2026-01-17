import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      light: '#FFFFFF',
      dark: '#E0E0E0',
    },
    secondary: {
      main: '#004F9E',
      light: '#1976D2',
      dark: '#003A75',
    },
    background: {
      default: '#030D19',
      paper: 'rgba(255, 255, 255, 0.01)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Orbitron", "Montserrat", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontFamily: '"Orbitron", "Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              '& fieldset': {
                borderColor: '#004F9E',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: '#FFFFFF',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#FFFFFF',
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1,
            },
          },
          '& .MuiFormHelperText-root': {
            color: 'rgba(255, 255, 255, 0.6)',
            '&.Mui-error': {
              color: '#f44336',
            },
          },
        },
      },
    },
  },
});

export const formStyles = {
  pageContainer: {
    minHeight: '100vh',
    background: '#030D19',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  backgroundOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(/Kavlap-user-form-bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.15,
    zIndex: 0,
  },
  header: {
    background: 'linear-gradient(180deg, rgba(153, 153, 153, 0) 0%, rgba(0, 79, 158, 0.14) 100%)',
    backdropFilter: 'blur(4px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '16px 32px',
    position: 'relative' as const,
    zIndex: 10,
  },
  contentContainer: {
    position: 'relative' as const,
    zIndex: 1,
    padding: '40px 16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 72px)',
  },
  formCard: {
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.01) 0%, rgba(153, 153, 153, 0.01) 100%)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  stepperContainer: {
    marginBottom: '32px',
  },
  formTitle: {
    fontFamily: '"Orbitron", "Montserrat", sans-serif',
    fontSize: '1.75rem',
    fontWeight: 600,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  nextButton: {
    marginTop: '24px',
    padding: '12px 32px',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: '1px solid',
    borderImage: 'linear-gradient(256.06deg, #FFFFFF -4.83%, #030D19 123.41%)',
    background: 'linear-gradient(135deg, rgba(0, 79, 158, 0.2) 0%, rgba(0, 102, 204, 0.2) 100%)',
    color: '#FFFFFF',
    '&:hover': {
      background: 'linear-gradient(135deg, rgba(0, 79, 158, 0.4) 0%, rgba(0, 102, 204, 0.4) 100%)',
      transform: 'translateY(-2px)',
    },
  },
  backButton: {
    marginTop: '24px',
    marginRight: '12px',
    padding: '12px 32px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#FFFFFF',
  },
  packageCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    cursor: 'pointer',
    position: 'relative' as const,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(0, 79, 158, 0.6)',
      transform: 'translateY(-4px)',
    },
  },
};