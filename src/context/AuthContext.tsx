
import React, { createContext, useContext, useState, useEffect } from 'react';

// This is a mock implementation as a fallback when Crossmint's useAuth is not available
interface User {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: false
});

// Custom hook that shims the Crossmint useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check local storage for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mockAuthUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mockAuthUser');
      }
    }
  }, []);

  const login = async () => {
    setIsLoading(true);
    try {
      // Simulate login
      const mockUser = { id: 'mock-user-id', email: 'user@example.com' };
      setUser(mockUser);
      localStorage.setItem('mockAuthUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Simulate logout
      setUser(null);
      localStorage.removeItem('mockAuthUser');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
