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

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
