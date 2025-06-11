import type { FC, ReactNode } from 'react';
import { createContext, useState } from 'react';
import type { AppContextType, UserDataType } from '../types/global';

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

//  Define props for the provider
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string; // Ensure this is set
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserDataType | null>(null);

  const value: AppContextType = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
