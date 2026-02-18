import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApiProvider, useApi } from './context/ApiContext';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';

const PrivateRoute = ({ children }) => {
  const { token, user } = useApi();
  // Check token existence
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <ApiProvider>
        <AppRoutes />
      </ApiProvider>
    </Router>
  );
};

export default App;
