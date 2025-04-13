import React, { useState } from 'react';
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
  IconButton
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
  AddShoppingCart
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, logout, cart, wishlist, removeFromCart, removeFromWishlist }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'user@example.com',
    phone: '+91 98765 43210',
    address: '123 Fashion Street, Adajan, Surat, Gujarat 395009'
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // If no user is logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  // Handle product click to navigate to product details
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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
              >
                Change Password
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
              >
                Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderOrdersTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Orders
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {user.orderHistory && user.orderHistory.length > 0 ? (
        <Grid container spacing={3}>
          {user.orderHistory.map((order) => (
            <Grid item xs={12} key={order.orderId}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Order #{order.orderId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(order.orderDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: ${order.totalAmount.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
          >
            Start Shopping
          </Button>
        </Box>
      )}
    </Box>
  );

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
      <Typography variant="h6" gutterBottom>
        Your Addresses
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Home
              </Typography>
              <Typography variant="body2">
                {userData.name}
              </Typography>
              <Typography variant="body2">
                {userData.address}
              </Typography>
              <Typography variant="body2">
                {userData.phone}
              </Typography>
            </Box>
            <Box>
              <Button size="small" startIcon={<Edit />}>
                Edit
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Button 
        variant="outlined" 
        startIcon={<LocationOn />}
      >
        Add New Address
      </Button>
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