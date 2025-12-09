import React from 'react';
import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'Customer Dashboard', path: '/dashboard' },
  { label: 'Account Dashboard', path: '/accounts' },
  { label: 'Iqama Database', path: '/iqama' },
  { label: 'Absher Database', path: '/absher' },
  { label: 'Logout', path: '/logout' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: '#f26b23',
        color: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        pt: 4,
      }}
    >
      <Typography variant="h6" align="center" fontWeight="bold" mb={2}>
        XBank Admin
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => {
              if (item.label === 'Logout') {
                localStorage.clear();
                navigate('/');
              } else {
                navigate(item.path);
              }
            }}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
