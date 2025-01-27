import axiosInstance from '../utils/axiosInstance';
import type {
  RegisterCredentials,
  ApiResponse,
  LoginCredentials,
  GetUserResponse,
} from '../types/global';

// register user
export const registerUser = async (credentials: RegisterCredentials): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/api/v1/users/register', {
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  });
  console.log(response);
  return response.data;
};

// login user
export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/api/v1/users/login', {
    email: credentials.email,
    password: credentials.password,
  });
  console.log(response);
  return response.data;
};

// getting current user
export const getCurrentUser = async (): Promise<GetUserResponse> => {
  const response = await axiosInstance.get('/api/v1/users/user-details');
  return response.data;
};

// checking if user is logged in
export const isAuthenticated = async (): Promise<ApiResponse> => {
  const response = await axiosInstance.get('/api/v1/users/is-auth');
  return response.data;
};

// logout user
export const logoutUser = async (): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/api/v1/users/logout');
  return response.data;
};
