import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://192.168.40.80:3000',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
})