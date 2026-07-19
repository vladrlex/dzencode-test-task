import axios from 'axios';
import type { Store } from '@reduxjs/toolkit';
import { logout } from './authSlice';

export function setupAuthInterceptors(store: Store) {
  axios.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
}
