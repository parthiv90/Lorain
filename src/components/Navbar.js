/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { AppBar, Toolbar,Typography, Button, IconButton, Badge, Drawer, List, ListItem, ListItemText, Container, useMediaQuery, useTheme, Menu, MenuItem, Avatar } from '@mui/material';
import { ShoppingCart, Menu as MenuIcon } from '@mui/icons-material';
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
    { text: "Men's Clothing", path: '/category/men' },
    { text: "Women's Clothing", path: '/category/women' },
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
    <AppBar position="static" sx={{ backgroundColor: 'black', mb: 4 }}>
  <Container>
    <Toolbar disableGutters>
      {isMobile && (
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontFamily:'"Bodoni Moda", serif',
              fontSize:'34px',
              fontWeight: '400',
              // fontStyle: 'normal',
              textDecoration: 'none',
              fontOpticalSizing: 'auto',
              color: 'inherit',
            }}
          >
            LORAIN
          </Typography>

          {!isMobile && (
            <div style={{ display: 'flex' }}>
              {navItems.map((item) => (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to={item.path} 
                  key={item.text}
                  sx={{ mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}
            </div>
          )}

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
                  bgcolor: 'secondary.main',
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
              sx={{ ml: 1 }}
            >
              Login
            </Button>
          )}
          
          <IconButton color="inherit" component={Link} to="/cart" sx={{ ml: 1 }}>
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Toolbar>
      </Container>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
      
      {profileMenu}
    </AppBar>
  );
};

export default Navbar; 