import React from 'react';
import { Container, Typography, Box, Grid, Button, Divider, Card, CardContent } from '@mui/material';
import { TrendingUp, LocalShipping, Verified, Support } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

const Home = ({ addToCart }) => {
  // Get featured products (select specific products for better curation)
  const featuredProductIds = [1, 3, 5, 7, 9, 11];
  const featuredProducts = products.filter(product => featuredProductIds.includes(product.id));

  return (
    <div>
      <Hero />
      
      <Container>
        {/* Features Section */}
        <Box sx={{ my: 8 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <LocalShipping color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Free Shipping</Typography>
                  <Typography variant="body2" color="text.secondary">
                    On orders over ₹3,500
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Verified color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Quality Guarantee</Typography>
                  <Typography variant="body2" color="text.secondary">
                    100% original products
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Support color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>24/7 Support</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dedicated customer service
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <TrendingUp color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Latest Trends</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Updated with fashion trends
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        {/* Featured Products Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'relative',
              mb: 5,
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
            Featured Products
          </Typography>
          
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={4}>
                <ProductCard product={product} addToCart={addToCart} />
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large" 
              component={Link} 
              to="/category/men"
              sx={{ 
                mx: 2,
                px: 4,
                py: 1,
                borderRadius: '30px',
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Shop Men's Collection
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large" 
              component={Link} 
              to="/category/women"
              sx={{ 
                mx: 2,
                px: 4,
                py: 1,
                borderRadius: '30px',
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Shop Women's Collection
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 8 }} />
        
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '400px',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Men's Collection
              </Typography>
              <Typography variant="body1" paragraph>
                Discover our latest men's collection featuring stylish and comfortable clothing for every occasion. From casual t-shirts to formal blazers, we have everything you need to elevate your style.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                component={Link} 
                to="/category/men"
                sx={{ 
                  mt: 2,
                  px: 4,
                  py: 1,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Shop Men's Collection
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={4} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Women's Collection
              </Typography>
              <Typography variant="body1" paragraph>
                Explore our women's collection featuring trendy and elegant clothing for every style. From casual blouses to stylish dresses, we have the perfect pieces to enhance your wardrobe.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                component={Link} 
                to="/category/women"
                sx={{ 
                  mt: 2,
                  px: 4,
                  py: 1,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Shop Women's Collection
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '400px',
                  backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1713586580802-854a58542159?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fHdvbWFucyUyMGNvbGxlY3Rpb258ZW58MHx8MHx8fDA%3D?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Home; 