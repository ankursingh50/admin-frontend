import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

// IMPORTANT: Save the logo image from your design as 'ocb_logo.png'
// and place it in your `public/images` folder.
const OcbLogo = '/images/ocb_logo.png'; 

const Footer: React.FC = () => {
  return (
    <Paper
      component="footer"
      square
      elevation={2}
      sx={{
        p: 2,
        backgroundColor: '#fff',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '100%',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © Intellect Design Arena Ltd, 2025
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Powered by
          </Typography>
          <img src={OcbLogo} alt="OCB Intellect Logo" style={{ height: '30px' }} />
        </Box>
      </Box>
    </Paper>
  );
};

export default Footer;