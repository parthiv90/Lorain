import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, Pinterest, YouTube, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{  
              flexGrow: 1,
              fontFamily:'"Bodoni Moda", serif',
              fontSize:'34px',
              fontWeight: '400',
              // fontStyle: 'normal',
              textDecoration: 'none',
              fontOpticalSizing: 'auto',
              color: 'inherit', }}>
              LORAIN
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your one-stop destination for trendy men's and women's clothing. We offer the latest styles at affordable prices.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Pinterest />
              </IconButton>
              <IconButton color="inherit" size="small">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Shop
            </Typography>
            <Link href="/category/men" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Men's Clothing
            </Link>
            <Link href="/category/women" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Women's Clothing
            </Link>
            <Link href="/new-arrivals" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              New Arrivals
            </Link>
            <Link href="/sale" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Sale
            </Link>
            <Link href="/accessories" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Accessories
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Customer Service
            </Typography>
            <Link href="/contact" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Contact Us
            </Link>
            <Link href="/faq" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              FAQ
            </Link>
            <Link href="/shipping" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Shipping & Returns
            </Link>
            <Link href="/size-guide" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Size Guide
            </Link>
            <Link href="/privacy-policy" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Privacy Policy
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                123 Fashion Street, Adajan, Surat, Gujarat 395009
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                +91 98765 43210
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                info@fashionstore.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} Fashion Store. All rights reserved.
          </Typography>
          <Box>
            <Link href="/terms" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Terms of Service
            </Link>
            <Link href="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 