import { createContext, useContext, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }, []);


  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(user);
    try {
      const decoded = jwtDecode(token);
      const formattedUser = {
        id: decoded.sub || userData.id,
        firstName: userData.given_name || decoded.given_name || userData.firstName || '',
        lastName: userData.family_name || decoded.family_name || userData.lastName || '',
        email: decoded.email || userData.email,
        avatar: userData.picture || userData.avatar,
        role: decoded.role || 'user'
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      setUser(formattedUser);
      setToken(token);
    } catch (error) {
      console.error("Login error:", error);
      logout();
    }
  };

  const isAuthenticated = useCallback(() => !!token, [token]);

  return (
    <AuthContext.Provider value={{ 
      user,
      token,
      login,
      logout,
      isAuthenticated // Maintenant exposée comme fonction
    }}>
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