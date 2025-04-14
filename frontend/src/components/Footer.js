import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, Pinterest, YouTube, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        color: 'black',
        py: 10,
        mt: 10,
        borderTop: '1px solid rgba(0,0,0,0.08)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{  
              flexGrow: 1,
              fontFamily:'"Bodoni Moda", serif',
              fontSize:'28px',
              fontWeight: '500',
              letterSpacing: 2,
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontOpticalSizing: 'auto',
              color: 'inherit',
              mb: 3,
            }}>
              Lorain
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, fontSize: '0.9rem', letterSpacing: 0.5, lineHeight: 1.6 }}>
              Your exclusive destination for luxury clothing and accessories. We curate the finest pieces for those who appreciate exceptional quality and timeless style.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton color="inherit" size="small" sx={{ 
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: 0,
                padding: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }
              }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton color="inherit" size="small" sx={{ 
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: 0,
                padding: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }
              }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton color="inherit" size="small" sx={{ 
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: 0,
                padding: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }
              }}>
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton color="inherit" size="small" sx={{ 
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: 0,
                padding: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }
              }}>
                <Pinterest fontSize="small" />
              </IconButton>
              <IconButton color="inherit" size="small" sx={{ 
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: 0,
                padding: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }
              }}>
                <YouTube fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: '500',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '18px',
              letterSpacing: 1,
              textTransform: 'uppercase',
              mb: 3
            }}>
              Shop
            </Typography>
            <Link href="/Fashion-web/category/men" color="inherit" underline="hover" display="block" sx={{ 
              mb: 2,
              fontSize: '0.9rem',
              letterSpacing: 0.5,
              opacity: 0.85,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                pl: 0.5
              }
            }}>
              Men's Clothing
            </Link>
            <Link href="/Fashion-web/category/women" color="inherit" underline="hover" display="block" sx={{ 
              mb: 2,
              fontSize: '0.9rem',
              letterSpacing: 0.5,
              opacity: 0.85,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                pl: 0.5
              }
            }}>
              Women's Clothing
            </Link>
            <Link href="/Fashion-web/sale" color="inherit" underline="hover" display="block" sx={{ 
              mb: 2,
              fontSize: '0.9rem',
              letterSpacing: 0.5,
              opacity: 0.85,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                pl: 0.5
              }
            }}>
              Sale
            </Link>
            <Link href="/Fashion-web/accessories" color="inherit" underline="hover" display="block" sx={{ 
              mb: 2,
              fontSize: '0.9rem',
              letterSpacing: 0.5,
              opacity: 0.85,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                pl: 0.5
              }
            }}>
              Accessories
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: '500',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '18px',
              letterSpacing: 1,
              textTransform: 'uppercase',
              mb: 3
            }}>
              Customer Service
            </Typography>
            <Link href="/Fashion-web/contact" color="inherit" underline="hover" display="block" sx={{ 
              mb: 2,
              fontSize: '0.9rem',
              letterSpacing: 0.5,
              opacity: 0.85,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                pl: 0.5
              }
            }}>
              Contact Us
            </Link>
            <Link href="/Fashion-web/shipping" color="inherit" underline="hover" display="block" sx={{ 
              mb: 2,
              fontSize: '0.9rem',
              letterSpacing: 0.5,
              opacity: 0.85,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                pl: 0.5
              }
            }}>
              Shipping & Returns
            </Link>
            <Link href="/Fashion-web/size-guide" color="inherit" underline="hover" display="block" sx={{ 
              mb: 2,
              fontSize: '0.9rem',
              letterSpacing: 0.5,
              opacity: 0.85,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                pl: 0.5
              }
            }}>
              Size Guide
            </Link>
            <Link href="/Fashion-web/privacy-policy" color="inherit" underline="hover" display="block" sx={{ 
              mb: 2,
              fontSize: '0.9rem',
              letterSpacing: 0.5,
              opacity: 0.85,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                pl: 0.5
              }
            }}>
              Privacy Policy
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: '500',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '18px',
              letterSpacing: 1,
              textTransform: 'uppercase',
              mb: 3
            }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn fontSize="small" sx={{ mr: 1, opacity: 0.85 }} />
              <Typography variant="body2" sx={{ fontSize: '0.9rem', letterSpacing: 0.5 }}>
                123 Fashion Street, Adajan, Surat, Gujarat, India
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Phone fontSize="small" sx={{ mr: 1, opacity: 0.85 }} />
              <Typography variant="body2" sx={{ fontSize: '0.9rem', letterSpacing: 0.5 }}>
                +91 95108 74033
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email fontSize="small" sx={{ mr: 1, opacity: 0.85 }} />
              <Typography variant="body2" sx={{ fontSize: '0.9rem', letterSpacing: 0.5 }}>
                info@lorain.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)', my: 6 }} />

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: 'center' 
        }}>
          <Typography variant="body2" sx={{ 
            mb: { xs: 2, sm: 0 },
            fontSize: '0.85rem',
            letterSpacing: 0.5,
            opacity: 0.7
          }}>
            © {new Date().getFullYear()} Lorain Luxury Fashion. All rights reserved.
          </Typography>
          <Box>
            <Link href="/Fashion-web/terms" color="inherit" underline="hover" sx={{ 
              mx: 1.5, 
              fontSize: '0.85rem',
              letterSpacing: 0.5,
              opacity: 0.7,
              '&:hover': {
                opacity: 1
              }
            }}>
              Terms of Service
            </Link>
            <Link href="/Fashion-web/privacy" color="inherit" underline="hover" sx={{ 
              mx: 1.5, 
              fontSize: '0.85rem',
              letterSpacing: 0.5,
              opacity: 0.7,
              '&:hover': {
                opacity: 1
              }
            }}>
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 