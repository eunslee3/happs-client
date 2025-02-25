import axios from 'axios';
import * as SecureStore from 'expo-secure-store'

export const instance = axios.create({
  baseURL: 'https://a592-137-22-50-106.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any = []; // Queue to store failed requests that need to be retried after token refresh

instance.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,  // If the request is successful, return the response
  async (error) => {
    if (error.response?.status === 401 && !isRefreshing) {
      // Only refresh token if it's not already refreshing
      isRefreshing = true;

      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        return Promise.reject(error);  // Reject if no refresh token is available
      }

      try {
        const response = await instance.post('/auth/refresh', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save the new tokens in SecureStore
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);

        // Retry all the failed requests with the new access token
        failedQueue.forEach((request: any) => request.resolve(accessToken));

        // Clear the failed request queue
        failedQueue = [];
      } catch (refreshError) {
        failedQueue.forEach((request: any) => request.reject(refreshError));
        failedQueue = [];
        return Promise.reject(refreshError);  // Reject if refresh fails
      } finally {
        isRefreshing = false;
      }

      // Add the original request to the queue and wait for the new access token
      const retryOriginalRequest = new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });

      // Retry the original request with the new access token
      error.config.headers['Authorization'] = `Bearer ${await SecureStore.getItemAsync('accessToken')}`;
      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);

