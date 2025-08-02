import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  Avatar,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const primaryGreen = '#245134';
  const goldenColor = '#D2A06E';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('auth', 'true');
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/login-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />

      {/* Login Box */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          px: { xs: 2, sm: 4, md: 10 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            minHeight: '520px', // ✅ increased height (~15% more)
            backgroundColor: primaryGreen,
            borderRadius: '16px',
            p: { xs: 3, sm: 4 },
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: goldenColor, width: 56, height: 56, mb: 1 }}>
              <LockOutlined sx={{ color: '#fff' }} />
            </Avatar>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              Login
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Username"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                mt: 2,
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                '& .MuiInputLabel-root.Mui-focused': { color: goldenColor },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&:hover fieldset': { borderColor: goldenColor },
                  '&.Mui-focused fieldset': { borderColor: goldenColor },
                  color: '#fff',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'white' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mt: 2,
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                '& .MuiInputLabel-root.Mui-focused': { color: goldenColor },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&:hover fieldset': { borderColor: goldenColor },
                  '&.Mui-focused fieldset': { borderColor: goldenColor },
                  color: '#fff',
                },
              }}
            />

            <Link
              href="#"
              variant="body2"
              sx={{
                display: 'block',
                mt: 1,
                mb: 2,
                color: goldenColor,
                textAlign: 'right',
              }}
            >
              Forgot Password?
            </Link>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                py: 1.5,
                bgcolor: goldenColor,
                '&:hover': {
                  bgcolor: '#bb865e',
                },
                textTransform: 'none',
                fontSize: '1rem',
                borderRadius: '8px',
              }}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
