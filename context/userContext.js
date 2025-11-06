// src/context/AuthContext.js
"use client"
import api from '@/lib/api';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// 1. Define the initial state and context structure
const AuthContext = createContext({
  user: null, // Holds user profile data
  isAuthenticated: false, // Simple flag
  loading: true, // Indicates if initial load/check is complete
  login: (token) => {}, // Function to set tokens and state
  logout: () => {}, // Function to clear tokens and state
  fetchUser: () => {}, // Function to fetch user data after successful login/refresh
});

// 2. Create the Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to get the user data after authentication
  const fetchUser = useCallback(async () => {
    try {
      // Assuming you have an endpoint to fetch the logged-in user's profile
      const response = await api.get('/profile'); 
      console.log(response)
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Clear tokens and state if fetching user fails
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
      // NOTE: Your axios interceptor handles redirecting to /login on 401
    } finally {
      setLoading(false);
    }
  }, []);


  // --- Authentication Handlers ---

  const login = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    fetchUser();
    // Redirect logic can be added here if needed
  };

  const logout = () => {
    // 1. Clear state
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);

    // 2. Clear tokens
    localStorage.removeItem('accessToken');
    
    // 3. Inform the backend to clear the HttpOnly refresh token cookie
    // You'll need a logout endpoint for this
    api.post('/logout') 
      .catch(err => console.error("Logout request failed:", err));

    // 4. Redirect to login page
    window.location.href = '/login'; 
  };
  
  // --- Initial Load Effect ---

  useEffect(() => {
    // On app load, check if an access token exists and fetch user data
    if (localStorage.getItem('accessToken')) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  // 3. Provide the context value
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    fetchUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook for easy consumption
export const useAuth = () => useContext(AuthContext);