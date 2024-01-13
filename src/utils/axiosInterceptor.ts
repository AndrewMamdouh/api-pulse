import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import pako from 'pako';

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      // It's a network error
      toast.error('Network error. Please check your connection and try again.');
      console.error('Network Error Details:', error.stack || error); // Log the error stack or the error itself for debugging
    } else {
      // Server returned an error response
      const { status } = error.response;
      if (status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (status >= 400) {
        toast.error('Client error. Please check your data and try again.');
      }
      console.error(`API Error [${status}]:`, error.response); // Log the error for debugging or monitoring
    }
    return Promise.reject(error);
  }
);

/**
 *
 */
function shouldCompress(data: any) {
  const dataSizeInBytes = new TextEncoder().encode(JSON.stringify(data)).length;
  const oneMBInBytes = 1024 * 1024; //1 mb
  return dataSizeInBytes > oneMBInBytes;
}

// Request interceptor to compress payload if size > 1 MB
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers || {};
    if (config.data && shouldCompress(config.data)) {
      console.log('Compressing request payload');
      const compressedData = pako.gzip(JSON.stringify(config.data));
      config.data = compressedData;
      config.headers['Content-Encoding'] = 'gzip';
      // Set the Content-Type to application/json, or the actual content type of your request
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor remains unchanged
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Error handling code as before
  }
);
