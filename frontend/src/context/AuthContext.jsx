import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Mock user data to bypass backend
        setUser({ id: 'dummy-123', email: 'testuser@ragyai.com', name: 'Test User', role: 'ADMIN' });
      }
      setLoading(false);
    };
    
    fetchMe();
    
  }, []);

  const login = async (email, password) => {
    // Mock login to bypass backend completely
    const dummyUser = { id: 'dummy-123', email, name: 'Test User', role: 'ADMIN' };
    localStorage.setItem('token', 'dummy-token-123');
    setUser(dummyUser);
    return dummyUser;
  };

  const register = async (name, email, password) => {
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    await fetch('http://localhost:3001/api/auth/logout', { method: 'POST' });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
