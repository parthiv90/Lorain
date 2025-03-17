import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Rating, Box, Chip } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';

// Fallback images for when product images are not available
const fallbackImages = {
  men: "https://images.unsplash.com/photo-1552831388-6a0b3575b32a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  women: "https://images.unsplash.com/photo-1551163943-3f7e29e5ed20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
};

const ProductCard = ({ product, addToCart }) => {
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
    // Prevent navigation if the click was on the Add to Cart button
    if (e.target.closest('button') && e.target.closest('button').textContent.includes('Add to Cart')) {
      return;
    }
    navigate(`/product/${id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="250"
          image={getImageSource()}
          alt={name}
          onError={handleImageError}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
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
            textTransform: 'capitalize'
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
              right: 10 
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
            fontWeight: 'bold',
            height: '3em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({rating})
          </Typography>
        </Box>
        
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          ₹{price.toLocaleString('en-IN')}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<ShoppingCart />}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          disabled={!inStock}
          sx={{ textTransform: 'none' }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 