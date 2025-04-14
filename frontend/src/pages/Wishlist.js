import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Divider,
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import { Delete, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Wishlist = ({ wishlist, removeFromWishlist, moveToCart }) => {
  const navigate = useNavigate();

  // Navigate to product detail page
  const handleClickProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Move from wishlist to cart
  const handleMoveToCart = (product) => {
    moveToCart(product);
    removeFromWishlist(product);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        My Wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2, bgcolor: '#f9f9f9' }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Your wishlist is empty
          </Alert>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Add items to your wishlist to save them for later
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    height={300}
                    sx={{ cursor: 'pointer', objectFit: 'cover' }}
                    onClick={() => handleClickProduct(item.id)}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleClickProduct(item.id)}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ my: 1 }}>
                    ${item.price.toFixed(2)}
                  </Typography>
                  {item.selectedSize && (
                    <Typography variant="body2" color="text.secondary">
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

                <Divider />

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    startIcon={<ShoppingCart />}
                    variant="contained"
                    size="small"
                    onClick={() => handleMoveToCart(item)}
                    sx={{ textTransform: 'none' }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton 
                    color="error"
                    onClick={() => removeFromWishlist(item)}
                    aria-label="Remove from wishlist"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist; 