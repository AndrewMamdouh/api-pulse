import axios from 'axios';
import getAuthHeaders from './common';

/**
 * Create Axios Client
 */
const axiosClient = (baseURL?: string) =>
  axios.create({
    baseURL: baseURL || process.env.REACT_APP_API_HOST_URL,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

export default axiosClient;
