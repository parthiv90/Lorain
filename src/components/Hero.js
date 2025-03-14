import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '80vh' },
        backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        mb: 6,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '60%' },
            color: 'white',
            textAlign: { xs: 'center', md: 'left' },
            p: { xs: 2, md: 0 }
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Elevate Your Style
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Discover the latest trends in men's and women's fashion
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/category/men"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: '30px',
              }}
            >
              Shop Men
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/category/women"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: '30px',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Shop Women
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero; 