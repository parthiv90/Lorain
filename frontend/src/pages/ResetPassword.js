import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Paper, 
  Alert, 
  Snackbar,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    // Extract email and token from URL query parameters
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const tokenParam = params.get('token');
    
    if (!emailParam || !tokenParam) {
      setValidToken(false);
      setServerError('Invalid or missing reset information. Please request a new password reset link.');
    } else {
      setEmail(emailParam);
      setToken(tokenParam);
    }
  }, [location]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validToken) {
      return;
    }
    
    // Clear previous errors
    setPasswordError('');
    setConfirmPasswordError('');
    setServerError('');
    setSuccessMessage('');
    
    // Validate passwords
    let hasError = false;

    if (!newPassword) {
      setPasswordError('New password is required');
      hasError = true;
    } else if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting password reset for:', email);
      
      const response = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          resetSession: token,
          newPassword,
          confirmPassword
        }),
      });
      
      const data = await response.json();
      console.log('Reset password response:', data);
      
      if (response.ok) {
        setSuccessMessage('Your password has been reset successfully!');
        setOpenSnackbar(true);
        
        // Clear the form
        setNewPassword('');
        setConfirmPassword('');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setServerError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setServerError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: 420 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" style={{ height: 32, marginBottom: 8 }} />
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
            Create new password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We'll ask for this password whenever you sign in.
          </Typography>
        </Box>
        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        {validToken ? (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              type={showPassword ? 'text' : 'password'}
              id="new-password"
              label="New password"
              name="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirm-password"
              label="Password again"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
              sx={{ mt: 3, mb: 2, py: 1.5, textTransform: 'none', fontWeight: 'bold', backgroundColor: '#FFD814', color: '#222', '&:hover': { backgroundColor: '#F7CA00' } }}
            >
              {isLoading ? 'Saving...' : 'Save changes and sign in'}
            </Button>
            <Box sx={{ mt: 3, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Secure password tips:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#555', fontSize: 14 }}>
                <li>Use at least 8 characters, a combination of numbers and letters is best.</li>
                <li>Do not use the same password you have used with us previously.</li>
              </ul>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              component={RouterLink}
              to="/forgot-password"
              variant="contained"
              sx={{ mt: 2, mb: 2, py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
            >
              Request New Reset Link
            </Button>
          </Box>
        )}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            <Link component={RouterLink} to="/login" variant="body2">
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResetPassword;
