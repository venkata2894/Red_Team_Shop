import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import OrderHistory from './components/OrderHistory';
import SearchResults from './components/SearchResults';
import ProtectedRoute from './components/ProtectedRoute';
import AttacksPage from './components/AttacksPage';
import ChatBot from './components/ChatBot';
import { SearchProvider } from './contexts/SearchContext';
import { ChatProvider } from './contexts/ChatContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SearchProvider>
          <ChatProvider>
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchResults />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                } />
                <Route path="/attacks" element={<AttacksPage />} />
              </Routes>
              
              {/* Floating Chat Bot - appears on all pages when logged in */}
              <ChatBot />
            </div>
          </ChatProvider>
        </SearchProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
