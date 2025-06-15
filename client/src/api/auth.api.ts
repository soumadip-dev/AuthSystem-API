import axiosInstance from '../utils/axiosInstance';
import type { RegisterCredentials, RegisterResponse, LoginCredentials } from '../types/global';

// Mutation for register user
export const registerUser = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const response = await axiosInstance.post('/api/v1/users/register', {
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  });
  console.log(response);
  return response.data;
};

// Mutation for login user
export const loginUser = async (credentials: LoginCredentials): Promise<RegisterResponse> => {
  const response = await axiosInstance.post('/api/v1/users/login', {
    email: credentials.email,
    password: credentials.password,
  });
  console.log(response);
  return response.data;
};
