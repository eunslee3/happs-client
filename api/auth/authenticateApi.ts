import { instance } from '../axiosInstance';

export const authenticateApi = async (username: string, password: string) => {
  try {
    const response  = await instance.post('/auth/validate-user', {
      username,
      password
    });
    return response
  } catch (err) {
    console.log(err);
    return err;
  }
}