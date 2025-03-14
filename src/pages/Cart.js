import React from 'react';
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
  TableRow
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Cart = ({ cart = [], updateCartItemQuantity, removeFromCart }) => {
  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Calculate shipping (free if subtotal > 3500)
  const shipping = subtotal > 3500 ? 0 : 250;
  
  // Calculate total
  const total = subtotal + shipping;

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
                      <TableCell>₹{item.price.toLocaleString('en-IN')}</TableCell>
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
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
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
                  <Typography variant="body2">₹{subtotal.toLocaleString('en-IN')}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">
                    {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>₹{total.toLocaleString('en-IN')}</Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large"
                  sx={{ 
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Proceed to Checkout
                </Button>
                
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
    </Container>
  );
};

export default Cart; 