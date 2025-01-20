import { instance } from '../axiosInstance';
import axios from 'axios'
interface RegisterProps {
  password: string;
  email: string;
}

export const registerApi = async (registerObj: RegisterProps) => {
  try {
    const response  = await instance.post('/auth/signup', {
      email: registerObj.email,
      password: registerObj.password
    });
    return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}