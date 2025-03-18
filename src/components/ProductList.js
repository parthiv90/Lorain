import React from 'react';
import { Grid, Typography, Box, Container, Pagination } from '@mui/material';
import ProductCard from './ProductCard';

const ProductList = ({ 
  products, 
  title = 'Products', 
  addToCart,
  page = 1,
  setPage,
  productsPerPage = 8,
  totalProducts
}) => {
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        {title && (
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'relative',
              '&::after': title ? {
                content: '""',
                display: 'block',
                width: '50px',
                height: '3px',
                backgroundColor: 'primary.main',
                margin: '8px auto',
              } : {}
            }}
          >
            {title}
          </Typography>
        )}
      </Box>

      {products.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ my: 5 }}>
          No products found.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} addToCart={addToCart} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductList; 