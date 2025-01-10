import { instance } from '../axiosInstance';

export const googleAuthApi = async () => {
  try {
    const response  = await instance.get('/auth/google');
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}