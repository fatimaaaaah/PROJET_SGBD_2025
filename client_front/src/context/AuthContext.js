import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Import nommé


const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const decoded = jwtDecode(storedToken); // 🟣 Décodage
      const enrichedUser = {
        ...JSON.parse(storedUser),
        id: decoded.id, // ou decoded._id selon le format de ton token
        role: decoded.role // optionnel
      };

      setToken(storedToken);
      setUser(enrichedUser);
    }
  }, []);

  const login = (userData, token) => {
    const decoded = jwtDecode(token); // 🟣 Décodage du token à la connexion

    const formattedUser = {
      ...userData,
      firstName: userData.firstName || userData.given_name || '',
      lastName: userData.lastName || userData.family_name || '',
      email: userData.email || '',
      avatar: userData.picture || userData.avatar_url || '',
      id: decoded.id, // 🟣 Ajouté
      role: decoded.role // 🟣 Optionnel : si tu veux utiliser le rôle
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(formattedUser));
    setUser(formattedUser);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
