import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode colors
                primary: {
                  main: '#7352C7',
                  lighter: 'rgba(115, 82, 199, 0.1)',
                  light: '#9272E7',
                  dark: '#5B3EA8',
                },
                background: {
                  default: '#F4F6F8',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#2D3748',
                  secondary: '#718096',
                },
              }
            : {
                // Dark mode colors
                primary: {
                  main: '#9272E7',
                  lighter: 'rgba(146, 114, 231, 0.1)',
                  light: '#A990EC',
                  dark: '#7352C7',
                },
                background: {
                  default: '#171923',
                  paper: '#1A202C',
                },
                text: {
                  primary: '#FFFFFF',
                  secondary: '#A0AEC0',
                },
              }),
        },
        // ... rest of your theme configuration
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 