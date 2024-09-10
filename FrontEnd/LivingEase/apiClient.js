import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:5000/api',
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add the token to every request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        
        config.headers['Authorization'] = `Bearer ${token}`;
      } 
      return config;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request:', error.response.data);
      // You could also log the user out here or take other actions
    } else {
      console.error('API error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

const signUp = async (data) => {
  console.log(`Request URL: ${apiClient.defaults.baseURL}/auth/register`);
  try {
    const response = await apiClient.post('/auth/register', data);
    // Handle response or return data
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Optionally rethrow error to handle it where the function is called
  }
};

export default apiClient;