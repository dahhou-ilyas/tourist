import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Nav from '../component/Nav';
import HomePage from '../page/HomePage';
import LoginPage from '../page/LoginPage';
import NotFoundPage from '../page/NotFoundPage';
import AdminDashboard from '../page/AdminDashboard';

import { AuthProvider, useAuth } from '../context/AuthContext';




const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Nav />
          <div className="flex-grow mt-16"> {/* Add top margin to account for fixed navbar */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Admin Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard/>
                  </ProtectedRoute>
                } 
              />

              {/* 404 Not Found Route */}
              <Route path="*" element={<NotFoundPage/>} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;