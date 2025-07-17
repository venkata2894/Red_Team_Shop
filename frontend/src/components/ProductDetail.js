import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  TextField,
  Alert,
  Divider,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Star as StarIcon,
  Upload as UploadIcon,
  Lightbulb as TipIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const [tipDialogOpen, setTipDialogOpen] = useState(false);
  const [productTip, setProductTip] = useState('');
  const [tipFile, setTipFile] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/reviews/${id}/`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        'http://localhost:8000/api/cart/',
        { product_id: id, quantity: quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Show success message
      setError('');
      alert(`Added ${quantity} ${product.name} to cart!`);
      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add to cart');
    }
  };

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        'http://localhost:8000/api/reviews/',
        {
          product: id,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setNewReview({ rating: 5, comment: '' });
      fetchReviews(); // Refresh reviews
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    }
  };

  const handleSubmitTip = async () => {
    if (!productTip.trim() && !tipFile) {
      setError('Please provide either a tip text or upload a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('product_id', id);
      
      if (productTip.trim()) {
        formData.append('tip', productTip);
      }
      
      if (tipFile) {
        formData.append('tip_file', tipFile);
      }

      const token = localStorage.getItem('token');
      const headers = {};
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post('http://localhost:8000/api/tips/', formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        setSuccess('Tip submitted successfully! It will be used to enhance our product knowledge base.');
        setProductTip('');
        setTipFile(null);
        setTipDialogOpen(false);
      }
    } catch (error) {
      console.error('Error submitting tip:', error);
      setError('Failed to submit tip. Please try again.');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading product...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={product.image_url}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.average_rating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.review_count} reviews)
            </Typography>
          </Box>
          
          <Typography variant="h4" color="primary" gutterBottom>
            ${product.price}
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          
          {/* Quantity Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <IconButton
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2, minWidth: '30px', textAlign: 'center' }}>
              {quantity}
            </Typography>
            <IconButton
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
            >
              <AddIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleAddToCart}
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<TipIcon />}
              onClick={() => setTipDialogOpen(true)}
            >
              Share Tip
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Add Review */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Write a Review
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview({ ...newReview, rating: newValue });
              }}
            />
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your review"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={!newReview.comment.trim()}
          >
            Submit Review
          </Button>
        </Paper>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <Stack spacing={2}>
            {reviews.map((review) => (
              <Paper key={review.id} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>
                    {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.user_name || 'Anonymous'}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {review.comment}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No reviews yet. Be the first to review this product!
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Product Tip Upload Dialog */}
      <Dialog open={tipDialogOpen} onClose={() => setTipDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TipIcon sx={{ mr: 1 }} />
            Share a Product Tip
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share your tips, tricks, or insights about this product. Your tips will help other customers!
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your tip"
            value={productTip}
            onChange={(e) => setProductTip(e.target.value)}
            placeholder="Share your experience, tips, or recommendations..."
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={(e) => setTipFile(e.target.files[0])}
            style={{ marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTipDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitTip}
            disabled={!productTip.trim() && !tipFile}
          >
            Submit Tip
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetail; 