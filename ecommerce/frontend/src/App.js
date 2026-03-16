import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common
import Navbar from './components/common/Navbar';
import Notification from './components/common/Notification';

// User pages
import HomePage from './pages/user/HomePage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import ProductsPage from './pages/user/ProductsPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import OrderPage from './pages/user/OrderPage';
import MyOrdersPage from './pages/user/MyOrdersPage';
import OrderSuccessPage from './pages/user/OrderSuccessPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminProducts from './pages/admin/AdminProducts';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  return user?.role === 'admin' ? children : <Navigate to="/admin/login" />;
};

function AppContent() {
  const { notification } = useAuth();
  return (
    <>
      <Navbar />
      {notification && <Notification message={notification.msg} type={notification.type} />}
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/edit-product/:id" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
