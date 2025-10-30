import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import DocumentWorkspace from './components/Workspace/DocumentWorkspace';
import DemoWorkspace from './components/Demo/DemoWorkspace';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    // Set theme attribute on document root
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Dashboard - requires authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* DEMO: Workspace with sample data - no authentication needed */}
          <Route path="/demo" element={<DemoWorkspace />} />
          <Route
            path="/workspace/:documentId"
            element={
              <ProtectedRoute>
                <DocumentWorkspace />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
