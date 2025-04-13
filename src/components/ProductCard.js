import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Rating, Box, Chip, CardActions, Button, IconButton } from '@mui/material';
import { ShoppingCart, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Fallback images for when product images are not available
const fallbackImages = {
  men: "https://images.unsplash.com/photo-1552831388-6a0b3575b32a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  women: "https://images.unsplash.com/photo-1551163943-3f7e29e5ed20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
};

const ProductCard = ({ product, addToCart, addToWishlist, showCartButton = true }) => {
  const { id, name, price, image, rating, inStock, category } = product;
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get the appropriate image source
  const getImageSource = () => {
    if (imageError || !image) {
      return fallbackImages[category] || fallbackImages.men;
    }
    return image;
  };

  // Handle card click to navigate to product detail
  const handleCardClick = (e) => {
    // Prevent navigation if the click was on the buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/product/${id}`);
  };

  // Handle wishlist button click
  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    // Call the addToWishlist function passed as prop
    if (addToWishlist && inStock) {
      addToWishlist(product);
    }
  };

  // Handle add to cart button click
  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add the product to cart directly
    if (addToCart && inStock) {
      addToCart(product, { size: product.sizes?.[0] || 'M', color: product.colors?.[0] || 'Default' });
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s',
        borderRadius: 0,
        border: '1px solid #f0f0f0',
        boxShadow: 'none',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          '& .MuiCardMedia-root': {
            transform: 'scale(1.03)',
            transition: 'transform 0.6s ease'
          }
        }
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="300"
          image={getImageSource()}
          alt={name}
          onError={handleImageError}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
        <Chip 
          label={category === 'men' ? "Men's" : "Women's"} 
          color="primary" 
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 10, 
            left: 10,
            textTransform: 'uppercase',
            fontWeight: 400,
            fontSize: '0.7rem',
            letterSpacing: 0.5,
            borderRadius: 0,
            backgroundColor: 'rgba(0,0,0,0.7)'
          }} 
        />
        {!inStock && (
          <Chip 
            label="Out of Stock" 
            color="error" 
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 10,
              borderRadius: 0,
              textTransform: 'uppercase',
              fontWeight: 400,
              fontSize: '0.7rem',
              letterSpacing: 0.5
            }} 
          />
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: '500',
            height: '3em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '1.1rem',
            letterSpacing: 0.5,
            mb: 1
          }}
        >
          {name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={rating} 
            precision={0.5} 
            size="small" 
            readOnly 
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ ml: 1, fontSize: '0.75rem' }}
          >
            ({rating})
          </Typography>
        </Box>
        
        <Typography 
          variant="h6"
          sx={{ 
            fontWeight: '600',
            letterSpacing: 0.5,
            fontSize: '1.2rem'
          }}
        >
          ${price.toFixed(2)}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        {showCartButton && (
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={!inStock}
            sx={{ 
              textTransform: 'none',
              borderRadius: 0,
              px: 2,
              letterSpacing: 0.5,
              fontWeight: 400,
              boxShadow: 'none',
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333',
                boxShadow: 'none'
              },
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e'
              }
            }}
          >
            Add to Cart
          </Button>
        )}
        
        <IconButton
          size="small"
          onClick={handleAddToWishlist}
          disabled={!inStock}
          sx={{
            color: 'secondary.main',
            ml: showCartButton ? 0 : 'auto'
          }}
        >
          <FavoriteBorder />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 