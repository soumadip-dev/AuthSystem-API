import type { createContext, FC, ReactNode} from 'react';

// Define the type of the context value
interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserDataType | null; // Replace with actual user type
  setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
}

// Define the type for user data
interface UserDataType {
  name: string;
  email: string;
  isVerified: boolean;
}

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
