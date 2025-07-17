import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For demo purposes, we'll use a simple token-based approach
      // In a real app, you'd use Django's built-in authentication
      const response = await axios.post('http://localhost:8000/api/auth/login/', formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (error) {
      setError('Invalid credentials. Try: alice/password123, bob/password123, or charlie/password123');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (username) => {
    // For demo purposes, create a simple token
    // Backend expects format: demo_token_username_userid
    // We'll use a simple mapping for demo users
    const userIds = {
      'alice': 1,
      'bob': 2,
      'charlie': 3
    };
    const userId = userIds[username] || 1;
    const token = `demo_token_${username}_${userId}`;
    localStorage.setItem('token', token);
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
        
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Demo Accounts:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDemoLogin('alice')}
          >
            Alice
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDemoLogin('bob')}
          >
            Bob
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDemoLogin('charlie')}
          >
            Charlie
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 