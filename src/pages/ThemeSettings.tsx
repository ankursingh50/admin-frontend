import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Button,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { ChromePicker, ColorResult } from 'react-color';

// This interface uses camelCase for frontend state management
interface ThemeState {
  primaryFont: string;
  secondaryFont: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  primaryFontSize: string;
  secondaryFontSize: string;
}

const fontOptions = ['Futura', 'Helvetica', 'Georgia', 'Arial', 'Verdana'];
const primaryFontSizes = ['48px', '32px', '28px', '24px', '16px'];
const secondaryFontSizes = ['18px', '16px', '14px', '12px', '10px'];

const API_URL = process.env.REACT_APP_API_BASE_URL;

// Reusable component for each form group (Label + Control)
const SettingsRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, minHeight: '56px' }}>
    <Typography variant="subtitle1" fontWeight={500} sx={{ width: '150px', flexShrink: 0, pr: 2 }}>
      {label}
    </Typography>
    <Box sx={{ width: '100%', maxWidth: '250px' }}>
      {children}
    </Box>
  </Box>
);

// Color picker component
const ColorPickerInput: React.FC<{ color: string; onChange: (color: string) => void }> = ({ color, onChange }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    return (
        <div>
            <Box onClick={() => setDisplayColorPicker(!displayColorPicker)} sx={{ width: '36px', height: '36px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: color, cursor: 'pointer' }} />
            {displayColorPicker ? (
                <Box sx={{ position: 'absolute', zIndex: '2' }}>
                    <Box sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }} onClick={() => setDisplayColorPicker(false)} />
                    <ChromePicker color={color} onChange={(c: ColorResult) => onChange(c.hex)} />
                </Box>
            ) : null}
        </div>
    );
};

// Reusable component for the preview's section headers
const PreviewSectionHeader: React.FC<{ title: string; theme: ThemeState }> = ({ title, theme }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 1 }}>
        <Typography sx={{ fontFamily: theme.secondaryFont, fontWeight: 'bold', fontSize: theme.secondaryFontSize }}>
            {title}
        </Typography>
        <Typography sx={{ fontFamily: theme.secondaryFont, fontSize: '12px', color: theme.primaryColor, cursor: 'pointer' }}>
            View All
        </Typography>
    </Box>
);

