import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export interface Theme {
  dark: boolean;
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  primaryLight: string;
  surface: string;
  inputBg: string;
  divider: string;
  success: string;
  warning: string;
  shadow: string;
}

// Warm Cafe Palette
export const lightTheme: Theme = {
  dark: false,
  background: '#FDFBF7', // Cream background
  card: '#FFFFFF',
  text: '#2D1B14',      // Deep Espresso
  subtext: '#6B5B53',   // Muted Coffee
  border: '#E8E1DC',
  primary: '#6F4E37',   // Coffee Bean Brown
  primaryLight: 'rgba(111, 78, 55, 0.1)',
  surface: '#F4EFEA',
  inputBg: '#F4EFEA',
  divider: '#E8E1DC',
  success: '#2E8B57',   // Sage Green
  warning: '#D2691E',   // Cinnamon Orange
  shadow: '#2D1B14',
};

export const darkTheme: Theme = {
  dark: true,
  background: '#120D0A', // Dark Roast
  card: '#1F1815',
  text: '#F5EBE0',
  subtext: '#A59D96',
  border: '#3D3530',
  primary: '#A67B5B',   // Latte color
  primaryLight: 'rgba(166, 123, 91, 0.2)',
  surface: '#2D241E',
  inputBg: '#3D3530',
  divider: '#3D3530',
  success: '#3CB371',
  warning: '#E2725B',
  shadow: '#000000',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const setThemeMode = (mode: 'light' | 'dark') => setIsDark(mode === 'dark');

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};