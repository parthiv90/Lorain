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
      {/* Removing the Spring Collection video section */}
      
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
        
        {/* Fashion Video Section */}
        <Box 
          sx={{ 
            width: '100%', 
            height: { xs: '400px', sm: '500px', md: '600px' },
            position: 'relative',
            overflow: 'hidden',
            mb: 8,
            mt: 8
          }}
        >
          <Box
            component="video"
            src="https://videos.pexels.com/video-files/4825045/4825045-uhd_2560_1440_30fps.mp4"
            autoPlay
            muted
            loop
            playsInline
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              filter: 'brightness(0.75)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              px: 2,
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              color="white"
              sx={{
                textAlign: 'center',
                fontFamily: '"Bodoni Moda", serif',
                fontWeight: '600',
                mb: 3,
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                fontSize: { xs: '1rem', sm: '2.8rem', md: '3.5rem' },
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              Style Redefined
            </Typography>
            <Typography
              variant="body1"
              color="white"
              sx={{
                textAlign: 'center',
                fontFamily: '"Cormorant Garamond", serif',
                mb: 5,
                maxWidth: '700px',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
                letterSpacing: 1,
                fontWeight: '400',
              }}
            >
              Experience elegance and sophistication with our carefully curated collection
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/category/women"
              sx={{
                px: 6,
                py: 1.5,
                color: 'black',
                bgcolor: 'white',
                borderRadius: 0,
                fontWeight: '600',
                letterSpacing: 1,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  boxShadow: 'none',
                }
              }}
            >
              Discover Collection
            </Button>
          </Box>
        </Box>
        
        {/* Featured Products Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: '600',
              textAlign: 'center',
              position: 'relative',
              mb: 5,
              fontSize: '1.8rem',
              letterSpacing: 2,
              textTransform: 'uppercase',
              '&::after': {
                content: '""',
                display: 'block',
                width: '40px',
                height: '2px',
                backgroundColor: 'black',
                margin: '16px auto',
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
                  backgroundImage: 'url(https://images.unsplash.com/photo-1737994874349-9da316080f17?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
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
                color="primary"   h
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
                  height: { xs: '300px', md: '400px' },
                  width: '100%',
                  backgroundImage: 'url(https://images.pexels.com/photos/10131764/pexels-photo-10131764.jpeg?auto=compress&cs=tinysrgb&w=2500)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                  mb: { xs: 3, md: 0 },
                  display: 'block',
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