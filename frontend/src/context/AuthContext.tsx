import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => false,
    logout: () => {},
});


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const login = async (username: string, password: string) => {
      // Implement actual authentication logic here
      // This is a mock implementation
      if (username === 'admin' && password === 'admin123') {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    };
  
    const logout = () => {
      setIsAuthenticated(false);
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);