import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Badge,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StorageIcon from '@mui/icons-material/Storage';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette'; // ✅ 1. Import the new icon
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 200;
const sidebarColor = '#245134'; // ✅ Dark green
const goldHighlight = '#D2A06E'; // ✅ Golden highlight

const sidebarItems = [
  { label: 'Customer Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Account Dashboard', icon: <AccountBalanceIcon />, path: '/account-dashboard' },
  { label: 'Iqama Database', icon: <StorageIcon />, path: '/iqama-db' },
  { label: 'Theme Settings', icon: <PaletteIcon />, path: '/theme-settings' },
];


const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const isActive = (path: string) => location.pathname === path;

  const DrawerContent = (
    <Box
      sx={{
        fontFamily: 'Futura',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        py: 3,
        justifyContent: 'flex-start',
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        DEP Admin
      </Typography>
      <List>
        {sidebarItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              mb: 1,
              borderRadius: '8px',
              backgroundColor: isActive(item.path) ? goldHighlight : 'transparent',
              '&:hover': { backgroundColor: goldHighlight },
              paddingY: '10px',
              px: 2,
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'black' : 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '14px',
                fontFamily: 'Futura',
                color: isActive(item.path) ? 'black' : 'white',
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', fontFamily: 'Futura', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Futura' }}>
            eMACH<span style={{ fontWeight: 400 }}>.ai DEP</span>
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <Badge color="error" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Avatar sx={{ width: 40, height: 40, mr: 1.5 }}>A</Avatar>
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', lineHeight: 1.2 }}>
                Abdullah Ali
              </Typography>
            </Box>


            {/* Logout Button */}
            <ListItemButton
              onClick={() => {
                localStorage.removeItem('auth');
                navigate('/login');
              }}
              sx={{
                borderRadius: '8px',
                backgroundColor: goldHighlight,
                color: 'white',
                px: 2,
                py: 1,
                minHeight: 'auto',
                width: 'auto',
                '&:hover': {
                  backgroundColor: '#bb865e',
                },
              }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography fontSize="0.875rem" fontFamily="Futura">Log out</Typography>
            </ListItemButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              backgroundColor: sidebarColor,
              color: 'white',
              boxShadow: '4px 0 8px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          {DrawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              backgroundColor: sidebarColor,
              color: 'white',
              boxShadow: '4px 0 8px rgba(0, 0, 0, 0.2)',
            },
          }}
          open
        >
          {DrawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          mt: 8,
          backgroundColor: '#f3f4f6',
        }}
      >
        <Box sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
