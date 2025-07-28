import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './view/pages/Admin/AdminLayout';
import { AppDispatch, RootState } from './store/store';
import { fetchUserProfile } from './slices/authSlice';
import { isAuthenticated, getUserRole } from './auth/auth';

// Layout Components
import DefaultLayout from './view/common/DefaultLayout';

// Page Components
import Home from './view/pages/Home';
import About from './view/pages/About';
import Contact from './view/pages/Contact';
import Login from './view/pages/Login';
import Register from './view/pages/Register';
import Products from './view/pages/Products';
import ProductDetail from './view/pages/ProductDetail';
import Checkout from './view/pages/Checkout';
import Orders from './view/pages/Orders';
import Profile from './view/pages/Profile';
import Wishlist from './view/pages/Wishlist';
import AdminDashboard from './view/pages/Admin/Dashboard';

import Cart from './view/pages/Cart';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if already authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  if (isAuth) {
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated: isAuth } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if user is authenticated and fetch profile
    if (isAuthenticated() && !isAuth) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuth]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Routes with Default Layout */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            
            {/* Public Product Routes */}
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetail />} />
            
            {/* Checkout Route */}
            <Route path="checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            
            {/* Wishlist Route */}
            <Route path="wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />
            
            
            {/* Protected Routes */}
            <Route path="cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<div className="p-8 text-center">Products Management - Coming Soon</div>} />
            <Route path="orders" element={<div className="p-8 text-center">Orders Management - Coming Soon</div>} />
            <Route path="users" element={<div className="p-8 text-center">Users Management - Coming Soon</div>} />
            <Route path="categories" element={<div className="p-8 text-center">Categories Management - Coming Soon</div>} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;