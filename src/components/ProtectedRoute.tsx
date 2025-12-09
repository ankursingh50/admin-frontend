import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  // Check for the authentication token in localStorage
  const isAuthenticated = localStorage.getItem('auth') === 'true';

  // If authenticated, render the nested routes (Outlet).
  // Otherwise, redirect the user to the /login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;