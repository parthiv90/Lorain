import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert,
  Snackbar,
  Stack,
  TextField,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [email, setEmail] = useState('');
  const [tempData, setTempData] = useState('');
  const inputRefs = useRef([]);

  // Get email and tempData from location state
  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email || '');
      setTempData(location.state.tempData || '');
      
      // Show message that OTP is sent to email
      setSnackbarMessage('OTP has been sent to your email');
      setSnackbarSeverity('info');
      setOpenSnackbar(true);
      
      // Note: We've removed the auto-fill OTP feature as requested by the user
    } else {
      // If no state is passed, redirect to register
      navigate('/register');
    }
  }, [location.state, navigate]);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1); // Only take the first character if multiple are pasted
    }
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pasteData)) return; // Only allow numbers

    const digits = pasteData.slice(0, 6).split('');
    const newOtp = [...otp];
    
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(v => v === '');
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex].focus();
    } else if (digits.length < 6) {
      inputRefs.current[digits.length].focus();
    } else {
      inputRefs.current[5].focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending OTP verification request with:', {
        email,
        otpValue,
        tempDataLength: tempData?.length || 0
      });

      const response = await fetch('http://localhost:3001/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpValue,
          tempData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.details || 'Failed to verify OTP');
      }

      setSnackbarMessage('Registration successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Redirect to login after successful verification
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          tempData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setSnackbarMessage('New OTP sent to your email');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setCountdown(180); // Reset countdown
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
            Email Verification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We've sent a 6-digit verification code to <strong>{email}</strong>.
            Enter the code below to verify your email.
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ my: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center" 
            sx={{ mb: 3 }}
          >
            {otp.map((digit, index) => (
              <TextField
                key={index}
                inputRef={el => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                variant="outlined"
                sx={{
                  width: '48px',
                  height: '48px',
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      padding: '8px 0',
                    }
                  }
                }}
                InputProps={{
                  inputProps: {
                    maxLength: 1,
                    style: { textAlign: 'center' }
                  }
                }}
                autoFocus={index === 0}
              />
            ))}
          </Stack>
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Time remaining: {formatTime(countdown)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              disabled={countdown > 0 || loading}
              onClick={resendOtp}
              sx={{ textTransform: 'none' }}
            >
              Resend Code
            </Button>
            <Button
              variant="contained"
              onClick={verifyOtp}
              disabled={otp.join('').length !== 6 || loading}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OTPVerification; 