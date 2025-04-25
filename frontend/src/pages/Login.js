import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Paper, 
  InputAdornment,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

const Login = ({ login }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setLoginError('');
    
    // Validate email and password
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email address';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (Object.keys(newErrors).length > 0) {
      setEmailError(newErrors.email || '');
      setPasswordError(newErrors.password || '');
      return;
    }
    
    setIsLoading(true);
    setServerError('');
    
    try {
      console.log('Attempting login with:', { email });
      
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (response.ok) {
        console.log('Login successful, response data:', data);
        
        // Handle different backend response formats
        // Format 1: { token, user }
        // Format 2: { result } where result contains user data with token
        const token = data.token || (data.result && data.result.token);
        const userData = data.user || data.result;
        
        if (token) {
          // Save token to localStorage
          localStorage.setItem('token', token);
          console.log('Token saved to localStorage:', token.substring(0, 10) + '...');
        } else {
          console.error('No token in response:', data);
          setLoginError('Authentication token not received. Please try again.');
          setIsLoading(false);
          return;
        }
        
        if (userData) {
          // Ensure user data has the token
          const userWithToken = {
            ...userData,
            token: token
          };
          
          // Call the App's login function to update global state
          try {
            login(userWithToken);
            console.log('Login state updated successfully with user:', userWithToken.email);
            
            // Show success message and prepare for redirect
            setOpenSnackbar(true);
          } catch (loginError) {
            console.error('Error in login function:', loginError);
            setLoginError('Error saving user session. Please try again.');
            setIsLoading(false);
            return;
          }
        } else {
          console.error('No user data in response:', data);
          setLoginError('User data not received. Please try again.');
          setIsLoading(false);
          return;
        }
        
        // Check for redirect query param
        const params = new URLSearchParams(location.search);
        const redirectPath = params.get('redirect');
        
        // Add a slight delay to ensure token is properly saved
        setTimeout(() => {
          console.log('Redirecting after login to:', redirectPath || '/');
          navigate(redirectPath ? `/${redirectPath}` : '/');
        }, 1000);
      } else {
        setServerError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Please login to your account
          </Typography>
        </Box>
        
        {(loginError || serverError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loginError || serverError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
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
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" variant="body2">
                Register
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login; 