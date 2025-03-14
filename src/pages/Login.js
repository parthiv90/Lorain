import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Link, 
  Paper, 
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = ({ login }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setLoginError('');
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    // For demo purposes, let's use a simple check
    // In a real app, you would call an API to authenticate
    if (email === 'user@example.com' && password === 'password123') {
      // Successful login
      login({ email, name: 'Demo User' });
      setOpenSnackbar(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setLoginError('Invalid email or password');
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
        
        {loginError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loginError}
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
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
          >
            Login
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
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              sx={{ py: 1, textTransform: 'none' }}
            >
              Login with Google
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              sx={{ py: 1, textTransform: 'none' }}
            >
              Login with Facebook
            </Button>
          </Grid>
        </Grid>
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