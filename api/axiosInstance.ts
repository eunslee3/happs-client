import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://6feb-2605-4a80-f003-dea0-d5ba-4032-402b-7bef.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
})