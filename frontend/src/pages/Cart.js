import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton, 
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, ArrowBack, ShoppingBag, CheckCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({ cart = [], updateCartItemQuantity, removeFromCart, user }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [cartWarning, setCartWarning] = useState('');
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(null);
  
  // Function to convert rupees to dollars (approximation)
  const convertToUSD = (rupeesAmount) => {
    // Using an approximate exchange rate of 1 USD = 75 INR
    const exchangeRate = 75;
    return rupeesAmount / exchangeRate;
  };
  
  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // USD equivalents
  const subtotalUSD = convertToUSD(subtotal);
  
  // Calculate shipping (free if subtotal > $47)
  // 3500 rupees ≈ $47, 250 rupees ≈ $3.33
  const shipping = subtotalUSD > 47 ? 0 : 250;
  
  // Calculate total
  const total = subtotal + shipping;
  
  const shippingUSD = convertToUSD(shipping);
  const totalUSD = convertToUSD(total);

  // Check if the cart items match any previous order
  const checkPreviousOrders = () => {
    if (!user || !user.orderHistory || user.orderHistory.length === 0 || cart.length === 0) {
      return false;
    }

    // Go through previous orders, most recent first
    for (const order of user.orderHistory) {
      if (order.products && order.products.length === cart.length) {
        // Check if all cart items match items in this order
        const allMatch = cart.every(cartItem => {
          return order.products.some(orderProduct => 
            orderProduct.id === cartItem.id && 
            orderProduct.quantity === cartItem.quantity &&
            orderProduct.selectedSize === cartItem.selectedSize &&
            orderProduct.selectedColor === cartItem.selectedColor
          );
        });

        if (allMatch) {
          // Format date for display
          const orderDate = new Date(order.orderDate);
          const formattedDate = orderDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
          
          // Return warning message about duplicate order
          setCartWarning(`You already placed this exact order on ${formattedDate} (Order #${order.orderId}). Do you want to place it again?`);
          return true;
        }
      }
    }
    return false;
  };

  // Check for duplicate orders when cart or user changes
  useEffect(() => {
    if (user && cart.length > 0) {
      checkPreviousOrders();
    } else {
      setCartWarning('');
    }
  }, [user, cart]);

  // Load addresses from user profile or API
  useEffect(() => {
    const loadAddresses = async () => {
      if (user && user.token) {
        try {
          // Start with any address in user data
          const addresses = [];
          
          // Add profile address if exists
          if (user.profile?.address) {
            addresses.push({
              id: 'profile',
              fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`,
              phone: user.profile.phone || user.phone || '9876543210',
              addressLine1: user.profile.address.addressLine1 || '',
              addressLine2: user.profile.address.addressLine2 || '',
              city: user.profile.address.city || '',
              state: user.profile.address.state || '',
              postalCode: user.profile.address.postalCode || '',
              country: user.profile.address.country || 'United States',
              default: true
            });
          }
          
          // Add any other addresses from user object
          if (user.addresses && Array.isArray(user.addresses)) {
            user.addresses.forEach(addr => {
              addresses.push({
                ...addr,
                default: false
              });
            });
          }
          
          // If we have no addresses, create a default one
          if (addresses.length === 0) {
            addresses.push({
              id: 'default',
              fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}` || 'Delivery Customer',
              phone: user.phone || '9876543210',
              addressLine1: '123 Main Street',
              addressLine2: 'Apartment 4B',
              city: 'New York',
              state: 'NY',
              postalCode: '10001',
              country: 'United States',
              default: true
            });
          }
          
          setAddressList(addresses);
          // Select default address
          const defaultAddress = addresses.find(addr => addr.default) || addresses[0];
          setSelectedAddress(defaultAddress);
          
        } catch (err) {
          console.error('Error loading addresses:', err);
        }
      }
    };
    
    loadAddresses();
  }, [user]);

  // Start the checkout process by showing address selection
  const startCheckout = () => {
    // Check if user is logged in
    if (!user) {
      console.log('User not logged in, redirecting to login page');
      navigate('/login?redirect=cart');
      return;
    }
    
    // We have a logged in user, proceed with checkout
    console.log('User is logged in, proceeding with checkout:', user.email);
    
    // Make sure we have a valid token
    const token = user.token || localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      navigate('/login?redirect=cart');
      return;
    }
    
    // Open address selection modal
    setAddressModalOpen(true);
  };
  
  // Complete checkout after address is selected
  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }
    
    console.log('Proceeding with checkout using selected address');
    setProcessing(true);
    setError(null);
    setAddressModalOpen(false);

    try {
      // Use the selected address for shipping
      const shippingAddress = {
        ...selectedAddress,
        // Make sure we remove any non-shipping fields
        id: undefined,
        default: undefined
      };
      
      console.log('Sending order with the following data:');
      console.log('Cart items:', cart);
      console.log('Total:', total);
      console.log('Shipping address:', shippingAddress);
      
      const token = user.token || localStorage.getItem('token');
      console.log('Using token for authorization');
      
      // Create order directly
      const response = await fetch('http://localhost:3001/user/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          products: cart,
          totalAmount: total,
          shippingAddress,
          paymentMethod: 'Cash on Delivery'
        })
      });
      
      const responseText = await response.text();
      console.log('Server response text:', responseText);
      
      if (!response.ok) {
        // Handle specific authentication errors
        if (responseText.includes('Invalid token') || responseText.includes('Token expired')) {
          // Clear invalid token and redirect to login
          localStorage.removeItem('token');
          throw new Error('Your session has expired. Please log in again.');
        } else {
          throw new Error(`Failed to create order: ${responseText}`);
        }
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        data = { message: 'Order created but response format was unexpected' };
      }
      console.log('Order created successfully:', data);
      
      // Show success message
      setSuccess(true);
      
      // Don't attempt to clear cart here as it would cause errors
      // The backend will clear the cart and frontend will update on navigation
      
      // Delay redirect to allow user to see success message
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to place order. Please try again. ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4,
          '&::after': {
            content: '""',
            display: 'block',
            width: '50px',
            height: '3px',
            backgroundColor: 'primary.main',
            margin: '8px auto',
          }
        }}
      >
        Your Shopping Cart
      </Typography>

      {cart.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/" 
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                            image={item.image}
                            alt={item.name}
                          />
                          <Typography variant="body2" component={Link} to={`/product/${item.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>${convertToUSD(item.price).toFixed(2)}</TableCell>
                      <TableCell>{item.selectedSize}</TableCell>
                      <TableCell>{item.selectedColor}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => updateCartItemQuantity(item, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => updateCartItemQuantity(item, item.quantity + 1)}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          ${convertToUSD(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="error" 
                          size="small" 
                          onClick={() => removeFromCart(item)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                component={Link} 
                to="/" 
                startIcon={<ArrowBack />}
                sx={{ textTransform: 'none' }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Order Summary
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal ({cart.length} items)</Typography>
                  <Typography variant="body2">${subtotalUSD.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">
                    {shipping === 0 ? 'Free' : `$${shippingUSD.toFixed(2)}`}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${totalUSD.toFixed(2)}</Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large"
                  onClick={startCheckout}
                  disabled={processing || cart.length === 0}
                  endIcon={<ShoppingBag />}
                  sx={{ 
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    bgcolor: '#000',
                    '&:hover': {
                      bgcolor: '#333',
                    }
                  }}
                >
                  Proceed to Checkout
                </Button>
                
                {cartWarning && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#fff9c4', borderRadius: 1 }}>
                    <Typography variant="body2" color="warning.dark">
                      <b>Note:</b> {cartWarning}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    We accept all major credit cards, UPI, and net banking
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    
      {/* Success Snackbar */}
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(false)} 
          severity="success" 
          sx={{ width: '100%', alignItems: 'center' }}
          icon={<CheckCircle fontSize="inherit" />}
        >
          Order placed successfully! A confirmation email has been sent to your registered email address.
        </Alert>
      </Snackbar>
      
      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
      
      {/* Address Selection Modal */}
      <Dialog
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600, fontFamily: '"Playfair Display", serif' }}>
            Select Delivery Address
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {addressList.map((address) => (
              <Grid item xs={12} md={6} key={address.id}>
                <Card 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    border: selectedAddress?.id === address.id ? '2px solid #000' : '1px solid #e0e0e0',
                    boxShadow: selectedAddress?.id === address.id ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
                  }}
                  onClick={() => setSelectedAddress(address)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {address.fullName}
                    </Typography>
                    {address.default && (
                      <Chip size="small" label="Default" color="primary" sx={{ height: 22 }} />
                    )}
                  </Box>
                  
                  <Typography variant="body2" paragraph>
                    {address.addressLine1}
                    {address.addressLine2 && <span>, {address.addressLine2}</span>}<br />
                    {address.city}, {address.state} {address.postalCode}<br />
                    {address.country}<br />
                    Phone: {address.phone}
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={(e) => {
                      e.stopPropagation();
                      setEditingAddress(address);
                    }}>
                      Edit
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
            
            {/* Add New Address Card */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  p: 2, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px dashed #aaa',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setNewAddress({
                    id: `new-${Date.now()}`,
                    fullName: user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`,
                    phone: user?.phone || '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'United States'
                  });
                }}
              >
                <Add sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Add New Address
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAddressModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleCheckout} 
            variant="contained" 
            color="primary"
            disabled={!selectedAddress || processing}
            startIcon={processing && <CircularProgress size={20} color="inherit" />}
          >
            {processing ? 'Processing...' : 'Deliver to this Address'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Address Edit Modal */}
      <Dialog 
        open={!!editingAddress || !!newAddress} 
        onClose={() => { setEditingAddress(null); setNewAddress(null); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                value={editingAddress?.fullName || newAddress?.fullName || ''}
                onChange={(e) => {
                  if (editingAddress) {
                    setEditingAddress({...editingAddress, fullName: e.target.value});
                  } else if (newAddress) {
                    setNewAddress({...newAddress, fullName: e.target.value});
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={editingAddress?.phone || newAddress?.phone || ''}
                onChange={(e) => {
                  if (editingAddress) {
                    setEditingAddress({...editingAddress, phone: e.target.value});
                  } else if (newAddress) {
                    setNewAddress({...newAddress, phone: e.target.value});
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Postal Code"
                fullWidth
                margin="normal"
                value={editingAddress?.postalCode || newAddress?.postalCode || ''}
                onChange={(e) => {
                  if (editingAddress) {
                    setEditingAddress({...editingAddress, postalCode: e.target.value});
                  } else if (newAddress) {
                    setNewAddress({...newAddress, postalCode: e.target.value});
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 1"
                fullWidth
                margin="normal"
                value={editingAddress?.addressLine1 || newAddress?.addressLine1 || ''}
                onChange={(e) => {
                  if (editingAddress) {
                    setEditingAddress({...editingAddress, addressLine1: e.target.value});
                  } else if (newAddress) {
                    setNewAddress({...newAddress, addressLine1: e.target.value});
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 2 (Optional)"
                fullWidth
                margin="normal"
                value={editingAddress?.addressLine2 || newAddress?.addressLine2 || ''}
                onChange={(e) => {
                  if (editingAddress) {
                    setEditingAddress({...editingAddress, addressLine2: e.target.value});
                  } else if (newAddress) {
                    setNewAddress({...newAddress, addressLine2: e.target.value});
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                fullWidth
                margin="normal"
                value={editingAddress?.city || newAddress?.city || ''}
                onChange={(e) => {
                  if (editingAddress) {
                    setEditingAddress({...editingAddress, city: e.target.value});
                  } else if (newAddress) {
                    setNewAddress({...newAddress, city: e.target.value});
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State"
                fullWidth
                margin="normal"
                value={editingAddress?.state || newAddress?.state || ''}
                onChange={(e) => {
                  if (editingAddress) {
                    setEditingAddress({...editingAddress, state: e.target.value});
                  } else if (newAddress) {
                    setNewAddress({...newAddress, state: e.target.value});
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                fullWidth
                margin="normal"
                value={editingAddress?.country || newAddress?.country || 'United States'}
                onChange={(e) => {
                  if (editingAddress) {
                    setEditingAddress({...editingAddress, country: e.target.value});
                  } else if (newAddress) {
                    setNewAddress({...newAddress, country: e.target.value});
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditingAddress(null); setNewAddress(null); }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              if (editingAddress) {
                // Update existing address
                const updatedAddresses = addressList.map(addr => 
                  addr.id === editingAddress.id ? editingAddress : addr
                );
                setAddressList(updatedAddresses);
                setSelectedAddress(editingAddress);
                setEditingAddress(null);
              } else if (newAddress) {
                // Add new address
                const updatedAddress = {
                  ...newAddress,
                  default: addressList.length === 0
                };
                setAddressList([...addressList, updatedAddress]);
                setSelectedAddress(updatedAddress);
                setNewAddress(null);
              }
            }}
          >
            {editingAddress ? 'Update Address' : 'Save Address'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart; 