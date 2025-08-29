import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../services/apiClient';

// Impor komponen dan ikon dari MUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CssBaseline from '@mui/material/CssBaseline';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

// --- Impor logo kustom Anda  ---
import TrackItLogo from '../assets/trackit-logo.png'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ token: string }>('/api/auth/login', { username, password });
      login(response.data.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      <CssBaseline />

      {/* --- JUDUL "TrackIt" DITAMBAHKAN DI SINI DENGAN LOGO KUSTOM --- */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <Box 
          component="img" 
          src={TrackItLogo} 
          alt="TrackIt Logo" 
          sx={{ height: 40, width: 40, objectFit: 'contain' }} // Sesuaikan ukuran jika perlu
        />
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          TrackIt
        </Typography>
      </Box>
      {/* ------------------------------------------- */}

      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: '450px' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Welcome Back!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in to continue
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" variant="body2">
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;