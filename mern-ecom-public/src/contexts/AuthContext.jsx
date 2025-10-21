import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user profile
      axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${API_BASE_URL}/users/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data.user);
    return res.data;
  };

  const changePassword = async (passwordData) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${API_BASE_URL}/users/change-password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};