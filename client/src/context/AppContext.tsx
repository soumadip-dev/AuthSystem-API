import type { FC, ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import type { AppContextType, UserDataType } from '../types/global';
import { getCurrentUser, isAuthenticated } from '../api/authApi';

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  if (!backendUrl) {
    throw new Error('VITE_BACKEND_URL is not defined in environment variables');
  }

  // Check authentication status and fetch user data
  const checkAuthAndFetchUser = async () => {
    try {
      setIsLoading(true);
      const authResponse = await isAuthenticated();

      if (authResponse.success) {
        try {
          const userResponse = await getCurrentUser();
          setUserData(userResponse.userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setIsLoggedIn(false);
          setUserData(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state when component mounts
  useEffect(() => {
    checkAuthAndFetchUser();
  }, []);

  const value: AppContextType = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    isLoading,
    checkAuthAndFetchUser, // Expose this function to components
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