const ThemeSettings: React.FC = () => {
  const [theme, setTheme] = useState<ThemeState | null>(null);
  const [previewTheme, setPreviewTheme] = useState<ThemeState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialTheme = async () => {
      try {
        if (!API_URL) throw new Error("API URL is not configured.");
        
        const response = await axios.get(`${API_URL}/theme-settings`);
        
        if (response.data) {
          // ✅ FIX: Map snake_case from API to camelCase for frontend state
          const fetchedTheme: ThemeState = {
            primaryFont: response.data.primary_font,
            secondaryFont: response.data.secondary_font,
            primaryColor: response.data.primary_color,
            secondaryColor: response.data.secondary_color,
            backgroundColor: response.data.background_color,
            primaryFontSize: response.data.primary_font_size,
            secondaryFontSize: response.data.secondary_font_size,
          };
          setTheme(fetchedTheme);
          setPreviewTheme(fetchedTheme);
        }
      } catch (err) {
        console.error("Failed to fetch theme settings:", err);
        setError("Could not load theme settings from the server.");
      }
    };

    fetchInitialTheme();
  }, []);

  const handleChange = (field: keyof ThemeState, value: string) => {
    if (theme) setTheme(prev => ({ ...prev!, [field]: value }));
  };
  const handleSelectChange = (field: keyof ThemeState) => (event: SelectChangeEvent) => {
    handleChange(field, event.target.value);
  };
  const handlePreview = () => { if (theme) setPreviewTheme(theme) };
  const handleReset = () => { /* Logic to reset to defaults if needed */ };

  const handleSubmit = async () => {
    if (!theme) return;
    try {
      if (!API_URL) throw new Error("API URL is not configured.");
      
      // ✅ FIX: Map camelCase from frontend state to snake_case for the API
      const themeToSubmit = {
          primary_font: theme.primaryFont,
          secondary_font: theme.secondaryFont,
          primary_color: theme.primaryColor,
          secondary_color: theme.secondaryColor,
          background_color: theme.backgroundColor,
          primary_font_size: theme.primaryFontSize,
          secondary_font_size: theme.secondaryFontSize,
      };

      await axios.patch(`${API_URL}/theme-settings`, themeToSubmit);
      alert('Theme updated successfully!');
    } catch (err) {
      alert('Failed to update theme.');
      console.error(err);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!theme || !previewTheme) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1.5, minWidth: 0 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>Theme Settings</Typography>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)' }}>
            <Box sx={{ flexGrow: 1 }}>
              <SettingsRow label="Primary Font"><FormControl fullWidth size="small"><Select value={theme.primaryFont} onChange={handleSelectChange('primaryFont')}>{fontOptions.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}</Select></FormControl></SettingsRow>
              <SettingsRow label="Secondary Font"><FormControl fullWidth size="small"><Select value={theme.secondaryFont} onChange={handleSelectChange('secondaryFont')}>{fontOptions.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}</Select></FormControl></SettingsRow>
              <SettingsRow label="Primary Color"><ColorPickerInput color={theme.primaryColor} onChange={(c) => handleChange('primaryColor', c)} /></SettingsRow>
              <SettingsRow label="Secondary Color"><ColorPickerInput color={theme.secondaryColor} onChange={(c) => handleChange('secondaryColor', c)} /></SettingsRow>
              <SettingsRow label="Background Color"><ColorPickerInput color={theme.backgroundColor} onChange={(c) => handleChange('backgroundColor', c)} /></SettingsRow>
              <SettingsRow label="Primary Font Size"><FormControl fullWidth size="small"><Select value={theme.primaryFontSize} onChange={handleSelectChange('primaryFontSize')}>{primaryFontSizes.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</Select></FormControl></SettingsRow>
              <SettingsRow label="Secondary Font Size"><FormControl fullWidth size="small"><Select value={theme.secondaryFontSize} onChange={handleSelectChange('secondaryFontSize')}>{secondaryFontSizes.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</Select></FormControl></SettingsRow>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button variant="contained" onClick={handleReset} sx={{ bgcolor: '#e0e0e0', color: 'black', '&:hover': { bgcolor: '#bdbdbd' }, textTransform: 'none', px: 3, borderRadius: '8px' }}>Reset to Default</Button>
              <Button variant="contained" onClick={handlePreview} sx={{ bgcolor: '#D2A06E', '&:hover': { bgcolor: '#bb865e' }, textTransform: 'none', px: 3, borderRadius: '8px' }}>Preview</Button>
              <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#245134', '&:hover': { bgcolor: '#1a3a25' }, textTransform: 'none', px: 3, borderRadius: '8px' }}>Submit</Button>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: '500' }}>Live Preview</Typography>
          <Box sx={{ width: '100%', minHeight: 630, borderRadius: '20px', backgroundColor: '#e9e9e9', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={8} sx={{ width: 300, height: 'calc(100% - 20px)', maxHeight: 600, borderRadius: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: previewTheme.backgroundColor, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
              <Box sx={{ p: 2, mt: 2 }}>
                <Typography sx={{ fontFamily: previewTheme.primaryFont, fontSize: previewTheme.primaryFontSize, fontWeight: 'bold', color: '#333' }}>ACCOUNTS</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Box sx={{ flex: 2, p: 2, borderRadius: '16px', bgcolor: previewTheme.primaryColor, color: 'white' }}><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: previewTheme.secondaryFontSize }}>... 4859</Typography><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: '28px', fontWeight: 'bold', mt: 1 }}>25,000</Typography></Box>
                  <Box sx={{ flex: 1, border: `2px dashed ${previewTheme.secondaryColor}`, borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666', p: 1 }}><Box sx={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>+</Box><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: '12px', mt: 1, textAlign: 'center' }}>Add Another Account</Typography></Box>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <PreviewSectionHeader title="Transactions" theme={previewTheme} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, backgroundColor: previewTheme.secondaryColor, borderRadius: '12px' }}><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: previewTheme.secondaryFontSize }}>Netflix Subscription</Typography><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontWeight: 500, fontSize: previewTheme.secondaryFontSize }}>- ₪64</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, backgroundColor: previewTheme.secondaryColor, borderRadius: '12px' }}><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: previewTheme.secondaryFontSize }}>Incoming Transfer</Typography><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontWeight: 500, fontSize: previewTheme.secondaryFontSize }}>+ ₪2,000</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, backgroundColor: previewTheme.secondaryColor, borderRadius: '12px' }}><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: previewTheme.secondaryFontSize }}>Grocery</Typography><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontWeight: 500, fontSize: previewTheme.secondaryFontSize }}>- ₪640</Typography></Box>
                </Box>
              </Box>
              <Box sx={{ mt: 3 }}>
                <PreviewSectionHeader title="Due Payments" theme={previewTheme} />
                <Box sx={{ display: 'flex', gap: 2, px: 2 }}>
                  <Box sx={{ flex: 1, p: 2, borderRadius: '16px', bgcolor: previewTheme.primaryColor, color: 'white' }}><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: '12px' }}>Finance</Typography><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: '20px', fontWeight: 'bold', my: 2 }}>House Loan</Typography><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: '12px' }}>Pay Now →</Typography></Box>
                  <Box sx={{ flex: 1, p: 2, borderRadius: '16px', bgcolor: previewTheme.secondaryColor }}><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: '12px' }}>Bill</Typography><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: '20px', fontWeight: 'bold', my: 2 }}>Electricity</Typography><Typography sx={{ fontFamily: previewTheme.secondaryFont, fontSize: '12px' }}>View Bill →</Typography></Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ThemeSettings;