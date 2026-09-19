import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const profile = await api.getProfile();
        if (profile) setUser(profile);
      } catch (err) {
        console.warn('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const loggedUser = await api.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (name, email, password) => {
    const newUser = await api.register(name, email, password);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
