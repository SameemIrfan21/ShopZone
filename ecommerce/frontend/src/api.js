import axios from 'axios';

// Use REACT_APP_API_URL in production (Render backend), fallback to proxy in local dev
const baseURL = process.env.REACT_APP_API_URL || '';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
