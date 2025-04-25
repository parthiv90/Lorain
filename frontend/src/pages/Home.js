import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Container, Typography, Box, Grid, Button, Divider, Card, CardContent, CardMedia } from '@mui/material';
import { TrendingUp, LocalShipping, Verified, Support } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import products from '../data/products';
// Remove unused components
// import ProductList from '../components/ProductList';
// import LuxuryFeature from '../components/LuxuryFeature';
// import { PRODUCTS } from '../data/products';
// import bannerImage from '../assets/images/hero-banner.jpg';
// import deliveryIcon from '../assets/icons/delivery.svg';
// import qualityIcon from '../assets/icons/quality.svg';
// import customerServiceIcon from '../assets/icons/customer-service.svg';

// Define FEATURED_PRODUCT_IDS for combined 7 products (4 men's and 3 women's)
const FEATURED_PRODUCT_IDS = [1, 2, 3, 5, 7, 9, 12];
// Define MENS_PRODUCT_IDS - selecting 4 men's products
const MENS_PRODUCT_IDS = [1, 2, 3, 13];
// Define WOMENS_PRODUCT_IDS - selecting 4 women's products
const WOMENS_PRODUCT_IDS = [7, 8, 9, 19];

const Home = ({ addToCart, addToWishlist }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [mensProducts, setMensProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [womensProducts, setWomensProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  useEffect(() => {
    // Filter products to show combined featured products
    const featured = products.filter(product => 
      FEATURED_PRODUCT_IDS.includes(product.id)
    );
    setFeaturedProducts(featured);

    // Filter products to show selected men's products
    const mens = products.filter(product => 
      MENS_PRODUCT_IDS.includes(product.id)
    );
    setMensProducts(mens);

    // Filter products to show selected women's products
    const womens = products.filter(product => 
      WOMENS_PRODUCT_IDS.includes(product.id)
    );
    setWomensProducts(womens);
  }, []);

  return (
    <div>
      <Hero />
      
      <Container>
        {/* Features Section */}
        <Box sx={{ my: 8 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                <CardContent>
                  <LocalShipping color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Bodoni Moda", serif', letterSpacing: '0.5px' }}>Free Shipping</Typography>
                  <Typography variant="body2" color="text.secondary">
                    On orders over $47.00
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                <CardContent>
                  <Verified color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Bodoni Moda", serif', letterSpacing: '0.5px' }}>Quality Guarantee</Typography>
                  <Typography variant="body2" color="text.secondary">
                    100% original products
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                <CardContent>
                  <Support color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Bodoni Moda", serif', letterSpacing: '0.5px' }}>24/7 Support</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dedicated customer service
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                <CardContent>
                  <TrendingUp color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Bodoni Moda", serif', letterSpacing: '0.5px' }}>Latest Trends</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Updated with fashion trends
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        {/* Video Banner Section - Moved between shipping section and featured products */}
        <Box 
          sx={{ 
            position: 'relative',
            height: { xs: '400px', md: '600px' },
            width: '100%',
            overflow: 'hidden',
            mb: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            component="video"
            src="https://assets.mixkit.co/videos/18209/18209-720.mp4"
            autoPlay
            muted
            loop
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: -1,
              filter: 'brightness(0.5)',
            }}
          />
          <Box
            sx={{
              textAlign: 'center',
              color: 'white',
              p: 4,
              maxWidth: '800px'
            }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                fontFamily: '"Bodoni Moda", serif',
              }}
            >
              STYLE REDEFINED
            </Typography>
            <Typography 
              variant="h6" 
              paragraph
              sx={{ 
                mb: 4,
                maxWidth: '900px',
                mx: 'auto',
                letterSpacing: '0.5px',
                fontWeight: 300
              }}
            >
              Experience elegance and sophistication with our carefully curated collection
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={Link}
              to="/category/women"
              sx={{ 
                // borderRadius: '10px',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: 'black',
                letterSpacing: '0.5px',
                '&:hover': {
                  backgroundColor: 'rgba(179, 176, 176, 0.78)',
                }
              }}
            >
              DISCOVER COLLECTION
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
              fontSize: '30px',
              textAlign: 'center',
              position: 'relative',
              mb: 5,
              fontFamily: '"Playfair Display", serif', 
              letterSpacing: '2px',
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
            FEATURED PRODUCTS
          </Typography>
          
          <Grid container spacing={4} mb={6}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard 
                  product={product} 
                  addToCart={addToCart} 
                  addToWishlist={addToWishlist}
                  showCartButton={false}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Divider sx={{ my: 8 }} />
        
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '500px',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1737994874349-9da316080f17?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ 
                // fontWeight: 'bold',
                fontFamily: '"Playfair Display", serif',
                letterSpacing: 1
              }}>
                Men's Collection
              </Typography>
              <Typography variant="body1" paragraph sx={{ letterSpacing: '0.5px', lineHeight: 1.8 }}>
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
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
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
              <Typography variant="h4" component="h2" gutterBottom sx={{ 
                // fontWeight: 'bold',
                letterSpacing: '0.5px',
                fontFamily: '"Playfair Display", serif'
              }}>
                Women's Collection
              </Typography>
              <Typography variant="body1" paragraph sx={{ letterSpacing: '0.5px', lineHeight: 1.8 }}>
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
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}
              >
                Shop Women's Collection
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '500px',
                  backgroundImage: 'url(https://images.pexels.com/photos/10131764/pexels-photo-10131764.jpeg?auto=compress&cs=tinysrgb&w=3000)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '@media (max-width: 600px)': {
                    height: '300px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
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
