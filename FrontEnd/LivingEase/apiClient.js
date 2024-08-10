import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:5000/api',
});

apiClient.defaults.debug = true; // enable debugging

const signUp = async data => {
  console.log(`Request URL: ${apiClient.defaults.baseURL}/auth/register`);
  try {
    const response = await apiClient.post('/auth/register', data);
    // ...
  } catch (error) {
    console.error(error);
  }
};

export default apiClient;
