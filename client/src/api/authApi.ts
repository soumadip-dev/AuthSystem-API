//* Import axiosInstance
import axiosInstance from '../utils/axiosInstance';

//* Import types
import type {
  RegisterCredentials,
  ApiResponse,
  LoginCredentials,
  GetUserResponse,
} from '../types/global';

//* Import axios
import axios from 'axios';

//* register user
export const registerUser = async (credentials: RegisterCredentials): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/api/v1/users/register', {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as ApiResponse;
    }
    return {
      success: false,
      message: 'Network error occurred',
    };
  }
};

//* login user
export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/api/v1/users/login', {
    email: credentials.email,
    password: credentials.password,
  });
  console.log(response);
  return response.data;
};

//* getting current user
export const getCurrentUser = async (): Promise<GetUserResponse> => {
  const response = await axiosInstance.get('/api/v1/users/user-details');
  return response.data;
};

//* checking if user is logged in
export const isAuthenticated = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get('/api/v1/users/is-auth');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return { success: false, message: 'Not authenticated' };
    }
    throw error; // Re-throw other errors
  }
};

//* logout user
export const logoutUser = async (): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/api/v1/users/logout');
  return response.data;
};

//* send verification email
export const sendVerificationEmail = async (): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/api/v1/users/send-verification-email');
  return response.data;
};

//* verify user with otp
export const verifyUser = async (otp: string): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/api/v1/users/verify-user', { otp });
  return response.data;
};

//* Send password reset email
export const sendPasswordResetEmail = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/api/v1/users/send-pass-reset-email', {
      email,
    });
    return response.data;
  } catch (error: unknown) {
    // If the server responded with an error message, return it
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as ApiResponse;
    }
    // Otherwise return a generic error
    return {
      success: false,
      message: 'Network error occurred',
    };
  }
};

//* Reset password with otp
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/api/v1/users/reset-password', {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error: unknown) {
    // If the server responded with an error message, return it
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as ApiResponse;
    }
    // Otherwise return a generic error
    return {
      success: false,
      message: 'Network error occurred',
    };
  }
};
