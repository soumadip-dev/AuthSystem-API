import { createContext, FC, ReactNode, useState } from 'react';

// Define the type of the context value
interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
}

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

//  Define props for the provider
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URl;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
