import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import ProductList from '../components/ProductList';
import products from '../data/products';

const Category = ({ addToCart, addToWishlist }) => {
  const { categoryId } = useParams();
  const [page, setPage] = useState(1);
  const productsPerPage = 8;

  // Filter products by category
  const categoryProducts = products.filter(
    product => product.category === categoryId
  );

  // Calculate pagination
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  // Format category name for display
  const categoryName = categoryId === 'men' ? "Men's Clothing" : "Women's Clothing";

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/Fashion-web">
            Home
          </Link>
          <Typography color="text.primary">{categoryName}</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 1
          }}
        >
          {categoryName}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto',
            mb: 4
          }}
        >
          {categoryId === 'men' 
            ? "Discover our collection of men's clothing featuring stylish and comfortable pieces for every occasion."
            : "Explore our collection of women's clothing featuring trendy and elegant pieces to enhance your wardrobe."}
        </Typography>
      </Box>

      <ProductList 
        products={currentProducts} 
        title="" 
        addToCart={addToCart}
        addToWishlist={addToWishlist}
        page={page}
        setPage={setPage}
        productsPerPage={productsPerPage}
        totalProducts={categoryProducts.length}
      />
    </Container>
  );
};

export default Category; 