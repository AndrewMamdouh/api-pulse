import axios from 'axios';
import getAuthHeaders from './common';

/**
 * Create Axios Client
 */
const axiosClient = (baseURL?: string) =>
  axios.create({
    baseURL: baseURL || (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_HOST_DEV_URL : process.env.REACT_APP_API_HOST_PROD_URL),
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

export default axiosClient;
