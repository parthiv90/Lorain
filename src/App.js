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
import Profile from './pages/Profile';
import About from './pages/About';

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
  // State for user
  const [user, setUser] = useState(null);
  // State for loading authentication status
  const [authLoading, setAuthLoading] = useState(true);

  // Check if token is valid by making a request to the server
  const checkTokenValidity = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/auth/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Token is valid, get user data
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // In case of error, clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // Load cart and check authentication on initial render
  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Check for authentication token and load user data
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      // If we have both token and user data, set user state
      setUser(JSON.parse(savedUser));
      // But still verify the token with server to ensure it's valid
      checkTokenValidity();
    } else {
      // No valid authentication data
      setAuthLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Add item to cart
  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(
      item => 
        item.id === product.id && 
        item.selectedSize === product.selectedSize && 
        item.selectedColor === product.selectedColor
    );

    if (existingItemIndex !== -1) {
      // If item already exists, update quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += product.quantity || 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, quantity: product.quantity || 1 }]);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = (item, newQuantity) => {
    const updatedCart = cart.map(cartItem => {
      if (
        cartItem.id === item.id && 
        cartItem.selectedSize === item.selectedSize && 
        cartItem.selectedColor === item.selectedColor
      ) {
        return { ...cartItem, quantity: newQuantity };
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

  // Login user
  const login = (userData) => {
    // Store user data in state and localStorage
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // If there's a token in userData, store it in localStorage
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  // Register user
  const register = (userData) => {
    // For registration, we typically just redirect to login
    // The actual registration is handled by the Register component
    // But we can also set user state if the API returns user data
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // If there's a token in userData, store it in localStorage
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
    }
  };

  // Logout user
  const logout = () => {
    // Clear user state and remove from localStorage
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
      <Router>
        <div className="App">
          <Navbar 
            cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)} 
            user={user}
            logout={logout}
          />
          <main>
            <Routes>
              <Route path="/" element={<Home addToCart={addToCart} />} />
              <Route path="/category/:categoryId" element={<Category addToCart={addToCart} />} />
              <Route path="/product/:productId" element={<ProductDetail addToCart={addToCart} />} />
              <Route 
                path="/cart" 
                element={
                  <Cart 
                    cart={cart} 
                    updateCartItemQuantity={updateCartItemQuantity} 
                    removeFromCart={removeFromCart} 
                  />
                } 
              />
              <Route path="/login" element={<Login login={login} />} />
              <Route path="/register" element={<Register register={register} />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile user={user} logout={logout} />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
