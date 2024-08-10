// auth.js
import { apiClient } from './apiClient';
const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const loginUser = async (userData) => {
  console.log('Login user data:', userData);
  try {
    console.log('Sending request to /auth/login');
    const response = await apiClient.post('/auth/login', userData);
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

export { registerUser, loginUser };