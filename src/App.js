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

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
    setUser(userData);
  };

  // Register user
  const register = (userData) => {
    setUser(userData);
  };

  // Logout user
  const logout = () => {
    setUser(null);
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
