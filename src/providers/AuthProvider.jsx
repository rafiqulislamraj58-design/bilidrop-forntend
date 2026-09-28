import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get('/auth/me'); 
      if (res.data?.success || res.data?.user) {
        setUser(res.data.user || res.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const registerUser = async (name, email, password, role = 'user', photo = '') => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password, role, photo });
      setUser(res.data.user || res.data.data);
      toast.success('Registration successful!');
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      setUser(res.data.user || res.data.data);
      toast.success('Welcome back!');
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid email or password';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};