import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:5000/api',
});

// Request interceptor to add the token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
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
