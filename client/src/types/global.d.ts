export type PasswordChecks = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
};

export interface UserDataType {
  name: string;
  email: string;
  isVerified: boolean;
}

export interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserDataType | null;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
  isLoading: boolean;
  checkAuthAndFetchUser: () => void;
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

export interface GetUserResponse extends ApiResponse {
  userData: UserDataType | null;
}

export interface ApiError {
  message: string;
  success: boolean;
  response?: {
    data?: {
      message?: string;
    };
  };
}
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
