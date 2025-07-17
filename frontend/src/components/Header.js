import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';
import axios from 'axios';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { searchBarQuery, setSearchBarQuery } = useSearch();

  // Check authentication status on every render
  const isLoggedIn = !!localStorage.getItem('token');

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:8000/api/cart/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartCount(response.data.items?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleLogout = () => {
    // Clear chat history for all users
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('chat_history_')) {
        localStorage.removeItem(key);
      }
    });
    
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchBarQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchBarQuery.trim())}`);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side: Logo and Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer', mr: 2 }}
            onClick={() => navigate('/')}
          >
            Red Team Shop
          </Typography>
          
          {isLoggedIn && (
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                minWidth: 300,
              }}
            >
              <TextField
                size="small"
                placeholder="Search products..."
                value={searchBarQuery}
                onChange={(e) => setSearchBarQuery(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1,
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        size="small"
                        sx={{ color: 'white' }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </Box>

        {/* Right side: Navigation buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isLoggedIn ? (
            <>
              <IconButton
                color="inherit"
                onClick={() => navigate('/cart')}
                sx={{ color: 'white' }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>
              
              <IconButton
                color="inherit"
                onClick={() => navigate('/orders')}
                sx={{ color: 'white' }}
              >
                <PersonIcon />
              </IconButton>
              
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ color: 'white' }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ color: 'white' }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 