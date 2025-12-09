import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export interface Theme {
  primaryFont: string;
  secondaryFont: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  primaryFontSize: string;
  secondaryFontSize: string;
}

const defaultTheme: Theme = {
  primaryFont: 'Coolvetica',
  secondaryFont: 'Urbanist',
  primaryColor: '#F26B23',     // Hopeful Orange
  secondaryColor: '#FFFFFF',   // White
  backgroundColor: '#F9F9F9',  // Light Grey
  primaryFontSize: '48px',
  secondaryFontSize: '14px',
};

export const ThemeContext = createContext<{ theme: Theme }>({
  theme: defaultTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await axios.get(`${API_URL}/theme-settings`);
        const {
          primary_color,
          secondary_color,
          background_color,
          primary_font,
          secondary_font,
          primary_font_size,
          secondary_font_size,
        } = res.data;

        setTheme({
          primaryFont: primary_font,
          secondaryFont: secondary_font,
          primaryColor: primary_color,
          secondaryColor: secondary_color,
          backgroundColor: background_color,
          primaryFontSize: primary_font_size,
          secondaryFontSize: secondary_font_size,
        });
      } catch (err) {
        console.error('Failed to fetch theme settings:', err);
      }
    };

    fetchTheme();
  }, []);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};
