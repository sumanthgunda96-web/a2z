import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import StoreShell from './layouts/StoreShell';
import PlatformHome from './pages/PlatformHome';
import ErrorBoundary from './components/ErrorBoundary';

// Pages & Components imports
import Home from './pages/Home';
import BuyerLogin from './pages/BuyerLogin';
import BuyerRegister from './pages/BuyerRegister';
import ForgotPassword from './pages/ForgotPassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Products from './components/Products';
import About from './components/About';
import Contact from './components/Contact';
import CreateStore from './pages/CreateStore';
import SellerRegister from './pages/SellerRegister';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SellerLogin from './pages/SellerLogin';
import TestSheets from './pages/TestSheets';

// Admin imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminContent from './pages/admin/AdminContent';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* ... routes ... */}
            {/* Platform Landing */}
            {/* Platform Landing */}
            <Route path="/" element={<PlatformHome />} />

            {/* Seller Auth Routes */}
            <Route path="/a2z/seller/login" element={<SellerLogin />} />
            <Route path="/a2z/seller/create-account" element={<SellerRegister />} />

            {/* SUPER ADMIN ROUTE */}
            <Route path="/a2z/super-admin" element={<SuperAdminDashboard />} />

            {/* Buyer Auth Routes */}
            <Route path="/a2z/buyer/login" element={<BuyerLogin />} />
            <Route path="/a2z/buyer/register" element={<BuyerRegister />} />

            <Route path="/a2z/forgot-password" element={<Navigate to="/a2z/buyer/forgot-password" replace />} />
            <Route path="/a2z/buyer/forgot-password" element={<ForgotPassword role="buyer" />} />
            <Route path="/a2z/seller/forgot-password" element={<ForgotPassword role="seller" />} />
            <Route path="/a2z/super-admin/forgot-password" element={<ForgotPassword role="admin" />} />

            {/* Business/Store Routes */}
            {/* We wrap everything in BusinessProvider so the slug is available */}
            <Route path="/a2z/:businessSlug" element={
              <BusinessProvider>
                <StoreShell />
              </BusinessProvider>
            }>
              <Route index element={<Home />} />

              {/* Auth Routes within Store Context */}
              <Route path="login" element={<BuyerLogin />} />
              <Route path="register" element={<BuyerRegister />} />
              <Route path="forgot-password" element={<ForgotPassword />} />

              {/* Store Functionality */}
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="order-tracking/:orderId" element={<OrderTracking />} />
              <Route path="my-orders" element={<MyOrders />} />
              <Route path="profile" element={<Profile />} />
              <Route path="products" element={<Products />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="test-sheets" element={<TestSheets />} />

              {/* Store Admin Routes */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="content" element={<AdminContent />} />
              </Route>

              {/* Catch all for store 404s? or just redirect to store home */}
              <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Fallback for global 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
