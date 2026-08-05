import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { AuthContext } from './auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ems_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [booting, setBooting] = useState(() => Boolean(localStorage.getItem('ems_token')));

  useEffect(() => {
    const token = localStorage.getItem('ems_token');
    if (!token) return;

    apiRequest('/auth/me')
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem('ems_user', JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem('ems_token');
        localStorage.removeItem('ems_user');
        setUser(null);
      })
      .finally(() => setBooting(false));
  }, []);

  const login = async ({ email, password, role }) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    localStorage.setItem('ems_token', data.token);
    localStorage.setItem('ems_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    localStorage.setItem('ems_token', data.token);
    localStorage.setItem('ems_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem('ems_user', JSON.stringify(nextUser));
  };

  const logout = () => {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, booting, login, signup, logout, updateUser }}>{children}</AuthContext.Provider>;
};
