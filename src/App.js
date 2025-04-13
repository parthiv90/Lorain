import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import Profile from './pages/Profile';
import About from './pages/About';
import Wishlist from './pages/Wishlist';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#c9a66b', // Gold accent for luxury feel
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#737373',
    },
  },
  typography: {
    fontFamily: '"Cormorant Garamond", "Playfair Display", "Times New Roman", serif',
    h1: {
      fontWeight: 600,
      letterSpacing: 1,
    },
    h2: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
    h3: {
      fontWeight: 500,
      letterSpacing: 0.5,
    },
    h4: {
      fontWeight: 500,
      letterSpacing: 0.5,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      letterSpacing: 0.5,
    },
    body1: {
      letterSpacing: 0.5,
    },
    button: {
      fontWeight: 500,
      letterSpacing: 1,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid #f0f0f0',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e0e0e0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

function App() {
  // State for cart
  const [cart, setCart] = useState([]);
  // State for wishlist
  const [wishlist, setWishlist] = useState([]);
  // State for user
  const [user, setUser] = useState(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    console.log("Application initializing - loading user data");
    
    // Load user for authentication
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        // Extract user data for authentication
        const parsedUser = JSON.parse(savedUser);
        const authenticatedUser = {
          id: parsedUser.id,
          email: parsedUser.email,
          firstName: parsedUser.firstName || '',
          lastName: parsedUser.lastName || '',
          name: parsedUser.name || 'User',
          token: parsedUser.token
        };
        
        // Set user state
        setUser(authenticatedUser);
        
        console.log('Loaded user authentication data:', authenticatedUser);
        
        // Try to load user-specific cart and wishlist data first
        if (authenticatedUser.id) {
          const userId = authenticatedUser.id;
          let userCartLoaded = false;
          let userWishlistLoaded = false;
          
          // Try to load user-specific cart
          const userCartData = localStorage.getItem(`cart_${userId}`);
          if (userCartData) {
            try {
              const parsedCart = JSON.parse(userCartData);
              if (Array.isArray(parsedCart)) {
                // Sanitize cart quantities
                const sanitizedCart = parsedCart.map(item => ({
                  ...item,
                  quantity: Math.min(parseInt(item.quantity) || 1, 5)
                }));
                
                setCart(sanitizedCart);
                console.log(`Loaded user-specific cart for user ${userId}:`, sanitizedCart);
                userCartLoaded = true;
              }
            } catch (error) {
              console.error(`Failed to parse user-specific cart for user ${userId}:`, error);
            }
          }
          
          // Try to load user-specific wishlist
          const userWishlistData = localStorage.getItem(`wishlist_${userId}`);
          if (userWishlistData) {
            try {
              const parsedWishlist = JSON.parse(userWishlistData);
              if (Array.isArray(parsedWishlist)) {
                setWishlist(parsedWishlist);
                console.log(`Loaded user-specific wishlist for user ${userId}:`, parsedWishlist);
                userWishlistLoaded = true;
              }
            } catch (error) {
              console.error(`Failed to parse user-specific wishlist for user ${userId}:`, error);
            }
          }
          
          // If we loaded from user-specific storage, don't need to try backend or general storage
          if (userCartLoaded && userWishlistLoaded) {
            console.log("Successfully loaded user-specific cart and wishlist data.");
            return;
          }
        }
        
        // If user has token, fetch their cart and wishlist from backend
        if (authenticatedUser.token) {
          fetchUserCartFromBackend(authenticatedUser.token);
          fetchUserWishlistFromBackend(authenticatedUser.token);
          return; // Skip loading from localStorage if we're fetching from backend
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
    
    // If no authenticated user or no token, load cart and wishlist from general localStorage
    loadGuestCartAndWishlist();
  }, []);
  
  // Helper function to load guest cart and wishlist data
  const loadGuestCartAndWishlist = () => {
    try {
      // First try to load from guest-specific keys
      let guestCartLoaded = false;
      let guestWishlistLoaded = false;
      
      // Try guest cart
      const guestCartData = localStorage.getItem('cart_guest');
      if (guestCartData) {
        try {
          const parsedCart = JSON.parse(guestCartData);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            // Sanitize cart
            const sanitizedCart = parsedCart.map(item => ({
              ...item,
              quantity: Math.min(parseInt(item.quantity) || 1, 5) // Cap at 5 for safety
            }));
            
            // Set cart state
            setCart(sanitizedCart);
            console.log('Loaded and sanitized guest cart:', sanitizedCart);
            guestCartLoaded = true;
          }
        } catch (e) {
          console.error("Failed to parse guest cart:", e);
        }
      }
      
      // Try guest wishlist
      const guestWishlistData = localStorage.getItem('wishlist_guest');
      if (guestWishlistData) {
        try {
          const parsedWishlist = JSON.parse(guestWishlistData);
          if (Array.isArray(parsedWishlist) && parsedWishlist.length > 0) {
            // Set wishlist state
            setWishlist(parsedWishlist);
            console.log('Loaded guest wishlist:', parsedWishlist);
            guestWishlistLoaded = true;
          }
        } catch (e) {
          console.error("Failed to parse guest wishlist:", e);
        }
      }
      
      // If we successfully loaded guest data, we're done
      if (guestCartLoaded && guestWishlistLoaded) {
        return;
      }
      
      // If we're still here, try the general keys as a fallback
      
      // Load cart data
      if (!guestCartLoaded) {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            // Sanitize cart
            const sanitizedCart = parsedCart.map(item => ({
              ...item,
              quantity: Math.min(parseInt(item.quantity) || 1, 5) // Cap at 5 for safety
            }));
            
            // Set cart state
            setCart(sanitizedCart);
            console.log('Loaded and sanitized cart from general localStorage:', sanitizedCart);
          }
        }
      }
      
      // Load wishlist data
      if (!guestWishlistLoaded) {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist);
          
          if (Array.isArray(parsedWishlist) && parsedWishlist.length > 0) {
            // Set wishlist state
            setWishlist(parsedWishlist);
            console.log('Loaded wishlist from general localStorage:', parsedWishlist);
          }
        }
      }
    } catch (error) {
      console.error("Error loading cart/wishlist data:", error);
      localStorage.removeItem('cart_guest');
      localStorage.removeItem('wishlist_guest');
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
    }
  };

  // Save cart to localStorage with a proper key based on user state
  useEffect(() => {
    if (!cart) return;
    
    // Determine storage key based on login state
    const cartKey = user && user.id ? `cart_${user.id}` : 'cart_guest';
    
    if (cart.length > 0) {
      // Sanitize cart quantities
      const sanitizedCart = cart.map(item => ({
        ...item,
        quantity: Math.min(parseInt(item.quantity) || 1, 5) // Cap at 5 for safety
      }));
      
      // Save to both specific user key and general 'cart' key
      localStorage.setItem(cartKey, JSON.stringify(sanitizedCart));
      localStorage.setItem('cart', JSON.stringify(sanitizedCart));
      
      // If user is logged in, update backend but NOT the user object
      if (user && user.token) {
        // Update cart in backend only
        updateCartInBackend(sanitizedCart);
      }
    } else {
      // Empty cart - remove from localStorage
      localStorage.removeItem(cartKey);
      localStorage.removeItem('cart');
    }
  }, [cart, user]);

  // Save wishlist to localStorage with a proper key based on user state
  useEffect(() => {
    if (!wishlist) return;
    
    // Determine storage key based on login state
    const wishlistKey = user && user.id ? `wishlist_${user.id}` : 'wishlist_guest';
    
    if (wishlist.length > 0) {
      // Save to both specific user key and general 'wishlist' key
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      
      // If user is logged in, update backend but NOT the user object
      if (user && user.token) {
        // Update wishlist in backend only
        updateWishlistInBackend(wishlist);
      }
    } else {
      // Empty wishlist - remove from localStorage
      localStorage.removeItem(wishlistKey);
      localStorage.removeItem('wishlist');
    }
  }, [wishlist, user]);

  // Function to update cart in backend
  const updateCartInBackend = async (cartItems) => {
    if (!user || !user.token) return;
    
    try {
      // IMPORTANT: First clear the entire cart on the backend
      // This isn't implemented here since the backend doesn't support it
      // In a real app, you would have an endpoint like:
      // await fetch('http://localhost:3001/user/cart/clear', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${user.token}`
      //   }
      // });
      
      // If we had a real backend with cart clear functionality, 
      // we would clear the cart first, then add items one by one
      
      console.log("Updating backend cart with items:", cartItems);
      
      // Add each item to the cart
      for (const item of cartItems) {
        // Ensure the item has a valid quantity
        const sanitizedItem = {
          ...item,
          quantity: Math.min(parseInt(item.quantity) || 1, 5) // Safety cap
        };
        
        await fetch('http://localhost:3001/user/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            product: sanitizedItem
          })
        });
      }
      
      console.log("Successfully updated backend cart");
    } catch (error) {
      console.error('Error updating cart in backend:', error);
    }
  };

  // Function to update wishlist in backend
  const updateWishlistInBackend = async (wishlistItems) => {
    if (!user || !user.token) return;
    
    try {
      // IMPORTANT: First clear the entire wishlist on the backend
      // This isn't implemented here since the backend doesn't support it
      // In a real app, you would have an endpoint like:
      // await fetch('http://localhost:3001/user/wishlist/clear', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${user.token}`
      //   }
      // });
      
      // If we had a real backend with wishlist clear functionality, 
      // we would clear the wishlist first, then add items one by one
      
      console.log("Updating backend wishlist with items:", wishlistItems);
      
      // Add each item to the wishlist
      for (const item of wishlistItems) {
        await fetch('http://localhost:3001/user/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            product: item
          })
        });
      }
      
      console.log("Successfully updated backend wishlist");
    } catch (error) {
      console.error('Error updating wishlist in backend:', error);
    }
  };

  // Add item to cart
  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(
      item => 
        item.id === product.id && 
        item.selectedSize === product.selectedSize && 
        item.selectedColor === product.selectedColor
    );

    if (existingItemIndex !== -1) {
      // If item already exists, update quantity but cap it
      const updatedCart = [...cart];
      const updatedQuantity = updatedCart[existingItemIndex].quantity + (product.quantity || 1);
      // Enforce a cap of 5 items per product
      updatedCart[existingItemIndex].quantity = Math.min(updatedQuantity, 5);
      setCart(updatedCart);
    } else {
      // Add new item to cart with capped quantity
      const quantityToAdd = Math.min(product.quantity || 1, 5);
      setCart([...cart, { ...product, quantity: quantityToAdd }]);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = (item, newQuantity) => {
    // Ensure the quantity is a valid number and capped
    const sanitizedQuantity = Math.min(Math.max(1, parseInt(newQuantity) || 1), 5);
    
    const updatedCart = cart.map(cartItem => {
      if (
        cartItem.id === item.id && 
        cartItem.selectedSize === item.selectedSize && 
        cartItem.selectedColor === item.selectedColor
      ) {
        return { ...cartItem, quantity: sanitizedQuantity };
      }
      return cartItem;
    });
    setCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (item) => {
    const updatedCart = cart.filter(
      cartItem => 
        !(cartItem.id === item.id && 
          cartItem.selectedSize === item.selectedSize && 
          cartItem.selectedColor === item.selectedColor)
    );
    setCart(updatedCart);
  };

  // Add item to wishlist
  const addToWishlist = (product) => {
    const existingItemIndex = wishlist.findIndex(
      item => 
        item.id === product.id && 
        item.selectedSize === product.selectedSize && 
        item.selectedColor === product.selectedColor
    );

    if (existingItemIndex === -1) {
      // If item doesn't exist in wishlist, add it
      setWishlist([...wishlist, { ...product }]);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = (item) => {
    const updatedWishlist = wishlist.filter(
      wishlistItem => 
        !(wishlistItem.id === item.id && 
          wishlistItem.selectedSize === item.selectedSize && 
          wishlistItem.selectedColor === item.selectedColor)
    );
    setWishlist(updatedWishlist);
  };

  // Login user
  const login = async (userData) => {
    if (!userData) {
      console.error('Invalid user data provided to login function');
      return;
    }
    
    console.log("Starting login process with received data:", userData);
    
    // Save current cart and wishlist before login to prevent data loss
    const currentCart = [...cart];
    const currentWishlist = [...wishlist];
    
    // Create a user object with minimal data
    const cleanUserData = {
      id: userData.id || Math.floor(Math.random() * 1000), // Provide a random ID if none exists
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      name: userData.name || (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : 'User'),
      token: userData.token || 'dev_token_' + Date.now() // Create a dev token if none exists
    };
    
    console.log("Cleaned user data:", cleanUserData);
    
    // Set user state with clean data
    setUser(cleanUserData);
    
    // Save user to localStorage
    localStorage.setItem('user', JSON.stringify(cleanUserData));
    
    // Track if backend fetch was successful
    let backendFetchSuccessful = false;
    let dataLoaded = false;
    
    // First, try to load existing user-specific data from localStorage
    if (cleanUserData.id) {
      console.log(`Checking for saved data for user ${cleanUserData.id}`);
      
      // Try to load user cart
      const userCartData = localStorage.getItem(`cart_${cleanUserData.id}`);
      const userWishlistData = localStorage.getItem(`wishlist_${cleanUserData.id}`);
      
      if (userCartData || userWishlistData) {
        console.log(`Found saved data for user ${cleanUserData.id}`);
        
        let userCart = [];
        let userWishlist = [];
        
        // Process cart data
        if (userCartData) {
          try {
            const parsedCart = JSON.parse(userCartData);
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
              userCart = parsedCart;
              console.log(`Loaded existing cart for user ${cleanUserData.id}:`, userCart);
              // Set cart immediately
              setCart(userCart);
              dataLoaded = true;
            }
          } catch (error) {
            console.error(`Failed to parse existing cart for user ${cleanUserData.id}:`, error);
          }
        }
        
        // Process wishlist data
        if (userWishlistData) {
          try {
            const parsedWishlist = JSON.parse(userWishlistData);
            if (Array.isArray(parsedWishlist) && parsedWishlist.length > 0) {
              userWishlist = parsedWishlist;
              console.log(`Loaded existing wishlist for user ${cleanUserData.id}:`, userWishlist);
              // Set wishlist immediately
              setWishlist(userWishlist);
              dataLoaded = true;
            }
          } catch (error) {
            console.error(`Failed to parse existing wishlist for user ${cleanUserData.id}:`, error);
          }
        }
        
        // Update global localStorage for convenience
        if (userCart.length > 0) {
          localStorage.setItem('cart', JSON.stringify(userCart));
        }
        if (userWishlist.length > 0) {
          localStorage.setItem('wishlist', JSON.stringify(userWishlist));
        }
      }
    }
    
    // After local data check, attempt to fetch from backend if we have a token
    if (!dataLoaded && cleanUserData.token) {
      try {
        console.log("Attempting to fetch user data from backend...");
        await Promise.all([
          fetchUserCartFromBackend(cleanUserData.token),
          fetchUserWishlistFromBackend(cleanUserData.token)
        ]);
        backendFetchSuccessful = true;
        console.log("Successfully loaded data from backend");
      } catch (error) {
        console.error("Failed to fetch user data from backend:", error);
        backendFetchSuccessful = false;
      }
    }
    
    // If we couldn't load user data from localStorage or backend, merge current data
    if (!dataLoaded && !backendFetchSuccessful) {
      console.log("No saved user data found. Migrating current session data to user account.");
      
      let userCart = [];
      let userWishlist = [];
      
      // For cart: Use current cart
      if (currentCart.length > 0) {
        console.log("Using current cart for new user session:", currentCart);
        userCart = [...currentCart];
        
        // Set merged cart
        setCart(userCart);
        
        // Save to user-specific storage
        if (cleanUserData.id) {
          localStorage.setItem(`cart_${cleanUserData.id}`, JSON.stringify(userCart));
          localStorage.setItem('cart', JSON.stringify(userCart));
        }
      }
      
      // For wishlist: Use current wishlist
      if (currentWishlist.length > 0) {
        console.log("Using current wishlist for new user session:", currentWishlist);
        userWishlist = [...currentWishlist];
        
        // Set merged wishlist
        setWishlist(userWishlist);
        
        // Save to user-specific storage
        if (cleanUserData.id) {
          localStorage.setItem(`wishlist_${cleanUserData.id}`, JSON.stringify(userWishlist));
          localStorage.setItem('wishlist', JSON.stringify(userWishlist));
        }
      }
    }
    
    // Clear guest storage since the user is now logged in
    localStorage.removeItem('cart_guest');
    localStorage.removeItem('wishlist_guest');
    
    console.log("Login complete - User data loaded from best available source");
  };
  
  // Function to fetch user's cart from backend
  const fetchUserCartFromBackend = async (token) => {
    try {
      console.log("Attempting to fetch cart from backend with token:", token);
      
      // Get user ID from current user state
      const userId = user?.id;
      
      // Check if we're in development mode and use mock data if backend is unavailable
      if (process.env.NODE_ENV === 'development' && (!process.env.REACT_APP_USE_BACKEND || window.location.hostname === 'localhost')) {
        console.log("Using mock cart data for development");
        
        // Try to load from user-specific storage first
        if (userId) {
          const userCartData = localStorage.getItem(`cart_${userId}`);
          if (userCartData) {
            try {
              const parsedCart = JSON.parse(userCartData);
              if (Array.isArray(parsedCart)) {
                setCart(parsedCart);
                console.log(`Using saved cart for user ${userId}:`, parsedCart);
                return; // Exit early with user-specific data
              }
            } catch (e) {
              console.error(`Failed to parse user cart for user ${userId}:`, e);
            }
          }
        }
        
        // Otherwise try general localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              setCart(parsedCart);
              
              // If we have a userId, save to user-specific storage too
              if (userId) {
                localStorage.setItem(`cart_${userId}`, JSON.stringify(parsedCart));
              }
              
              console.log("Using saved cart from localStorage:", parsedCart);
              return; // Exit early with localStorage data
            }
          } catch (e) {
            console.error("Failed to parse localStorage cart:", e);
          }
        }
        return; // Exit if no localStorage data either
      }
      
      // If we're continuing, try the real API
      const response = await fetch('http://localhost:3001/user/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Check if response is ok (status 200-299)
      if (response.ok) {
        const cartData = await response.json();
        console.log("Raw response from cart API:", cartData);
        
        // Check different possible response formats
        if (cartData && Array.isArray(cartData)) {
          // If the response is directly an array
          const sanitizedCart = cartData.map(item => ({
            ...item,
            quantity: Math.min(parseInt(item.quantity) || 1, 5)
          }));
          
          setCart(sanitizedCart);
          
          // Save to both general and user-specific storage
          localStorage.setItem('cart', JSON.stringify(sanitizedCart));
          if (userId) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(sanitizedCart));
          }
          
          console.log('Successfully loaded user cart from backend (array format):', sanitizedCart);
        } 
        else if (cartData && cartData.cart && Array.isArray(cartData.cart)) {
          // If the response has a cart property that is an array
          const sanitizedCart = cartData.cart.map(item => ({
            ...item,
            quantity: Math.min(parseInt(item.quantity) || 1, 5)
          }));
          
          setCart(sanitizedCart);
          
          // Save to both general and user-specific storage
          localStorage.setItem('cart', JSON.stringify(sanitizedCart));
          if (userId) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(sanitizedCart));
          }
          
          console.log('Successfully loaded user cart from backend (object.cart format):', sanitizedCart);
        }
        else if (cartData && cartData.items && Array.isArray(cartData.items)) {
          // If the response has an items property that is an array
          const sanitizedCart = cartData.items.map(item => ({
            ...item,
            quantity: Math.min(parseInt(item.quantity) || 1, 5)
          }));
          
          setCart(sanitizedCart);
          
          // Save to both general and user-specific storage
          localStorage.setItem('cart', JSON.stringify(sanitizedCart));
          if (userId) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(sanitizedCart));
          }
          
          console.log('Successfully loaded user cart from backend (object.items format):', sanitizedCart);
        }
        else {
          console.warn('Unrecognized cart data format from backend:', cartData);
          
          // Try to load from user-specific storage as a fallback
          if (userId) {
            const userCartData = localStorage.getItem(`cart_${userId}`);
            if (userCartData) {
              try {
                const parsedCart = JSON.parse(userCartData);
                if (Array.isArray(parsedCart)) {
                  setCart(parsedCart);
                  console.log(`Fallback: Using saved cart for user ${userId}:`, parsedCart);
                  return;
                }
              } catch (e) {
                console.error(`Failed to parse user cart for user ${userId}:`, e);
              }
            }
          }
          
          // Fall back to general localStorage as a last resort
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              if (Array.isArray(parsedCart)) {
                setCart(parsedCart);
                console.log("Fallback: Using saved cart from localStorage:", parsedCart);
              }
            } catch (e) {
              console.error("Failed to parse localStorage cart:", e);
              setCart([]);
            }
          } else {
            setCart([]);
          }
        }
      } else {
        // Handle non-200 responses
        console.error('Error fetching cart from backend:', response.status, response.statusText);
        console.log('Falling back to localStorage cart data');
        
        // Try to load from user-specific storage first
        if (userId) {
          const userCartData = localStorage.getItem(`cart_${userId}`);
          if (userCartData) {
            try {
              const parsedCart = JSON.parse(userCartData);
              if (Array.isArray(parsedCart)) {
                setCart(parsedCart);
                console.log(`Using saved cart for user ${userId}:`, parsedCart);
                return;
              }
            } catch (e) {
              console.error(`Failed to parse user cart for user ${userId}:`, e);
            }
          }
        }
        
        // Try general localStorage if no user-specific data
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              setCart(parsedCart);
              console.log("Using saved cart from localStorage:", parsedCart);
            }
          } catch (e) {
            console.error("Failed to parse localStorage cart:", e);
            setCart([]);
          }
        } else {
          setCart([]);
        }
      }
    } catch (error) {
      console.error('Error fetching cart from backend:', error);
      console.log('Falling back to localStorage cart data');
      
      // Get user ID from current user state
      const userId = user?.id;
      
      // Try to load from user-specific storage first
      if (userId) {
        const userCartData = localStorage.getItem(`cart_${userId}`);
        if (userCartData) {
          try {
            const parsedCart = JSON.parse(userCartData);
            if (Array.isArray(parsedCart)) {
              setCart(parsedCart);
              console.log(`Using saved cart for user ${userId}:`, parsedCart);
              return;
            }
          } catch (e) {
            console.error(`Failed to parse user cart for user ${userId}:`, e);
          }
        }
      }
      
      // Try general localStorage if no user-specific data
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
            console.log("Using saved cart from localStorage:", parsedCart);
          }
        } catch (e) {
          console.error("Failed to parse localStorage cart:", e);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    }
  };
  
  // Function to fetch user's wishlist from backend
  const fetchUserWishlistFromBackend = async (token) => {
    try {
      console.log("Attempting to fetch wishlist from backend with token:", token);
      
      // Get user ID from current user state
      const userId = user?.id;
      
      // Check if we're in development mode and use mock data if backend is unavailable
      if (process.env.NODE_ENV === 'development' && (!process.env.REACT_APP_USE_BACKEND || window.location.hostname === 'localhost')) {
        console.log("Using mock wishlist data for development");
        
        // Try to load from user-specific storage first
        if (userId) {
          const userWishlistData = localStorage.getItem(`wishlist_${userId}`);
          if (userWishlistData) {
            try {
              const parsedWishlist = JSON.parse(userWishlistData);
              if (Array.isArray(parsedWishlist)) {
                setWishlist(parsedWishlist);
                console.log(`Using saved wishlist for user ${userId}:`, parsedWishlist);
                return; // Exit early with user-specific data
              }
            } catch (e) {
              console.error(`Failed to parse user wishlist for user ${userId}:`, e);
            }
          }
        }
        
        // Otherwise try general localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist);
            if (Array.isArray(parsedWishlist)) {
              setWishlist(parsedWishlist);
              
              // If we have a userId, save to user-specific storage too
              if (userId) {
                localStorage.setItem(`wishlist_${userId}`, JSON.stringify(parsedWishlist));
              }
              
              console.log("Using saved wishlist from localStorage:", parsedWishlist);
              return; // Exit early with localStorage data
            }
          } catch (e) {
            console.error("Failed to parse localStorage wishlist:", e);
          }
        }
        return; // Exit if no localStorage data either
      }
      
      // If we're continuing, try the real API
      const response = await fetch('http://localhost:3001/user/wishlist', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Check if response is ok (status 200-299)
      if (response.ok) {
        const wishlistData = await response.json();
        console.log("Raw response from wishlist API:", wishlistData);
        
        // Check different possible response formats
        if (wishlistData && Array.isArray(wishlistData)) {
          // If the response is directly an array
          setWishlist(wishlistData);
          
          // Save to both general and user-specific storage
          localStorage.setItem('wishlist', JSON.stringify(wishlistData));
          if (userId) {
            localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlistData));
          }
          
          console.log('Successfully loaded user wishlist from backend (array format):', wishlistData);
        } 
        else if (wishlistData && wishlistData.wishlist && Array.isArray(wishlistData.wishlist)) {
          // If the response has a wishlist property that is an array
          setWishlist(wishlistData.wishlist);
          
          // Save to both general and user-specific storage
          localStorage.setItem('wishlist', JSON.stringify(wishlistData.wishlist));
          if (userId) {
            localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlistData.wishlist));
          }
          
          console.log('Successfully loaded user wishlist from backend (object.wishlist format):', wishlistData.wishlist);
        }
        else if (wishlistData && wishlistData.items && Array.isArray(wishlistData.items)) {
          // If the response has an items property that is an array
          setWishlist(wishlistData.items);
          
          // Save to both general and user-specific storage
          localStorage.setItem('wishlist', JSON.stringify(wishlistData.items));
          if (userId) {
            localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlistData.items));
          }
          
          console.log('Successfully loaded user wishlist from backend (object.items format):', wishlistData.items);
        }
        else {
          console.warn('Unrecognized wishlist data format from backend:', wishlistData);
          
          // Try to load from user-specific storage as a fallback
          if (userId) {
            const userWishlistData = localStorage.getItem(`wishlist_${userId}`);
            if (userWishlistData) {
              try {
                const parsedWishlist = JSON.parse(userWishlistData);
                if (Array.isArray(parsedWishlist)) {
                  setWishlist(parsedWishlist);
                  console.log(`Fallback: Using saved wishlist for user ${userId}:`, parsedWishlist);
                  return;
                }
              } catch (e) {
                console.error(`Failed to parse user wishlist for user ${userId}:`, e);
              }
            }
          }
          
          // Fall back to general localStorage as a last resort
          const savedWishlist = localStorage.getItem('wishlist');
          if (savedWishlist) {
            try {
              const parsedWishlist = JSON.parse(savedWishlist);
              if (Array.isArray(parsedWishlist)) {
                setWishlist(parsedWishlist);
                console.log("Fallback: Using saved wishlist from localStorage:", parsedWishlist);
              }
            } catch (e) {
              console.error("Failed to parse localStorage wishlist:", e);
              setWishlist([]);
            }
          } else {
            setWishlist([]);
          }
        }
      } else {
        // Handle non-200 responses
        console.error('Error fetching wishlist from backend:', response.status, response.statusText);
        console.log('Falling back to localStorage wishlist data');
        
        // Try to load from user-specific storage first
        if (userId) {
          const userWishlistData = localStorage.getItem(`wishlist_${userId}`);
          if (userWishlistData) {
            try {
              const parsedWishlist = JSON.parse(userWishlistData);
              if (Array.isArray(parsedWishlist)) {
                setWishlist(parsedWishlist);
                console.log(`Using saved wishlist for user ${userId}:`, parsedWishlist);
                return;
              }
            } catch (e) {
              console.error(`Failed to parse user wishlist for user ${userId}:`, e);
            }
          }
        }
        
        // Try general localStorage if no user-specific data
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist);
            if (Array.isArray(parsedWishlist)) {
              setWishlist(parsedWishlist);
              console.log("Using saved wishlist from localStorage:", parsedWishlist);
            }
          } catch (e) {
            console.error("Failed to parse localStorage wishlist:", e);
            setWishlist([]);
          }
        } else {
          setWishlist([]);
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist from backend:', error);
      console.log('Falling back to localStorage wishlist data');
      
      // Get user ID from current user state
      const userId = user?.id;
      
      // Try to load from user-specific storage first
      if (userId) {
        const userWishlistData = localStorage.getItem(`wishlist_${userId}`);
        if (userWishlistData) {
          try {
            const parsedWishlist = JSON.parse(userWishlistData);
            if (Array.isArray(parsedWishlist)) {
              setWishlist(parsedWishlist);
              console.log(`Using saved wishlist for user ${userId}:`, parsedWishlist);
              return;
            }
          } catch (e) {
            console.error(`Failed to parse user wishlist for user ${userId}:`, e);
          }
        }
      }
      
      // Try general localStorage if no user-specific data
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          if (Array.isArray(parsedWishlist)) {
            setWishlist(parsedWishlist);
            console.log("Using saved wishlist from localStorage:", parsedWishlist);
          }
        } catch (e) {
          console.error("Failed to parse localStorage wishlist:", e);
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
  };

  // Register user
  const register = (userData) => {
    if (!userData) {
      console.error('Invalid user data provided to register function');
      return;
    }
    
    // Ensure correct data structure
    const formattedUserData = {
      ...userData,
      name: userData.name || (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : 'User')
    };
    
    setUser(formattedUserData);
    console.log('User registered with data:', formattedUserData);
  };

  // Logout user
  const logout = () => {
    if (user && user.id) {
      // Save current cart and wishlist to user-specific keys before logging out
      const userId = user.id;
      
      // Save cart if it's not empty
      if (cart && cart.length > 0) {
        console.log(`Saving cart for user ${userId} before logout:`, cart);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
      }
      
      // Save wishlist if it's not empty
      if (wishlist && wishlist.length > 0) {
        console.log(`Saving wishlist for user ${userId} before logout:`, wishlist);
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist));
      }
    }
    
    // Clear current user data but keep user-specific data in localStorage
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    localStorage.removeItem('cart_guest');
    localStorage.removeItem('wishlist_guest');
    localStorage.removeItem('user');
    
    // Clear states
    setCart([]);
    setWishlist([]);
    setUser(null);
    
    console.log("User logged out - current session cleared, but user data preserved for future logins");
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename="/Fashion-web">
        <div className="App">
          <Navbar 
            cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)} 
            wishlistItemCount={wishlist.length}
            user={user}
            logout={logout}
          />
          <main>
            <Routes>
              <Route path="/" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} />} />
              <Route path="/category/:categoryId" element={<Category addToCart={addToCart} addToWishlist={addToWishlist} />} />
              <Route path="/product/:productId" element={<ProductDetail addToCart={addToCart} addToWishlist={addToWishlist} />} />
              <Route 
                path="/cart" 
                element={
                  <Cart 
                    cart={cart} 
                    updateCartItemQuantity={updateCartItemQuantity} 
                    removeFromCart={removeFromCart}
                    moveToWishlist={addToWishlist}
                  />
                } 
              />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist 
                    wishlist={wishlist}
                    removeFromWishlist={removeFromWishlist}
                    moveToCart={addToCart}
                  />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login login={login} />} />
              <Route path="/register" element={<Register register={register} />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile 
                      user={user} 
                      logout={logout} 
                      cart={cart}
                      wishlist={wishlist}
                      removeFromCart={removeFromCart}
                      removeFromWishlist={removeFromWishlist}
                    />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
