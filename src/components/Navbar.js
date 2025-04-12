/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Drawer, List, ListItem, ListItemText, Container, useMediaQuery, useTheme, Menu, MenuItem, Avatar, Box } from '@mui/material';
import { ShoppingCart, Menu as MenuIcon, Search } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Navbar = ({ cartItemCount = 0, user, logout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const navItems = [
    { text: 'Home', path: '/' },
    { text: "Men's Collection", path: '/category/men' },
    { text: "Women's Collection", path: '/category/women' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  const drawer = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem button component={Link} to={item.path} key={item.text}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      keepMounted
    >
      <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
        My Profile
      </MenuItem>
      <MenuItem component={Link} to="/orders" onClick={handleProfileMenuClose}>
        My Orders
      </MenuItem>
      <MenuItem component={Link} to="/wishlist" onClick={handleProfileMenuClose}>
        Wishlist
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <>
    <AppBar position="fixed" sx={{ 
      backgroundColor: 'white',
      color: 'black',
      boxShadow: 'none',
      borderBottom: '1px solid rgba(0,0,0,0.08)'
    }}>
      <Container maxWidth="xl">
        {/* Main Toolbar with centered Logo */}
        <Toolbar 
          disableGutters 
          sx={{ 
            py: 2,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '80px'
          }}
        >
          {/* Left section */}
          <Box sx={{ 
            position: 'absolute', 
            left: 0, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            display: 'flex',
            alignItems: 'center'
          }}>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 1 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <Search />
            </IconButton>
          </Box>
          
          {/* Centered Logo */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontFamily:'"Bodoni Moda", serif',
              fontSize: { xs: '28px', md: '32px' },
              fontWeight: '500',
              textDecoration: 'none',
              color: 'inherit',
              textTransform: 'uppercase',
              letterSpacing: 2,
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            Lorain
          </Typography>

          {/* Right section */}
          <Box sx={{ 
            position: 'absolute', 
            right: 0, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            display: 'flex',
            alignItems: 'center'
          }}>
            {user ? (
              <IconButton 
                color="inherit" 
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'grey.800',
                    fontSize: '0.875rem'
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
              </IconButton>
            ) : (
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ 
                  ml: 1,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  opacity: 0.9,
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'transparent',
                  }
                }}
              >
                Login
              </Button>
            )}
            
            <IconButton color="inherit" component={Link} to="/cart" sx={{ ml: 1 }}>
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCart sx={{ fontSize: '1.2rem' }} />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
        
        {/* Navigation menu */}
        {!isMobile && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              py: 1.5,
              borderTop: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            {navItems.map((item, index) => (
              <Button 
                color="inherit" 
                component={Link} 
                to={item.path} 
                key={item.text}
                sx={{ 
                  mx: 3,
                  px: 1,
                  fontSize: '0.75rem',
                  letterSpacing: 1,
                  fontWeight: 500,
                  opacity: 0.85,
                  position: 'relative',
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'transparent',
                    '&::after': {
                      width: '100%',
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '1px',
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'black',
                    transition: 'width 0.3s ease'
                  },
                  textTransform: 'uppercase',
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}
      </Container>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'white',
            color: 'black'
          }
        }}
      >
        {drawer}  
      </Drawer>
      
      {profileMenu}
    </AppBar>
    {/* Add space below the fixed AppBar */}
    <Box sx={{ height: isMobile ? '80px' : '140px' }} />
    </>
  );
};

export default Navbar; 