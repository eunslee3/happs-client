import { instance } from '../axiosInstance';

export const authenticateApi = async (email: string, password: string) => {
  try {
    const response  = await instance.post('/auth/validate-user', {
      email,
      password
    });
    return response
  } catch (err) {
    console.log(err);
    return err;
  }
}