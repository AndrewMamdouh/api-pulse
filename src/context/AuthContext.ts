import { AxiosResponse } from 'axios';
import { createContext } from 'react';

interface AuthContextData {
  isAuthenticated: boolean | null;
  /**
   * checkAuthenticity Function Type
   */
  checkAuthenticity: () => Promise<AxiosResponse<string> | null>;
  /**
   * resetAuthenticity Function Type
   */
  resetAuthenticity: () => void;
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: null,
  /**
   * checkAuthenticity Function Type
   */
  checkAuthenticity: () => new Promise(() => null),
  /**
   * resetAuthenticity Function Type
   */
  resetAuthenticity: () => {},
});

export default AuthContext;
