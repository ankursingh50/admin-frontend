import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

// ✅ Import your ThemeContext provider
import { ThemeProvider } from './contexts/ThemeContext';

// ✅ Import components
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import ThemeSettings from './pages/ThemeSettings';

// ✅ Import layout and route guards
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="customer/:iqamaId" element={<CustomerDetailsPage />} />
              <Route path="theme-settings" element={<ThemeSettings />} />

              {/* Placeholder routes */}
              <Route path="account-dashboard" element={<div>Account Dashboard Page</div>} />
              <Route path="iqama-db" element={<div>Iqama DB Page</div>} />
              <Route path="absher-db" element={<div>Absher DB Page</div>} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
