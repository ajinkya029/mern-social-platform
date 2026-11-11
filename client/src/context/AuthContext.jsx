import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem('social_token')) api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => localStorage.removeItem('social_token')).finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  const authenticate = data => { localStorage.setItem('social_token', data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem('social_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, loading, authenticate, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
