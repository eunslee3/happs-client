import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://fb22-2605-4a80-f003-dea0-710c-c984-2f24-b1c4.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
