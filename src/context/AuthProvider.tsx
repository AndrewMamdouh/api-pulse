import { useState, ReactNode } from 'react';
import { checkAuth } from '../api/getServices';
import AuthContext from './AuthContext';
import { useLocalStorage } from '../hooks';

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * AuthProvider Component
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { getItem, removeItem } = useLocalStorage();

  /**
   * Check If User Credentials Are Valid
   */
  const checkAuthenticity = async () => {
    const res = await checkAuth();
    if (res?.status === 200 && getItem('Team_Name') && getItem('ENV_Name'))
      setIsAuthenticated(true);
    else setIsAuthenticated(false);
    return res;
  };

  /**
   * Reset Auth
   */
  const resetAuthenticity = () => {
    setIsAuthenticated(false);
    removeItem('API_Key');
    removeItem('Partner_ID');
    removeItem('Team_Name');
    removeItem('ENV_Name');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, checkAuthenticity, resetAuthenticity }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
