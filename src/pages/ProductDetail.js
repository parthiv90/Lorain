import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  ImageListItem,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Cached,
} from "@mui/icons-material";
import products from "../data/products";
import ProductList from "../components/ProductList";

// Additional images for specific products
const additionalImages = {
  // 9: [
  //   "https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D",
  //   "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHN1bW1lciUyMGRyZXNzfGVufDB8fDB8fHww",
  //   "https://images.unsplash.com/photo-1609695813802-3c443be34359?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHN1bW1lciUyMGRyZXNzfGVufDB8fDB8fHww",
  //   "https://images.unsplash.com/photo-1532675432006-329c6fed7045?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHN1bW1lciUyMGRyZXNzfGVufDB8fDB8fHww",
  // ],
  // 11: [
  //   "https://images.unsplash.com/photo-1633707079221-63b0b83f9b87?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHlvZ2ElMjBwYW50c3xlbnwwfHwwfHx8MA%3D%3D",
  //   "https://images.unsplash.com/photo-1599744423264-76df84e91758?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHlvZ2ElMjBwYW50c3xlbnwwfHwwfHx8MA%3D%3D",
  //   "https://images.unsplash.com/photo-1591226195789-aeaa448e51c1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHlvZ2ElMjBwYW50c3xlbnwwfHwwfHx8MA%3D%3D",
  // ],
};

const ProductDetail = ({ addToCart, addToWishlist }) => {
  const { productId } = useParams();
  const product = products.find((p) => p.id === parseInt(productId));

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedImage, setSelectedImage] = useState("");
  const [setImageError] = useState(false);

  // Set the initial selected image when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  // If product not found
  if (!product) {
    return (
      <Container sx={{ mt: 8, mb: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Product Not Found
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
          Return to Home
        </Button>
      </Container>
    );
  }

  const {
    id,
    name,
    price,
    image,
    description,
    rating,
    inStock,
    category,
    sizes,
    colors,
  } = product;

  // Get product images (main + additional if available)
  const productImages = additionalImages[id] || [image];

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === category && p.id !== id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addToCart({
        ...product,
        selectedSize,
        selectedColor,
        quantity,
      });
      setSnackbarMessage("Item added to cart");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Please select size and color");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  const handleAddToWishlist = () => {
    if (selectedSize && selectedColor) {
      addToWishlist({
        ...product,
        selectedSize,
        selectedColor,
        quantity: 1, // Default to 1 for wishlist
      });
      setSnackbarMessage("Item added to wishlist");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Please select size and color");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const categoryName =
    category === "men" ? "Men's Clothing" : "Women's Clothing";

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Link
            to={`/category/${category}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {categoryName}
          </Link>
          <Typography color="text.primary">{name}</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              height: "500px",
              backgroundImage: `url(${selectedImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 2,
              mb: 2,
              position: "relative",
            }}
          >
            <Chip
              label={category === "men" ? "Men's" : "Women's"}
              color="primary"
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                textTransform: "capitalize",
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
                    cursor: "pointer",
                    border:
                      img === selectedImage ? "2px solid #1976d2" : "none",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img}
                    alt={`${name} view ${index + 1}`}
                    loading="lazy"
                    style={{ height: "100%", objectFit: "cover" }}
                    onError={handleImageError}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "medium" }}
          >
            {name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Rating value={rating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {rating} / 5
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            ${price.toFixed(2)}
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
              Size
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="size-label">Select Size</InputLabel>
              <Select
                labelId="size-label"
                id="size"
                value={selectedSize}
                label="Select Size"
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {sizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
              Color
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="color-label">Select Color</InputLabel>
              <Select
                labelId="color-label"
                id="color"
                value={selectedColor}
                label="Select Color"
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {colors.map((color) => (
                  <MenuItem key={color} value={color}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          backgroundColor: color,
                          border: "1px solid #e0e0e0",
                          mr: 1,
                        }}
                      />
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={!inStock}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<FavoriteBorder />}
              onClick={handleAddToWishlist}
              disabled={!inStock}
              sx={{ py: 1.5 }}
            >
              Wishlist
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
            >
              <LocalShipping sx={{ mr: 1.5, color: "text.secondary" }} />
              <Typography variant="body2">
                Free shipping on orders over $100
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Cached sx={{ mr: 1.5, color: "text.secondary" }} />
              <Typography variant="body2">
                Free 30-day returns and exchanges
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          You May Also Like
        </Typography>
        <ProductList products={relatedProducts} addToCart={addToCart} addToWishlist={addToWishlist} />
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;
