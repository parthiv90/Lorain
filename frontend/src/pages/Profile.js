import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  TextField,
  Tab,
  Tabs,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CardMedia,
  CardActions,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  Person, 
  ShoppingBag, 
  Favorite, 
  LocationOn, 
  CreditCard, 
  ExitToApp,
  Edit,
  Save,
  Delete,
  AddShoppingCart,
  Refresh as RefreshIcon,
  Sync as SyncIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, logout, cart, wishlist, removeFromCart, removeFromWishlist }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 0);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'user@example.com',
    phone: '+91 98765 43210',
    address: '123 Fashion Street, Adajan, Surat, Gujarat 395009'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: user?.name || 'Demo User',
      address: '123 Fashion Street, Adajan, Surat, Gujarat 395009',
      phone: '+91 98765 43210',
      isDefault: true
    }
  ]);
  const [newAddress, setNewAddress] = useState({
    type: '',
    address: '',
    phone: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch user orders when component mounts
  useEffect(() => {
    if (user && user.id) {
      fetchUserOrders();
    }
  }, [user]);

  // If no user is logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }
  
  // Fetch user orders
  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      // Get dynamic API URL with port fallbacks
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001'
        : 'https://your-production-api-url.com';
      
      // Try to fetch orders
      const fetchFromUrl = async (baseUrl) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${baseUrl}/user/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        return data.orderHistory || [];
      };
      
      let orders;
      try {
        console.log('Fetching orders from primary API URL...');
        orders = await fetchFromUrl(apiUrl);
      } catch (error) {
        console.log('Primary API attempt failed, trying fallback port');
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          orders = await fetchFromUrl('http://localhost:30011');
        } else {
          throw error;
        }
      }
      
      console.log('Fetched orders:', orders);
      setOrderHistory(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSnackbarMessage('Failed to load order history. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Refresh orders when switching to orders tab
    if (newValue === 1 && user) {
      fetchUserOrders();
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // In a real app, you would call an API to update the user profile
    setEditMode(false);
    setSnackbarMessage('Profile updated successfully!');
    setOpenSnackbar(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChangePassword = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You are not logged in. Please log in and try again.');
      }
      
      // Use the dynamically determined API base URL with port fallbacks
      // This will try multiple ports if one fails
      let apiUrl;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Try port 3001 first (default), but have fallbacks ready
        apiUrl = 'http://localhost:3001';
      } else {
        // Production environment
        apiUrl = 'https://your-production-api-url.com';
      }
      
      console.log('Attempting to change password using API URL:', `${apiUrl}/user/change-password`);
      console.log('Token available:', !!token);
      
      // Try to make API call to primary port
      try {
        console.log('Attempting password change with primary API URL:', apiUrl);
        return await tryPasswordChange(apiUrl, token);
      } catch (error) {
        console.log('Primary API attempt failed:', error.message);
        
        // If primary port fails, try fallback port
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.log('Trying fallback API URL with port 30011...');
          try {
            return await tryPasswordChange('http://localhost:30011', token);
          } catch (fallbackError) {
            console.error('Fallback API attempt also failed:', fallbackError.message);
            throw new Error('Unable to connect to the server. Please try again later.');
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Password change error:', error);
      setSnackbarMessage(error.message || 'Failed to update password. Please try again.');
      setOpenSnackbar(true);
    }
  };
  
  // Helper function to try password change with a specific API URL
  const tryPasswordChange = async (baseUrl, token) => {
    // Make API call to update password
    const response = await fetch(`${baseUrl}/user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      console.log('Password change response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, get the text for debugging
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Server returned an invalid response format. Please try again later.');
      }
      
      const data = await response.json();
      console.log('Password change response data:', data);
      
      // Handle error responses
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }
      
      // Clear form and show success message
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSnackbarMessage('Password updated successfully! Please use your new password next time you log in.');
      setOpenSnackbar(true);
    // Success case is handled by the calling function
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setSnackbarMessage('Password updated successfully! Please use your new password next time you log in.');
    setOpenSnackbar(true);
    return true;
  };

  // Handle product click to navigate to product details
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    if (editingAddressId) {
      // Editing existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddressId ? { ...addr, [name]: value } : addr
      ));
    } else {
      // Adding new address
      setNewAddress({
        ...newAddress,
        [name]: value
      });
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.type || !newAddress.address || !newAddress.phone) {
      setSnackbarMessage('Please fill all the address fields');
      setOpenSnackbar(true);
      return;
    }

    const newAddressObj = {
      id: Date.now(), // use timestamp as unique id
      name: userData.name,
      type: newAddress.type,
      address: newAddress.address,
      phone: newAddress.phone,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, newAddressObj]);
    setNewAddress({ type: '', address: '', phone: '' });
    setShowAddressForm(false);
    setSnackbarMessage('New address added successfully!');
    setOpenSnackbar(true);
  };

  const handleEditAddress = (addressId) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
      setEditingAddressId(addressId);
      setShowAddressForm(true);
    }
  };

  const handleSaveEditedAddress = () => {
    setEditingAddressId(null);
    setShowAddressForm(false);
    setSnackbarMessage('Address updated successfully!');
    setOpenSnackbar(true);
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    setSnackbarMessage('Address deleted successfully!');
    setOpenSnackbar(true);
  };

  const handleSetDefaultAddress = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    setSnackbarMessage('Default address updated');
    setOpenSnackbar(true);
  };

  const handleCancelAddressForm = () => {
    if (editingAddressId) {
      // Revert changes if editing
      setAddresses(addresses.map(addr => 
        addr.id === editingAddressId ? { ...addr } : addr
      ));
      setEditingAddressId(null);
    }
    setShowAddressForm(false);
    setNewAddress({ type: '', address: '', phone: '' });
  };

  const renderProfileTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {editMode ? (
          <Button 
            startIcon={<Save />} 
            variant="contained" 
            onClick={handleSaveProfile}
          >
            Save Changes
          </Button>
        ) : (
          <Button 
            startIcon={<Edit />} 
            variant="outlined" 
            onClick={handleEditToggle}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </Button>
              
              {showPasswordForm && (
                <Box sx={{ mt: 3, border: '1px solid #e0e0e0', borderRadius: 1, p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Current Password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        margin="normal"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="New Password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        margin="normal"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        margin="normal"
                        required
                        error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                        helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      sx={{ mr: 2 }}
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained"
                      disabled={!passwordData.currentPassword || !passwordData.newPassword || 
                                !passwordData.confirmPassword || 
                                passwordData.newPassword !== passwordData.confirmPassword}
                      onClick={handleChangePassword}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Box>
              )}

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderOrdersTab = () => {
    // Display price in dollars directly
    const formatPrice = (amount) => {
      return amount.toFixed(2);
    };

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Your Orders
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {loadingOrders ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : orderHistory && orderHistory.length > 0 ? (
          <Grid container spacing={3}>
            {orderHistory.map((order) => {
              // Format the order date
              const orderDate = new Date(order.orderDate);
              const formattedDate = orderDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              
              // Calculate total items
              const totalItems = order.products.reduce((sum, product) => sum + product.quantity, 0);
              
              return (
                <Grid item xs={12} key={order.orderId}>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Order #{order.orderId}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Placed on {formattedDate}
                          </Typography>
                        </Box>
                        <Chip 
                          label={order.status} 
                          color={order.status === 'Delivered' ? 'success' : order.status === 'Processing' ? 'primary' : 'default'}
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2}>
                        {/* Order Items */}
                        <Grid item xs={12} md={8}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Order Items ({totalItems})
                          </Typography>
                          
                          <Box sx={{ maxHeight: '300px', overflow: 'auto', pr: 1 }}>
                            {order.products.map((product, idx) => (
                              <Card key={`${product.id}-${idx}`} sx={{ mb: 1, boxShadow: 'none', border: '1px solid #eee' }}>
                                <Box sx={{ display: 'flex', p: 2 }}>
                                  <CardMedia
                                    component="img"
                                    sx={{ width: 70, height: 70, objectFit: 'cover' }}
                                    image={product.image}
                                    alt={product.name}
                                  />
                                  <Box sx={{ ml: 2, flex: 1 }}>
                                    <Typography variant="subtitle2">{product.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {product.selectedSize && `Size: ${product.selectedSize}`}
                                      {product.selectedColor && `, Color: ${product.selectedColor}`}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                      <Typography variant="body2">Qty: {product.quantity}</Typography>
                                      <Typography variant="body2" fontWeight="bold">
                                        ${formatPrice(product.price * product.quantity)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Card>
                            ))}
                          </Box>
                        </Grid>
                        
                        {/* Order Summary */}
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Order Summary
                          </Typography>
                          
                          <Card sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Items Total:</Typography>
                              <Typography variant="body2">${formatPrice(order.totalAmount - 250)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Shipping:</Typography>
                              <Typography variant="body2">${formatPrice(250)}</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                              <Typography variant="subtitle2">Total:</Typography>
                              <Typography variant="subtitle2">${formatPrice(order.totalAmount)}</Typography>
                            </Box>
                            
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #ddd' }}>
                              <Typography variant="body2" gutterBottom>
                                <strong>Payment Method:</strong> {order.paymentMethod}
                              </Typography>
                              <Typography variant="body2" gutterBottom>
                                <strong>Shipping Address:</strong>
                              </Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                                {order.shippingAddress?.fullName}<br />
                                {order.shippingAddress?.addressLine1}
                                {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}<br />
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                                {order.shippingAddress?.country}<br />
                                Phone: {order.shippingAddress?.phone}
                              </Typography>
                            </Box>
                          </Card>
                          
                          <Button 
                            fullWidth 
                            variant="outlined" 
                            sx={{ mt: 2 }}
                            startIcon={<ShoppingBag />}
                          >
                            Buy Again
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              When you place an order, it will appear here.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={() => navigate('/')}
              >
                Start Shopping
              </Button>
              <Button 
                variant="outlined" 
                onClick={fetchUserOrders}
                startIcon={<RefreshIcon />}
              >
                Refresh Orders
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const renderWishlistTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Wishlist
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {wishlist && wishlist.length > 0 ? (
        <Grid container spacing={3}>
          {wishlist.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={item.image}
                  alt={item.name}
                  sx={{ cursor: 'pointer', objectFit: 'cover' }}
                  onClick={() => handleProductClick(item.id)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    ${item.price.toFixed(2)}
                  </Typography>
                  {item.selectedSize && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Size: {item.selectedSize}
                    </Typography>
                  )}
                  {item.selectedColor && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Color:
                      </Typography>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: item.selectedColor,
                          border: '1px solid #e0e0e0',
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton 
                    color="error" 
                    onClick={() => removeFromWishlist(item)}
                    aria-label="remove from wishlist"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Favorite sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Save items you like to your wishlist and they will appear here.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
          >
            Explore Products
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderAddressesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Your Addresses
        </Typography>
        {!showAddressForm && (
          <Button 
            variant="contained" 
            startIcon={<LocationOn />}
            onClick={() => setShowAddressForm(true)}
          >
            Add New Address
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      {showAddressForm && (
        <Card sx={{ mb: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address Type (e.g. Home, Office)"
                  name="type"
                  value={editingAddressId 
                    ? addresses.find(addr => addr.id === editingAddressId).type 
                    : newAddress.type}
                  onChange={handleAddressFormChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={editingAddressId 
                    ? addresses.find(addr => addr.id === editingAddressId).phone 
                    : newAddress.phone}
                  onChange={handleAddressFormChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Address"
                  name="address"
                  value={editingAddressId 
                    ? addresses.find(addr => addr.id === editingAddressId).address 
                    : newAddress.address}
                  onChange={handleAddressFormChange}
                  required
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                sx={{ mr: 2 }}
                onClick={handleCancelAddressForm}
              >
                Cancel
              </Button>
              {editingAddressId ? (
                <Button 
                  variant="contained"
                  onClick={handleSaveEditedAddress}
                >
                  Save Changes
                </Button>
              ) : (
                <Button 
                  variant="contained"
                  onClick={handleAddAddress}
                >
                  Add Address
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
      
      {addresses.length > 0 ? (
        <Grid container spacing={2}>
          {addresses.map((address) => (
            <Grid item xs={12} key={address.id}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {address.type}
                        </Typography>
                        {address.isDefault && (
                          <Chip 
                            label="Default" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1, height: 20 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2">
                        {address.name}
                      </Typography>
                      <Typography variant="body2">
                        {address.address}
                      </Typography>
                      <Typography variant="body2">
                        {address.phone}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditAddress(address.id)}
                        sx={{ mr: 1 }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={address.isDefault}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
                {!address.isDefault && (
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      Set as Default
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <LocationOn sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No addresses saved
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Add an address for easier checkout.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<LocationOn />}
            onClick={() => setShowAddressForm(true)}
          >
            Add New Address
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderPaymentTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Methods
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <CreditCard sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No payment methods added
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Add a payment method for faster checkout.
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<CreditCard />}
        >
          Add Payment Method
        </Button>
      </Box>
    </Box>
  );

  const tabContent = [
    renderProfileTab(),
    renderOrdersTab(),
    renderWishlistTab(),
    renderAddressesTab(),
    renderPaymentTab()
  ];

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mb: 2,
                  bgcolor: 'primary.main'
                }}
              >
                {userData.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" align="center">
                {userData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {userData.email}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List component="nav" sx={{ width: '100%' }}>
              <ListItem 
                button 
                selected={activeTab === 0} 
                onClick={(e) => handleTabChange(e, 0)}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              
              <ListItem 
                button 
                selected={activeTab === 1} 
                onClick={(e) => handleTabChange(e, 1)}
              >
                <ListItemIcon>
                  <ShoppingBag />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItem>
              
              <ListItem 
                button 
                selected={activeTab === 2} 
                onClick={(e) => handleTabChange(e, 2)}
              >
                <ListItemIcon>
                  <Favorite />
                </ListItemIcon>
                <ListItemText primary="Wishlist" />
              </ListItem>
              
              <ListItem 
                button 
                selected={activeTab === 3} 
                onClick={(e) => handleTabChange(e, 3)}
              >
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText primary="Addresses" />
              </ListItem>
              
              <ListItem 
                button 
                selected={activeTab === 4} 
                onClick={(e) => handleTabChange(e, 4)}
              >
                <ListItemIcon>
                  <CreditCard />
                </ListItemIcon>
                <ListItemText primary="Payment Methods" />
              </ListItem>
              
              <Divider sx={{ my: 1 }} />
              
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="profile tabs"
              >
                <Tab icon={<Person />} label="Profile" />
                <Tab icon={<ShoppingBag />} label="Orders" />
                <Tab icon={<Favorite />} label="Wishlist" />
                <Tab icon={<LocationOn />} label="Addresses" />
                <Tab icon={<CreditCard />} label="Payment" />
              </Tabs>
              <Divider sx={{ mb: 3 }} />
            </Box>
            
            {tabContent[activeTab]}
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 