import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Rating, 
  Breadcrumbs, 
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  ImageList,
  ImageListItem
} from '@mui/material';
import { ShoppingCart, Favorite, LocalShipping, Cached } from '@mui/icons-material';
import products from '../data/products';
import ProductList from '../components/ProductList';

// Additional images for specific products
const additionalImages = {
  9: [
    "/woman's summer dress/sofia-VBZ3aYIbgc0-unsplash.jpg",
    "/woman's summer dress/tamara-bellis-68csPWTnafo-unsplash.jpg",
    "/woman's summer dress/mark-adriane-V7IJzp_ElQc-unsplash.jpg",
    "/woman's summer dress/oleg-ivanov-sg_gRhbYXhc-unsplash.jpg"
  ],
  11: [
    "/woman's yoga pants/pexels-elly-fairytale-3822350.jpg",
    "/woman's yoga pants/pexels-daria-ivanenko-3557414-9225751.jpg",
    "/woman's yoga pants/pexels-polina-kovaleva-6019892.jpg"
  ]
};

const ProductDetail = ({ addToCart }) => {
  const { productId } = useParams();
  const product = products.find(p => p.id === parseInt(productId));
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Set the initial selected image when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  // If product not found
  if (!product) {
    return (
      <Container sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Product Not Found
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
          Return to Home
        </Button>
      </Container>
    );
  }
  
  const { id, name, price, image, description, rating, inStock, category, sizes, colors } = product;
  
  // Get product images (main + additional if available)
  const productImages = additionalImages[id] || [image];
  
  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === category && p.id !== id)
    .slice(0, 4);
  
  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addToCart({
        ...product,
        selectedSize,
        selectedColor,
        quantity
      });
      setOpenSnackbar(true);
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };
  
  const categoryName = category === 'men' ? "Men's Clothing" : "Women's Clothing";
  
  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
          <Link to={`/category/${category}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {categoryName}
          </Link>
          <Typography color="text.primary">{name}</Typography>
        </Breadcrumbs>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: '100%',
              height: '500px',
              backgroundImage: `url(${selectedImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
              mb: 2,
              position: 'relative'
            }}
          >
            <Chip 
              label={category === 'men' ? "Men's" : "Women's"} 
              color="primary" 
              size="small"
              sx={{ 
                position: 'absolute', 
                top: 16, 
                left: 16,
                textTransform: 'capitalize'
              }} 
            />
          </Box>

          {productImages.length > 1 && (
            <ImageList sx={{ height: 100 }} cols={4} rowHeight={100}>
              {productImages.map((img, index) => (
                <ImageListItem 
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  sx={{ 
                    cursor: 'pointer',
                    border: img === selectedImage ? '2px solid #1976d2' : 'none',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={img}
                    alt={`${name} view ${index + 1}`}
                    loading="lazy"
                    style={{ height: '100%', objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({rating} rating)
            </Typography>
          </Box>
          
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
            ₹{price.toLocaleString('en-IN')}
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {description}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="size-select-label">Size</InputLabel>
                  <Select
                    labelId="size-select-label"
                    id="size-select"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    label="Size"
                    required
                  >
                    {sizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="color-select-label">Color</InputLabel>
                  <Select
                    labelId="color-select-label"
                    id="color-select"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    label="Color"
                    required
                  >
                    {colors.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={!inStock || !selectedSize || !selectedColor}
              sx={{ 
                flex: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Add to Cart
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Favorite />}
              sx={{ 
                flex: 1,
                py: 1.5,
                textTransform: 'none'
              }}
            >
              Wishlist
            </Button>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocalShipping fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Free shipping on orders over ₹3,500
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Cached fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                30-day easy returns
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 8 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            textAlign: 'center',
            position: 'relative',
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
          You May Also Like
        </Typography>
        
        <ProductList 
          products={relatedProducts} 
          title="" 
          addToCart={addToCart}
          totalProducts={relatedProducts.length}
        />
      </Box>
      
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Product added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail; 