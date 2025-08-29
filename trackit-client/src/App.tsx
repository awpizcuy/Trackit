import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Import MUI components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// --- Perubahan #1: Ganti Ikon Logo ---
import AppsOutageIcon from '@mui/icons-material/AppsOutage'; // Contoh ikon baru
// Jika Anda punya gambar logo, Anda bisa import seperti ini:
// import CustomLogo from './assets/your-logo.png';

import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

// Define the theme
const theme = createTheme({
  palette: {
    background: {
      default: '#f4f5f7'
    }
  }
});

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Determine if the current page is an authentication page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />

      <Box sx={{ display: 'flex' }}>
        {/* Only render the AppBar if it's NOT an auth page and a user is logged in */}
        {!isAuthPage && user && (
          <AppBar position="fixed">
            <Toolbar>
              {/* --- Perubahan #1: Ikon Logo Baru --- */}
              <AppsOutageIcon sx={{ mr: 1 }} /> {/* Menggunakan ikon baru */}
              {/* Atau jika Anda menggunakan gambar logo: */}
              {/* <Box component="img" src={CustomLogo} alt="TrackIt Logo" sx={{ height: 24, mr: 1 }} /> */}
              
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link component={RouterLink} to="/" underline="none" color="inherit" sx={{ fontWeight: 'bold' }}>
                  TrackIt
                </Link>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle1">
                  {/* --- Perubahan #2: Tampilkan Hanya Username --- */}
                  Welcome, {user.name} 
                </Typography>
                <Button color="inherit" variant="outlined" onClick={logout}>
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
        )}
        
        {/* Main Content Area */}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: '100%' }}
        >
          {/* Add a spacer only if the AppBar is visible */}
          {!isAuthPage && user && <Toolbar />}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/project/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;