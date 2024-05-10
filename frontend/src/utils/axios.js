import axios from 'axios';

// Create an Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set token in request headers
const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export { axiosInstance, setAuthToken };
