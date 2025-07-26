import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
          
          {/* Routes with Default Layout */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            
            {/* Protected Routes */}
            <Route path="products" element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-4">Products Page</h1>
                    <p className="text-secondary-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="cart" element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-4">Shopping Cart</h1>
                    <p className="text-secondary-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="profile" element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-4">Profile</h1>
                    <p className="text-secondary-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="orders" element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-4">My Orders</h1>
                    <p className="text-secondary-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-4">Admin Panel</h1>
                    <p className="text-secondary-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-secondary-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-secondary-900 mb-4">404</h1>
                <p className="text-xl text-secondary-600 mb-8">Page not found</p>
                <a href="/" className="btn-primary">
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