import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { storage } from '@/utils/storage';


export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.clearAuth();
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; errors?: string[] }>;
    
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      
      if (data.message) {
        return data.message;
      }
      
      if (data.errors && Array.isArray(data.errors)) {
        return data.errors.join(', ');
      }
    }
    
    if (axiosError.message === 'Network Error') {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    if (axiosError.response?.status) {
      return `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};
