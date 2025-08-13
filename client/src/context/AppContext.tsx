import type { FC, ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import type { AppContextType, UserDataType } from '../types/global';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/auth.api';

// Create the application context with an initial value of undefined
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Define props for the AppContextProvider component
interface AppContextProviderProps {
  children: ReactNode; // Any valid React children (components, elements, etc.)
}

// AppContextProvider component: wraps the application and provides global state
export const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
  // Read the backend API URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Throw an error if the backend URL is missing — prevents silent failures
  if (!backendUrl) {
    throw new Error('VITE_BACKEND_URL is not defined in environment variables');
  }

  // State to track whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State to store the currently logged-in user's data
  const [userData, setUserData] = useState<UserDataType | null>(null);

  const { data, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    if (data) {
      setUserData(data.userData);
      setIsLoggedIn(true);
    }
  }, [data]);

  // Bundle all the values and updater functions into a single object
  const value: AppContextType = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    refetchCurrentUser: refetch,
  };

  // Provide the context value to all child components
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
