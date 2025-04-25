import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Divider, 
  Box, 
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';

// List of Indian states
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
  const [codVerificationOpen, setCodVerificationOpen] = useState(false);
  const [codVerified, setCodVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({});
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Format price to USD (dollars)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(price);
  };
  
  // Fetch cart data when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        
        const data = await response.json();
        setCart(data.cart || []);
        
        // If cart is empty, redirect to cart page
        if (!data.cart || data.cart.length === 0) {
          navigate('/cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to load cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // Handle shipping form changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!shippingAddress.fullName.trim()) errors.fullName = 'Full name is required';
    if (!shippingAddress.phone.trim()) errors.phone = 'Phone number is required';
    if (!/^[0-9]{10}$/.test(shippingAddress.phone.trim())) errors.phone = 'Please enter a valid 10-digit phone number';
    if (!shippingAddress.addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';
    if (!shippingAddress.state) errors.state = 'State is required';
    if (!shippingAddress.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!/^[0-9]{6}$/.test(shippingAddress.postalCode.trim())) errors.postalCode = 'Please enter a valid 6-digit postal code';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle order submission
  const handlePlaceOrder = async () => {
    // Validate form first
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    // For COD, open verification dialog
    if (paymentMethod === 'cashOnDelivery' && !codVerified) {
      console.log('COD verification required, opening dialog');
      setCodVerificationOpen(true);
      return;
    }
    
    console.log('Proceeding to place order, COD verified:', codVerified);
    
    if (!termsAccepted) {
      setError('Please accept the terms and conditions to place your order.');
      return;
    }
    
    setProcessingOrder(true);
    
    try {
      // Get dynamic API URL with port fallbacks
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001'
        : 'https://your-production-api-url.com';

      // Try alternate port if needed 
      const attemptOrder = async (baseUrl) => {
        console.log('Attempting to place order with API URL:', baseUrl);
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseUrl}/user/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            products: cart,
            totalAmount: total,
            shippingAddress,
            paymentMethod: paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery (Verified)' : 'Credit Card',
            codVerified: paymentMethod === 'cashOnDelivery' ? true : undefined
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create order');
        }
        
        return await response.json();
      };
      
      // Try primary port
      let data;
      try {
        data = await attemptOrder(apiUrl);
      } catch (error) {
        console.log('Primary API attempt failed, trying fallback port');
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          data = await attemptOrder('http://localhost:30011');
        } else {
          throw error;
        }
      }
      
      console.log('Order created:', data);
      
      // Show success message
      setOrderSuccess(true);
      
      // Clear cart in state
      setCart([]);
      
      // Reset verification state
      setCodVerified(false);
      
      // Redirect to profile with order history after a delay
      setTimeout(() => {
        navigate('/profile', { 
          state: { 
            orderSuccess: true, 
            orderId: data.order.orderId,
            activeTab: 1 // Open the Orders tab directly
          } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };
  
  // Handle COD verification completion
  const handleCodVerification = () => {
    console.log('COD verification completed');
    setCodVerified(true);
    setCodVerificationOpen(false);
    setSnackbarMessage('Cash on Delivery verified successfully!');
    setOpenSnackbar(true);
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    // Reset verification if changing from COD
    if (e.target.value !== 'cashOnDelivery') {
      setCodVerified(false);
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          sx={{ mt: 2 }} 
          variant="contained" 
          onClick={() => navigate('/cart')}
        >
          Return to Cart
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontFamily: "'Playfair Display', serif",
        fontWeight: 500,
        letterSpacing: '0.05em',
        textAlign: 'center',
        mb: 4
      }}>
        Checkout
      </Typography>
      
      {/* Stepper indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, px: { xs: 1, md: 10 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ShoppingCartIcon color="primary" sx={{ mb: 1, fontSize: 28 }} />
          <Typography variant="body2">Cart</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LocalShippingIcon color="primary" sx={{ mb: 1, fontSize: 28 }} />
          <Typography variant="body2">Shipping</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <PaymentIcon sx={{ mb: 1, fontSize: 28, color: 'rgba(0, 0, 0, 0.54)' }} />
          <Typography variant="body2">Payment</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ mb: 1, fontSize: 28, color: 'rgba(0, 0, 0, 0.54)' }} />
          <Typography variant="body2">Confirmation</Typography>
        </Box>
      </Box>
      
      <Grid container spacing={4}>
        {/* Left column: Order details */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>
              Shipping Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleShippingChange}
                  error={!!formErrors.fullName}
                  helperText={formErrors.fullName}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleShippingChange}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleShippingChange}
                  error={!!formErrors.addressLine1}
                  helperText={formErrors.addressLine1}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  value={shippingAddress.addressLine2}
                  onChange={handleShippingChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  error={!!formErrors.city}
                  helperText={formErrors.city}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.state} required>
                  <InputLabel id="state-label">State</InputLabel>
                  <Select
                    labelId="state-label"
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleShippingChange}
                    label="State"
                  >
                    {indianStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.state && <FormHelperText>{formErrors.state}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                  error={!!formErrors.postalCode}
                  helperText={formErrors.postalCode}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  variant="outlined"
                  disabled
                />
              </Grid>
            </Grid>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>
              Payment Method
            </Typography>
            
            <RadioGroup
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <Box sx={{ 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1,
                mb: 2,
                backgroundColor: paymentMethod === 'cashOnDelivery' ? '#f9f9f9' : 'transparent'
              }}>
                <FormControlLabel 
                  value="cashOnDelivery" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MoneyIcon sx={{ mr: 1 }} />
                      <Typography variant="body1">Cash on Delivery</Typography>
                      {codVerified && (
                        <Chip 
                          label="Verified" 
                          size="small" 
                          color="success" 
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </Box>
                  } 
                />
                {paymentMethod === 'cashOnDelivery' && (
                  <Box sx={{ pl: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Pay when your order is delivered. Our delivery partner will accept cash.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {codVerified ? (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          disabled
                        >
                          Verified
                        </Button>
                      ) : (
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary"
                          onClick={() => setCodVerificationOpen(true)}
                        >
                          Verify Now
                        </Button>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1,
                backgroundColor: paymentMethod === 'creditCard' ? '#f9f9f9' : 'transparent'
              }}>
                <FormControlLabel 
                  value="creditCard" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCardIcon sx={{ mr: 1 }} />
                      <Typography variant="body1">Credit/Debit Card</Typography>
                      <Chip 
                        label="Coming Soon" 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 1, height: 20 }}
                      />
                    </Box>
                  } 
                  disabled
                />
                {paymentMethod === 'creditCard' && (
                  <Box sx={{ pl: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Securely pay with your credit or debit card.
                    </Typography>
                  </Box>
                )}
              </Box>
            </RadioGroup>
          </Paper>
        </Grid>
        
        {/* Right column: Order summary */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>
              Order Summary
            </Typography>
            
            <List sx={{ width: '100%', mb: 2 }}>
              {cart.map((item) => (
                <ListItem key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={item.name} src={item.image} variant="square" sx={{ width: 60, height: 60, mr: 2 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {formatPrice(item.price)} × {item.quantity}
                        </Typography>
                        {item.selectedSize && (
                          <Typography component="span" variant="body2" display="block">
                            Size: {item.selectedSize}
                          </Typography>
                        )}
                        {item.selectedColor && (
                          <Typography component="span" variant="body2" display="block">
                            Color: {item.selectedColor}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <Typography variant="body1" sx={{ minWidth: 80, textAlign: 'right' }}>
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">{formatPrice(subtotal)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">{shipping === 0 ? 'Free' : formatPrice(shipping)}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">{formatPrice(total)}</Typography>
            </Box>
            
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Checkbox 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)}
                color="primary"
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                I agree to the <b>Terms of Service</b> and <b>Privacy Policy</b>.
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
              onClick={handlePlaceOrder}
              disabled={processingOrder || cart.length === 0 || !termsAccepted || (paymentMethod === 'cashOnDelivery' && !codVerified)}
              sx={{ 
                py: 1.5,
                bgcolor: '#000',
                '&:hover': {
                  bgcolor: '#333',
                },
                '&.Mui-disabled': {
                  bgcolor: '#ccc',
                }
              }}
            >
              {processingOrder ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : 'Place Order'}
            </Button>
            
            {paymentMethod === 'cashOnDelivery' && !codVerified && (
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'error.main' }}>
                Please verify your Cash on Delivery payment method
              </Typography>
            )}
            
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
              Your order will be shipped within 3-5 business days.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Success snackbar */}
      <Snackbar
        open={orderSuccess}
        autoHideDuration={6000}
        onClose={() => setOrderSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Your order has been placed successfully! An email confirmation has been sent.
        </Alert>
      </Snackbar>
      
      {/* Error snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* General message snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* COD Verification Dialog */}
      <Dialog 
        open={codVerificationOpen} 
        onClose={() => setCodVerificationOpen(false)} 
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon sx={{ mr: 1 }} />
            Verify Cash on Delivery
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            To place your order with Cash on Delivery, please verify these details
          </Alert>
          
          <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1, mb: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Delivery Verification Requirements:
            </Typography>
            <Typography variant="body2" paragraph>
              • Someone must be available to receive the package and make payment.
            </Typography>
            <Typography variant="body2" paragraph>              
              • Have the exact amount ready - our delivery partners may not carry change.
            </Typography>
            <Typography variant="body2" paragraph>
              • We'll attempt delivery 3 times. After that, the order may be cancelled.
            </Typography>
          </Box>
          
          <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Order & Payment Details:
            </Typography>
            <Typography variant="body2" paragraph>
              <b>Order Total:</b> {formatPrice(total)}
            </Typography>
            <Typography variant="body2" paragraph>
              <b>Payment Methods:</b> Cash only
            </Typography>
            <Typography variant="body2" paragraph>
              <b>Delivery Address:</b> {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
            </Typography>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: '#fff', border: '1px dashed #ccc', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    required 
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                }
                label="I confirm that I will be available to receive and pay for my order"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: 2 }}>
          <Button onClick={() => setCodVerificationOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCodVerification}
            disabled={!termsAccepted}
            color="primary"
            startIcon={<CheckCircleIcon />}
          >
            Confirm & Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Checkout;
